import { createContext, useContext, useReducer, useEffect, useState, type ReactNode } from 'react'
import type { CartItem, Product } from '../types'

interface CartState {
  items: CartItem[]
  isOpen: boolean
  couponCode: string
  discount: number
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity: number; selectedVariants?: Record<string, string>; resolvedPrice: number } }
  | { type: 'REMOVE_ITEM'; payload: { productId: string; selectedVariants?: Record<string, string> } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number; selectedVariants?: Record<string, string> } }
  | { type: 'CLEAR_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'APPLY_COUPON'; payload: { code: string; discount: number } }
  | { type: 'REMOVE_COUPON' }

const VALID_COUPONS: Record<string, number> = {
  'CMT10':     10,
  'TERPZ15':   15,
  'WELCOME20': 20,
}

function itemKey(productId: string, selectedVariants?: Record<string, string>): string {
  return `${productId}::${JSON.stringify(selectedVariants ?? {})}`
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const key = itemKey(action.payload.product.id, action.payload.selectedVariants)
      const existingIndex = state.items.findIndex(
        item => itemKey(item.product.id, item.selectedVariants) === key
      )
      if (existingIndex >= 0) {
        const updated = [...state.items]
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + action.payload.quantity,
        }
        return { ...state, items: updated, isOpen: true }
      }
      return {
        ...state,
        items: [
          ...state.items,
          {
            product: action.payload.product,
            quantity: action.payload.quantity,
            selectedVariants: action.payload.selectedVariants,
            resolvedPrice: action.payload.resolvedPrice,
          },
        ],
        isOpen: true,
      }
    }
    case 'REMOVE_ITEM': {
      const key = itemKey(action.payload.productId, action.payload.selectedVariants)
      return { ...state, items: state.items.filter(item => itemKey(item.product.id, item.selectedVariants) !== key) }
    }
    case 'UPDATE_QUANTITY': {
      const key = itemKey(action.payload.productId, action.payload.selectedVariants)
      if (action.payload.quantity <= 0) {
        return { ...state, items: state.items.filter(item => itemKey(item.product.id, item.selectedVariants) !== key) }
      }
      return {
        ...state,
        items: state.items.map(item =>
          itemKey(item.product.id, item.selectedVariants) === key
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      }
    }
    case 'CLEAR_CART':
      return { ...state, items: [], couponCode: '', discount: 0 }
    case 'OPEN_CART':
      return { ...state, isOpen: true }
    case 'CLOSE_CART':
      return { ...state, isOpen: false }
    case 'APPLY_COUPON':
      return { ...state, couponCode: action.payload.code, discount: action.payload.discount }
    case 'REMOVE_COUPON':
      return { ...state, couponCode: '', discount: 0 }
    default:
      return state
  }
}

const STORAGE_KEY = 'cmt_cart'

const loadCartFromStorage = (): CartState => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      const items = (parsed.items ?? []).map((item: CartItem) => ({
        ...item,
        resolvedPrice: item.resolvedPrice ?? item.product.price,
      }))
      return { ...parsed, items, isOpen: false }
    }
  } catch {
    // ignore
  }
  return { items: [], isOpen: false, couponCode: '', discount: 0 }
}

interface CartContextValue {
  state: CartState
  addItem: (product: Product, quantity?: number, selectedVariants?: Record<string, string>) => void
  removeItem: (productId: string, selectedVariants?: Record<string, string>) => void
  updateQuantity: (productId: string, quantity: number, selectedVariants?: Record<string, string>) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  applyCoupon: (code: string) => boolean
  removeCoupon: () => void
  itemCount: number
  subtotal: number
  discountAmount: number
  total: number
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, loadCartFromStorage)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        items: state.items,
        couponCode: state.couponCode,
        discount: state.discount,
      }))
    }
  }, [state.items, state.couponCode, state.discount, mounted])

  const subtotal = state.items.reduce(
    (sum, item) => sum + (item.resolvedPrice ?? item.product.price) * item.quantity,
    0,
  )
  const discountAmount = (subtotal * state.discount) / 100
  const total = subtotal - discountAmount

  const value: CartContextValue = {
    state,
    addItem: (product, quantity = 1, selectedVariants) => {
      const resolvedPrice = (() => {
        if (!selectedVariants) return product.price
        const modifier = product.variants
          ?.flatMap(g => g.options)
          .find(opt => Object.values(selectedVariants).includes(opt.value))
          ?.priceModifier
        return modifier ?? product.price
      })()
      dispatch({ type: 'ADD_ITEM', payload: { product, quantity, selectedVariants, resolvedPrice } })
    },
    removeItem: (productId, selectedVariants) =>
      dispatch({ type: 'REMOVE_ITEM', payload: { productId, selectedVariants } }),
    updateQuantity: (productId, quantity, selectedVariants) =>
      dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity, selectedVariants } }),
    clearCart: () => dispatch({ type: 'CLEAR_CART' }),
    openCart:  () => dispatch({ type: 'OPEN_CART' }),
    closeCart: () => dispatch({ type: 'CLOSE_CART' }),
    applyCoupon: (code) => {
      const discount = VALID_COUPONS[code.toUpperCase()]
      if (discount) {
        dispatch({ type: 'APPLY_COUPON', payload: { code: code.toUpperCase(), discount } })
        return true
      }
      return false
    },
    removeCoupon: () => dispatch({ type: 'REMOVE_COUPON' }),
    itemCount: state.items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal,
    discountAmount,
    total,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
