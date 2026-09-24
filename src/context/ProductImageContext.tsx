// Compatibility shim — implementation lives in MediaContext.tsx.
// All existing imports of useProductImages() continue to work unchanged.
export { useProductImages } from './MediaContext'

export function ProductImageProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
