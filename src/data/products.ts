import type { Product, Collection } from '../types'

const BLANK = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%231A1628'/%3E%3C/svg%3E"

export const collections: Collection[] = [
  {
    id: 'col-1',
    slug: 'indoor-strains',
    name: 'Indoor Strains',
    description: 'Premium indoor-grown under controlled conditions. Highest quality, maximum terpenes.',
    image: 'https://images.unsplash.com/photo-1603386329225-868f9b1ee6c9?auto=format&fit=crop&w=800&q=80',
    productCount: 6,
  },
  {
    id: 'col-2',
    slug: 'outdoor-greenhouse',
    name: 'Outdoor & Greenhouse',
    description: 'Naturally grown under European sun. Bold aromas, authentic character.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80',
    productCount: 4,
  },
  {
    id: 'col-3',
    slug: 'accessories',
    name: 'Accessories',
    description: 'Everything you need. Premium bongs, grinders, papers and more.',
    image: 'https://images.unsplash.com/photo-1617791160505-6f00504e3519?auto=format&fit=crop&w=800&q=80',
    productCount: 8,
  },
  {
    id: 'col-4',
    slug: 'merch',
    name: 'CMT Merch',
    description: 'Official CatchMyTerpz Merchandise. Represent 069.',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80',
    productCount: 5,
  },
  {
    id: 'col-5',
    slug: 'pre-rolls',
    name: 'Pre-Rolls',
    description: 'Hand-rolled pre-rolls from our best strains. Ready to go.',
    image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80',
    productCount: 4,
  },
  {
    id: 'col-6',
    slug: 'concentrates',
    name: 'Concentrates & Terpenes',
    description: 'Pure terpene profiles and premium extracts for true connoisseurs.',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
    productCount: 5,
  },
]

export const products: Product[] = [
  {
    id: 'prod-1',
    slug: 'purple-zkittlez-indoor',
    name: 'Purple Zkittlez – Indoor',
    shortDescription: 'Berry candy that hits smooth and settles deep. Trichome-heavy buds with an explosive sweet-grape profile.',
    description: `Purple Zkittlez is one of the most coveted strains on the market. Dense, resin-coated buds deliver a sweet burst of berries and citrus on the inhale, with a long, relaxing finish that keeps you coming back.

**Effect:** Relaxing, euphoric, gently creative
**Aroma:** Berries · Grape · Candy · Soft earth
**Type:** Indica-Hybrid (60% Indica / 40% Sativa)

Perfect for unwinding in the evening or slow sessions with good company.`,
    specifications: {
      'Type': 'Indica-Hybrid',
      'THC': '~22–26%',
      'CBD': '< 1%',
      'Grow': 'Indoor',
      'Terpenes': 'Myrcene, Limonene, Caryophyllene',
      'Flowering': '8–9 weeks',
    },
    price: 12.00,
    compareAtPrice: 15.00,
    images: [BLANK],
    category: 'supplements',
    collection: 'static-hash',
    inventory: 42,
    rating: 4.9,
    reviewCount: 187,
    badge: 'Bestseller',
    featured: true,
    bestSeller: true,
    tags: ['indica', 'zkittlez', 'frucht', 'indoor', 'purple'],
  },
  {
    id: 'prod-2',
    slug: 'og-kush-classic',
    name: 'OG Kush – Classic',
    shortDescription: 'The benchmark. Earthy, pine-laced, and unapologetically strong — the strain every classic gets measured against.',
    description: `OG Kush is a legend, and our indoor cut is among the finest available. The aroma is unmistakable: pine resin, citrus, and a hint of diesel that lingers long after the jar is closed.

**Effect:** Powerful, stress-relieving, deeply relaxing
**Aroma:** Earth · Pine · Citrus · Diesel
**Type:** Hybrid (50/50)

A go-to for seasoned smokers and those who want a proper, full-bodied experience.`,
    specifications: {
      'Type': 'Hybrid',
      'THC': '~20–24%',
      'CBD': '< 1%',
      'Grow': 'Indoor',
      'Terpenes': 'Myrcene, Limonene, Caryophyllene',
    },
    price: 11.00,
    images: [BLANK],
    category: 'supplements',
    collection: 'static-hash',
    inventory: 68,
    rating: 4.8,
    reviewCount: 243,
    badge: 'Empfohlen',
    featured: true,
    bestSeller: true,
    tags: ['hybrid', 'og', 'kush', 'klassiker', 'indoor'],
  },
  {
    id: 'prod-3',
    slug: 'gelato-41-indoor',
    name: 'Gelato #41 – Indoor',
    shortDescription: 'Creamy, sweet, intense. Gelato #41 is a work of art — dessert-forward with a balanced, euphoric finish.',
    description: `Gelato #41 is one of the most requested strains for good reason. Our indoor grow brings out everything this cultivar has to offer: trichome-frosted buds that smell like vanilla soft-serve and hit like a warm wave.

**Effect:** Euphoric, creative, relaxed alertness
**Aroma:** Vanilla · Berries · Creamy sweetness · Mint
**Type:** Hybrid (55% Indica / 45% Sativa)

A crowd-pleaser that consistently over-delivers on both flavour and effect.`,
    specifications: {
      'Type': 'Indica-Hybrid',
      'THC': '~24–28%',
      'CBD': '< 1%',
      'Grow': 'Indoor',
      'Terpenes': 'Caryophyllene, Limonene, Humulene',
      'Flowering': '8–9 weeks',
    },
    price: 13.00,
    compareAtPrice: 16.00,
    images: [BLANK],
    category: 'supplements',
    collection: 'static-hash',
    inventory: 29,
    rating: 4.9,
    reviewCount: 156,
    badge: 'Limitiert',
    featured: true,
    bestSeller: false,
    new: true,
    tags: ['hybrid', 'gelato', 'süß', 'indoor', 'premium'],
  },
  {
    id: 'prod-4',
    slug: 'wedding-cake-indoor',
    name: 'Wedding Cake – Indoor',
    shortDescription: 'Rich, resinous, and deeply relaxing. Wedding Cake wraps you in warm vanilla and spice from first smoke to last.',
    description: `Wedding Cake earns its name. Every hit is dense with sweet dough, vanilla, and a peppery finish — followed by a heavy indica body effect that makes this one strictly for the evening.

**Effect:** Deeply relaxing, sedating, tension-dissolving
**Aroma:** Vanilla · Sweet dough · Earth · Pepper
**Type:** Indica (70% Indica / 30% Sativa)

When you need a full stop at the end of the day, this is it.`,
    specifications: {
      'Type': 'Indica-Dominant',
      'THC': '~22–25%',
      'CBD': '< 1%',
      'Grow': 'Indoor',
      'Terpenes': 'Caryophyllene, Myrcene, Limonene',
    },
    price: 12.00,
    images: [BLANK],
    category: 'supplements',
    collection: 'static-hash',
    inventory: 15,
    rating: 4.7,
    reviewCount: 98,
    featured: false,
    bestSeller: true,
    tags: ['indica', 'wedding cake', 'entspannung', 'indoor'],
  },
  {
    id: 'prod-5',
    slug: 'amnesia-haze-outdoor',
    name: 'Amnesia Haze – Outdoor',
    shortDescription: 'Sun-grown and energetic. Bright lemon and fresh herb with a clear-headed, creative high that carries you through the day.',
    description: `Amnesia Haze grown under open sky develops a terpene profile that indoor cultivation simply can't match. The extra sun exposure gives it a richer, more layered citrus character and a long-lasting sativa effect.

**Effect:** Energetic, cerebral, creatively stimulating
**Aroma:** Lemon · Earth · Haze · Fresh herbs
**Type:** Sativa-Dominant (80% Sativa)

The classic choice for productive days and social sessions alike.`,
    specifications: {
      'Type': 'Sativa-Dominant',
      'THC': '~18–22%',
      'CBD': '< 1%',
      'Grow': 'Outdoor',
      'Terpenes': 'Limonene, Terpinolene, Myrcene',
    },
    price: 9.00,
    images: [BLANK],
    category: 'supplements',
    collection: 'wpff',
    inventory: 85,
    rating: 4.6,
    reviewCount: 134,
    featured: false,
    bestSeller: false,
    tags: ['sativa', 'haze', 'energie', 'outdoor', 'zitrone'],
  },
  {
    id: 'prod-6',
    slug: 'black-diamond-og',
    name: 'Black Diamond OG – Indoor',
    shortDescription: 'Dark, lustrous buds dripping in resin. Wine-berry aroma, deep body effect — for those who know what they want.',
    description: `Black Diamond OG announces itself before the jar is even open. The aroma alone — red wine, wild strawberry, and damp earth — tells you exactly what kind of evening you're in for.

**Effect:** Deeply relaxed, euphoric, ideal for nights
**Aroma:** Red wine · Strawberry · Earth · Wood
**Type:** Indica (75% Indica)

Limited and consistently sought-after. Don't sleep on it.`,
    specifications: {
      'Type': 'Indica-Dominant',
      'THC': '~23–27%',
      'CBD': '< 1%',
      'Grow': 'Indoor',
      'Terpenes': 'Myrcene, Caryophyllene, Pinene',
    },
    price: 14.00,
    compareAtPrice: 17.00,
    images: [BLANK],
    category: 'supplements',
    collection: 'static-hash',
    inventory: 18,
    rating: 4.8,
    reviewCount: 72,
    badge: 'Neu',
    featured: true,
    bestSeller: false,
    new: true,
    tags: ['indica', 'black diamond', 'premium', 'indoor'],
  },
  {
    id: 'prod-7',
    slug: 'cmt-grinder-4-piece',
    name: 'CMT 4-Part Grinder',
    shortDescription: 'Precision-engineered aircraft aluminium with diamond-cut teeth and a deep kief catcher. Built to last.',
    description: `The official CMT 4-Part Grinder is made from high-grade aircraft aluminium with CNC-milled diamond-cut teeth. It grinds clean every time, catches every crystal, and holds up to daily use without missing a beat.

- 63mm diameter
- 4 chambers with pollen screen
- CNC diamond-cut teeth
- Magnetic closure
- Limited CMT branding`,
    specifications: {
      'Material': 'Aircraft Aluminium',
      'Diameter': '63mm',
      'Chambers': '4 (incl. Kief Catcher)',
      'Colour': 'Black / Purple / Silver',
      'Branding': 'CatchMyTerpz 069',
    },
    price: 29.99,
    compareAtPrice: 39.99,
    images: [BLANK],
    category: 'wellness',
    collection: 'bubble-hash',
    inventory: 54,
    rating: 4.9,
    reviewCount: 203,
    badge: 'Bestseller',
    featured: true,
    bestSeller: true,
    tags: ['grinder', 'accessory', 'cmt', 'merch'],
  },
  {
    id: 'prod-8',
    slug: 'cmt-hoodie-classic',
    name: 'CMT Hoodie – Classic Black',
    shortDescription: 'Heavyweight 400g cotton. Oversized fit, embroidered logo, bold back print. Wear it like you mean it.',
    description: `The official CMT Hoodie is built from 400g French Terry cotton — heavy, structured, and designed to last. Oversized cut for a relaxed fit, embroidered CMT logo on the chest, large back print.

**Details:**
- 400g/m² French Terry Cotton
- Oversized cut
- Embroidered chest logo
- Full back print
- Colour: Black with green print`,
    specifications: {
      'Material': '100% Cotton, 400g/m²',
      'Fit': 'Oversized',
      'Branding': 'Embroidered + Print',
      'Care': '30°C gentle wash',
      'Made in': 'EU',
    },
    price: 54.99,
    compareAtPrice: 69.99,
    images: [BLANK],
    category: 'wellness',
    collection: 'static-hash',
    inventory: 37,
    rating: 4.8,
    reviewCount: 89,
    badge: 'Empfohlen',
    featured: true,
    bestSeller: true,
    tags: ['hoodie', 'merch', 'clothing', 'cmt'],
  },
  {
    id: 'prod-9',
    slug: 'cmt-pre-roll-5pack',
    name: 'CMT Pre-Roll 5er Pack',
    shortDescription: 'Five perfectly rolled, ready to spark. Each 1g joint packed with current top-shelf strains — smooth, consistent, zero effort.',
    description: `Five hand-rolled pre-rolls from our best current indoor strains. Evenly packed, tightly rolled, with unbleached cardboard filters. Whether it's a solo session or something to pass around, these are always ready.

**Contains:** Mix of current top strains
**Each pre-roll:** 1g, cardboard filter, unbleached papers`,
    specifications: {
      'Contents': '5 x 1g Pre-Rolls',
      'Filter': 'Cardboard (unbleached)',
      'Papers': 'Hemp, unbleached',
      'Grow': 'Indoor',
      'Strains': 'Current mix',
    },
    price: 49.99,
    compareAtPrice: 59.99,
    images: [BLANK],
    category: 'supplements',
    collection: 'wpff',
    inventory: 63,
    rating: 4.7,
    reviewCount: 145,
    badge: 'Bestseller',
    featured: true,
    bestSeller: true,
    tags: ['pre-roll', 'fertig', 'indoor', 'mix'],
  },
  {
    id: 'prod-10',
    slug: 'terpene-blend-purple-zkittlez',
    name: 'Terpene Blend – Purple Zkittlez',
    shortDescription: 'Pure Zkittlez terpene extract — berry, grape, and candy in concentrated form. One or two drops is all it takes.',
    description: `Isolated Purple Zkittlez terpene profile in food-grade quality. Captures the full berry-candy character of the strain in a highly concentrated form — ideal for enhancing any session or aromatherapy use.

**Terpenes:** Myrcene (38%), Limonene (25%), Caryophyllene (18%), Linalool (12%), other (7%)
**Recommended use:** 1–3% blend ratio`,
    specifications: {
      'Contents': '1ml / 5ml / 10ml',
      'Purity': '> 99%',
      'Food-grade': 'Yes',
      'Storage': 'Cool and dark',
      'Origin': 'EU',
    },
    price: 9.99,
    images: [BLANK],
    category: 'supplements',
    collection: 'bubble-hash',
    inventory: 91,
    rating: 4.6,
    reviewCount: 67,
    badge: 'Neu',
    featured: false,
    bestSeller: false,
    new: true,
    tags: ['terpene', 'konzentrat', 'zkittlez', 'aroma'],
  },
  {
    id: 'prod-11',
    slug: 'cmt-tshirt-069',
    name: 'CMT T-Shirt – 069 Edition',
    shortDescription: 'Heavy 250g ring-spun tee with the CMT 069 artwork. Clean fit, quality that shows.',
    description: `The official CatchMyTerpz 069 T-Shirt. Heavy 250g ring-spun cotton with the iconic CMT artwork printed front and back. Holds its shape, holds its colour, built to be worn.

- 250g/m² Ring-Spun Cotton
- Regular fit
- CMT chest logo
- Large back print
- Premium screen-print inks`,
    specifications: {
      'Material': '100% Ring-Spun Cotton',
      'Weight': '250g/m²',
      'Fit': 'Regular',
      'Branding': 'Screen print front + back',
      'Made in': 'EU',
    },
    price: 29.99,
    images: [BLANK],
    category: 'wellness',
    collection: 'static-hash',
    inventory: 48,
    rating: 4.7,
    reviewCount: 112,
    featured: false,
    bestSeller: true,
    tags: ['tshirt', 'merch', 'clothing', '069'],
  },
  {
    id: 'prod-12',
    slug: 'rawlings-king-size-papers',
    name: 'Premium Hemp Papers – King Size',
    shortDescription: 'Ultra-thin unbleached hemp papers. Slow-burning, clean-tasting, no additives — just the way it should be.',
    description: `High-quality, unbleached King Size papers made from 100% hemp fibres. Ultra-thin for maximum flavour with no chemical interference, natural arabic gum strip, slow and even burn.

- 50 leaves per booklet
- Unbleached, chlorine-free
- Natural acacia gum strip
- Slow-burn for an optimal experience`,
    specifications: {
      'Format': 'King Size (109mm)',
      'Leaves': '50 per booklet',
      'Material': '100% Hemp, unbleached',
      'Gum': 'Natural acacia gum',
    },
    price: 3.99,
    compareAtPrice: 5.99,
    images: [BLANK],
    category: 'wellness',
    collection: 'bubble-hash',
    inventory: 320,
    rating: 4.5,
    reviewCount: 289,
    featured: false,
    bestSeller: true,
    tags: ['papers', 'zubehör', 'hanf', 'king size'],
  },
  {
    id: 'prod-13',
    slug: 'moroccan-gold-static-hash',
    name: 'Moroccan Gold – Static Hash',
    shortDescription: 'The timeless classic. Hand-pressed Moroccan pollen with a warm, spiced earth aroma and a smooth, satisfying smoke.',
    description: `Moroccan Gold is what hash was before everything else. Hand-pressed from fine dry-sifted pollen, golden-brown with a soft, pliable core. The smoke is clean, warm, and endlessly familiar.

**Effect:** Relaxing, gently euphoric, body-warm
**Aroma:** Spice · Earth · Wood · Sweet smoke
**Type:** Traditional pressed hash`,
    specifications: {
      'Type': 'Static Hash',
      'THC': '~18–22%',
      'CBD': '~1–2%',
      'Consistency': 'Soft, pliable',
    },
    price: 10.00,
    images: [BLANK],
    category: 'supplements',
    collection: 'static-hash',
    inventory: 75,
    rating: 4.7,
    reviewCount: 118,
    featured: false,
    bestSeller: true,
    tags: ['hash', 'marokko', 'klassiker', 'static-hash'],
  },
  {
    id: 'prod-14',
    slug: 'afghan-black-static-hash',
    name: 'Afghan Black – Static Hash',
    shortDescription: 'Dark, oily, and seriously potent. Afghan Black is old-world hash done right — a heavy hit with depth and character.',
    description: `Afghan Black is one of the most revered traditional hashes in the world. Deep black on the outside, warm brown-green at the core, with an intense aromatic presence that fills the room before you even light up.

**Effect:** Strongly relaxing, sedating, body-heavy
**Aroma:** Black tea · Earth · Sandalwood · Resin
**Type:** Traditional pressed hash`,
    specifications: {
      'Type': 'Static Hash',
      'THC': '~22–28%',
      'CBD': '< 1%',
      'Consistency': 'Firm outside, soft inside',
    },
    price: 12.00,
    compareAtPrice: 15.00,
    images: [BLANK],
    category: 'supplements',
    collection: 'static-hash',
    inventory: 40,
    rating: 4.8,
    reviewCount: 94,
    badge: 'Premium',
    featured: true,
    bestSeller: false,
    tags: ['hash', 'afghan', 'dark', 'static-hash'],
  },
  {
    id: 'prod-15',
    slug: 'caramello-static-hash',
    name: 'Caramello – Static Hash',
    shortDescription: 'Soft, golden, and unmistakably sweet. Caramello burns like it was made for slow evenings.',
    description: `Caramello lives up to every expectation its name sets. Pale golden-brown, pliable, and almost oily — the smoke is velvety smooth with a sweet caramel character that lingers on the palate.

**Effect:** Relaxing, gently uplifting, mood-softening
**Aroma:** Caramel · Vanilla · Light wood
**Type:** Pressed pollen hash`,
    specifications: {
      'Type': 'Static Hash',
      'THC': '~16–20%',
      'CBD': '~2%',
      'Consistency': 'Very soft, slightly oily',
      'Colour': 'Golden brown',
    },
    price: 11.00,
    images: [BLANK],
    category: 'supplements',
    collection: 'static-hash',
    inventory: 55,
    rating: 4.6,
    reviewCount: 77,
    featured: false,
    bestSeller: false,
    tags: ['hash', 'caramello', 'süß', 'static-hash'],
  },
  {
    id: 'prod-16',
    slug: 'lebanese-red-static-hash',
    name: 'Lebanese Red – Static Hash',
    shortDescription: 'A true rarity. Cedar-spiced, reddish hash with a cerebral edge and a flavour profile that simply cannot be replicated.',
    description: `Lebanese Red is one of the rarest traditional hashes you'll find. Its distinctive reddish hue and complex, spiced aroma come from mountain-grown genetics and centuries of craft. Every piece is different. Every session is memorable.

**Effect:** Cerebral, gently euphoric, relaxing
**Aroma:** Red pepper · Herbs · Earth · Cedar wood
**Type:** Traditional Lebanese hash`,
    specifications: {
      'Type': 'Static Hash',
      'THC': '~14–18%',
      'CBD': '~2–3%',
      'Colour': 'Reddish brown',
    },
    price: 13.00,
    compareAtPrice: 16.00,
    images: [BLANK],
    category: 'supplements',
    collection: 'static-hash',
    inventory: 22,
    rating: 4.9,
    reviewCount: 43,
    badge: 'Rarität',
    featured: true,
    bestSeller: false,
    tags: ['hash', 'libanon', 'red', 'static-hash', 'rarität'],
  },
  {
    id: 'prod-17',
    slug: 'lemon-haze-wpff',
    name: 'Lemon Haze – WPFF',
    shortDescription: 'Sharp citrus, clean energy. Lemon Haze WPFF is your go-to for a bright, focused lift without the weight.',
    description: `Lemon Haze in WPFF quality brings the full citrus terpene profile to the surface. Light, energetic, and refreshing — this one wakes you up without pushing you over the edge.

**Effect:** Uplifting, creative, focused
**Aroma:** Lemon · Lime · Fresh herbs · Haze
**Type:** Sativa-Dominant WPFF`,
    specifications: {
      'Type': 'WPFF',
      'THC': '~19–23%',
      'CBD': '< 1%',
      'Terpenes': 'Limonene, Terpinolene, Ocimene',
    },
    price: 10.00,
    images: [BLANK],
    category: 'supplements',
    collection: 'wpff',
    inventory: 60,
    rating: 4.6,
    reviewCount: 88,
    featured: false,
    bestSeller: true,
    tags: ['wpff', 'lemon', 'haze', 'sativa'],
  },
  {
    id: 'prod-18',
    slug: 'gorilla-glue-wpff',
    name: 'Gorilla Glue #4 – WPFF',
    shortDescription: 'Sticky, dense, and seriously potent. GG4 WPFF coats everything in resin and carries you somewhere else entirely.',
    description: `Gorilla Glue #4 is named for a reason — the resin production on these buds is extreme. In WPFF form, the full earthy-coffee-pine terpene profile is front and centre, followed by a long, heavy body effect that plants you firmly where you sit.

**Effect:** Strongly relaxing, euphoric, body-heavy
**Aroma:** Earth · Pine · Coffee · Chemical
**Type:** Hybrid WPFF`,
    specifications: {
      'Type': 'WPFF',
      'THC': '~24–28%',
      'CBD': '< 1%',
      'Terpenes': 'Caryophyllene, Myrcene, Limonene',
    },
    price: 12.00,
    compareAtPrice: 14.00,
    images: [BLANK],
    category: 'supplements',
    collection: 'wpff',
    inventory: 35,
    rating: 4.8,
    reviewCount: 156,
    badge: 'Bestseller',
    featured: true,
    bestSeller: true,
    tags: ['wpff', 'gorilla glue', 'hybrid', 'stark'],
  },
  {
    id: 'prod-19',
    slug: 'blue-dream-wpff',
    name: 'Blue Dream – WPFF',
    shortDescription: 'Effortlessly balanced. Blue Dream pairs blueberry sweetness with a smooth, all-day high that never tips too far.',
    description: `Blue Dream is the all-rounder that never disappoints. In WPFF quality, the blueberry-haze aroma is more pronounced, and the effect is exactly what you want — balanced, social, and easy to manage throughout the day.

**Effect:** Balanced, creative, calmly alert
**Aroma:** Blueberry · Sweetness · Light haze
**Type:** Sativa-Hybrid WPFF`,
    specifications: {
      'Type': 'WPFF',
      'THC': '~20–24%',
      'CBD': '~1%',
      'Terpenes': 'Myrcene, Pinene, Caryophyllene',
    },
    price: 11.00,
    images: [BLANK],
    category: 'supplements',
    collection: 'wpff',
    inventory: 48,
    rating: 4.7,
    reviewCount: 102,
    featured: false,
    bestSeller: false,
    tags: ['wpff', 'blue dream', 'beere', 'sativa'],
  },
  {
    id: 'prod-20',
    slug: 'sour-diesel-wpff',
    name: 'Sour Diesel – WPFF',
    shortDescription: 'Fuel for the mind. Sour D hits fast with a sharp diesel kick that settles into long-lasting cerebral energy.',
    description: `Sour Diesel doesn't ease you in — it arrives with a sharp, pungent diesel-citrus punch and a fast-acting cerebral effect that keeps you sharp and motivated. For those who know what they want from a sativa.

**Effect:** Cerebral, energetic, focusing
**Aroma:** Diesel · Citrus · Earth · Chemical
**Type:** Sativa WPFF`,
    specifications: {
      'Type': 'WPFF',
      'THC': '~21–25%',
      'CBD': '< 1%',
      'Terpenes': 'Limonene, Terpinolene, Myrcene',
    },
    price: 11.00,
    images: [BLANK],
    category: 'supplements',
    collection: 'wpff',
    inventory: 30,
    rating: 4.7,
    reviewCount: 79,
    featured: false,
    bestSeller: false,
    tags: ['wpff', 'sour diesel', 'sativa', 'energie'],
  },
  {
    id: 'prod-21',
    slug: 'ice-hash-4-star',
    name: 'Ice Hash – 4 Star',
    shortDescription: 'Ice water extracted, solvent-free. 4-Star quality means rich terpenes, smooth melt, and a noticeably pure experience.',
    description: `Our 4-Star Ice Hash is produced through careful ice water extraction — no solvents, no shortcuts. The result is a semi full-melt hash with a full, aromatic terpene profile and a clean, satisfying effect.

**Effect:** Relaxing, body-forward, mildly cerebral
**Aroma:** Fresh grass · Earth · Light citrus
**Extraction:** Ice water (bubble bags), solvent-free`,
    specifications: {
      'Type': 'Bubble Hash',
      'Stars': '4 Star (Semi Full Melt)',
      'THC': '~40–50%',
      'Extraction': 'Ice water, solvent-free',
      'Melt': 'Semi Full Melt',
    },
    price: 15.00,
    compareAtPrice: 18.00,
    images: [BLANK],
    category: 'supplements',
    collection: 'bubble-hash',
    inventory: 28,
    rating: 4.8,
    reviewCount: 61,
    badge: 'Premium',
    featured: true,
    bestSeller: false,
    tags: ['bubble-hash', 'ice hash', 'extraktion', 'lösungsmittelfrei'],
  },
  {
    id: 'prod-22',
    slug: 'full-melt-bubble-hash-6star',
    name: 'Full Melt – 6 Star Bubble Hash',
    shortDescription: 'The pinnacle of hash. 6-Star Full Melt disappears completely — pure resin, zero residue, maximum expression.',
    description: `6-Star Full Melt is as good as hash gets. Produced through single-pass ice water extraction at 73–120 micron, it vaporises with zero residue — nothing left behind but flavour and effect. For those who refuse to compromise.

**Effect:** Powerful, complex, long-lasting
**Aroma:** Intensely strain-specific terpene profile
**Extraction:** Single-pass ice water, 73–120 micron`,
    specifications: {
      'Type': 'Bubble Hash',
      'Stars': '6 Star (Full Melt)',
      'THC': '~60–70%',
      'Extraction': 'Single-pass ice water',
      'Micron': '73–120µm',
    },
    price: 20.00,
    compareAtPrice: 25.00,
    images: [BLANK],
    category: 'supplements',
    collection: 'bubble-hash',
    inventory: 12,
    rating: 5.0,
    reviewCount: 34,
    badge: 'Limitiert',
    featured: true,
    bestSeller: false,
    new: true,
    tags: ['bubble-hash', 'full melt', '6 star', 'premium', 'connoisseur'],
  },
  {
    id: 'prod-23',
    slug: 'live-bubble-hash-gelato',
    name: 'Live Bubble Hash – Gelato',
    shortDescription: 'Extracted fresh-frozen to preserve every terpene. Live Gelato Bubble Hash is the full-spectrum experience in its purest form.',
    description: `Live Bubble Hash is made from fresh-frozen material before it ever dries — preserving the volatile terpenes that normally evaporate during curing. This Gelato profile is intensely aromatic, creamy, and rich in a way dried material simply cannot match.

**Effect:** Euphoric, relaxing, intensely aromatic
**Aroma:** Vanilla · Creamy berries · Fresh mint
**Extraction:** Fresh-frozen, ice water`,
    specifications: {
      'Type': 'Live Bubble Hash',
      'THC': '~55–65%',
      'Extraction': 'Fresh-frozen, ice water',
      'Strain': 'Gelato #41',
      'Melt': 'Full Melt',
    },
    price: 18.00,
    compareAtPrice: 22.00,
    images: [BLANK],
    category: 'supplements',
    collection: 'bubble-hash',
    inventory: 20,
    rating: 4.9,
    reviewCount: 48,
    badge: 'Neu',
    featured: true,
    bestSeller: false,
    new: true,
    tags: ['bubble-hash', 'live', 'gelato', 'fresh frozen'],
  },
  {
    id: 'prod-24',
    slug: 'dry-sift-hash-og',
    name: 'Dry Sift – OG Kush Hash',
    shortDescription: 'Mechanically sifted OG Kush crystals. No solvents, no shortcuts — earthy pine flavour and old-school clean quality.',
    description: `Dry Sift is one of the oldest and most respected forms of cannabis extraction. Our OG Kush Dry Sift is golden, fine, and pressed to order — full of the earthy pine character the strain is known for, with a clean burn and no residue.

**Effect:** Powerful, relaxing, classic OG body
**Aroma:** Earth · Pine · Citrus · Diesel
**Extraction:** Mechanical sifting, solvent-free`,
    specifications: {
      'Type': 'Bubble Hash / Dry Sift',
      'THC': '~45–55%',
      'Extraction': 'Mechanical sifting',
      'Strain': 'OG Kush',
      'Form': 'Loose crystals',
    },
    price: 14.00,
    images: [BLANK],
    category: 'supplements',
    collection: 'bubble-hash',
    inventory: 33,
    rating: 4.7,
    reviewCount: 55,
    featured: false,
    bestSeller: true,
    tags: ['bubble-hash', 'dry sift', 'og kush', 'mechanisch'],
  },
]

export const getFeaturedProducts = () => products.filter((p) => p.featured)
export const getBestSellers = () => products.filter((p) => p.bestSeller)
export const getProductBySlug = (slug: string) => products.find((p) => p.slug === slug)
export const getCollectionBySlug = (slug: string) => collections.find((c) => c.slug === slug)
export const getProductsByCollection = (slug: string) => products.filter((p) => p.collection === slug)
export const getRelatedProducts = (product: Product, limit = 4) =>
  products
    .filter((p) => p.id !== product.id && (p.collection === product.collection || p.category === product.category))
    .slice(0, limit)
