import { Product, Seller, CourierProvider, ProductReview } from '../types';

const imgRedRings = '/src/assets/images/stylemodiste_red_rings_crepe_1785335086374.jpg';
const imgGreenTulip = '/src/assets/images/stylemodiste_green_tulip_silk_1785335100874.jpg';
const imgBlueFloral = '/src/assets/images/stylemodiste_blue_floral_chiffon_1785335115264.jpg';
const imgFlameSatin = '/src/assets/images/stylemodiste_flame_satin_1785335144490.jpg';
const imgFuchsiaBaroque = '/src/assets/images/stylemodiste_fuchsia_baroque_1785335157647.jpg';
const imgSwirlChiffon = '/src/assets/images/stylemodiste_swirl_chiffon_1785335170751.jpg';

export const INITIAL_SELLERS: Seller[] = [
  {
    id: 's1',
    storeName: 'Stylemodiste Fabric Atelier',
    sellerName: 'Kemi Adebayo (Stylemodiste)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    city: 'Lekki Phase 1, Lagos',
    state: 'Lagos',
    bvnVerified: true,
    ninVerified: true,
    rating: 4.98,
    totalReviews: 240,
    totalSales: 680,
    joinedDate: 'Jan 2023',
    responseRate: '< 10 mins',
    badge: 'Top Rated Fabric Dealer',
    bio: 'Direct importer of premium crepe, mulberry silk, breathable chiffon, French Chantilly lace, and luxury wrappers.'
  },
  {
    id: 's2',
    storeName: 'Stylemodiste Thrift Vault',
    sellerName: 'Blessing Sterling',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=250',
    city: 'Yaba, Lagos Mainland',
    state: 'Lagos',
    bvnVerified: true,
    ninVerified: true,
    rating: 4.92,
    totalReviews: 195,
    totalSales: 512,
    joinedDate: 'Jan 2024',
    responseRate: '< 15 mins',
    badge: 'Top Rated Thrifter',
    bio: 'Hand-picked Grade A vintage thrift wears, Y2K tops, pre-loved designer denim, and authentic retro jackets.'
  },
  {
    id: 's3',
    storeName: 'Abuja Luxury Fabric & Thrift',
    sellerName: 'Hauwa Mohammed',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    city: 'Wuse II, Abuja',
    state: 'Abuja FCT',
    bvnVerified: true,
    ninVerified: true,
    rating: 4.95,
    totalReviews: 140,
    totalSales: 380,
    joinedDate: 'Nov 2023',
    responseRate: '< 10 mins',
    badge: 'Fast Shipper',
    bio: 'High-end Chantilly lace, Duchess satin, silk wrappers, and curated Grade A thrift dresses in FCT.'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  // FABRICS SECTION
  {
    id: 'f1',
    title: "Stylemodiste Crimson Eye-Print Heavy Crepe Fabric (6 Yards)",
    description: "Original Stylemodiste signature heavy stretch crepe in vibrant crimson red with rich concentric eye geometric print. Smooth, wrinkle-free, heavy drape with subtle stretch. Perfect for tailored maxi gowns, AsoEbi Owambe attire, boubous, and two-piece sets.",
    priceNaira: 22500,
    originalPriceNaira: 35000,
    section: 'fabrics',
    category: 'Crepe Fabrics',
    condition: 'Brand New Fabric',
    size: '6 Yards Full Cut (48" Width)',
    gender: 'Women',
    images: [
      imgRedRings,
      'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&q=80&w=800'
    ],
    sellerId: 's1',
    seller: INITIAL_SELLERS[0],
    stock: 12,
    viewCount: 680,
    likesCount: 210,
    tags: ['Crepe', 'StylemodisteOriginal', 'EyePrint', 'Owambe', 'MaxiDress', 'Boubou'],
    location: 'Lekki Phase 1, Lagos',
    material: 'High-Density Heavyweight Crepe Blend',
    fabricSpec: {
      fabricType: 'Heavyweight Stretch Crepe',
      yardsPerPiece: 6,
      texture: 'Fluid, heavy drape with wrinkle-resistant finish',
      recommendedUse: 'AsoEbi Maxi Gowns, Boubous, Tailored Jumpsuits, Wrap Dresses'
    },
    createdAt: '30 mins ago',
    reviews: [
      {
        id: 'fr1',
        productId: 'f1',
        userName: 'Mrs. Folake Adebayo',
        rating: 5,
        comment: 'The Stylemodiste crepe quality is unbeatable! The colors popped so nicely for my sister\'s birthday event in Ikeja.',
        date: 'Yesterday',
        conditionAccurate: true,
        fitFeedback: '6 Yards Full Cut',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'f2',
    title: "Stylemodiste Emerald Tulip Mulberry Silk Satin Fabric (6 Yards)",
    description: "Luxury 100% pure Mulberry silk satin in deep emerald green with oversized white and cream tulip blooms. Unmatched lustrous sheen and featherlight touch. Ideal for red-carpet gowns, slip dresses, cowl neck tops, and silk wrappers.",
    priceNaira: 28000,
    originalPriceNaira: 45000,
    section: 'fabrics',
    category: 'Silk & Satin',
    condition: 'Brand New Fabric',
    size: '6 Yards Full Cut',
    gender: 'Women',
    images: [
      imgGreenTulip,
      'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&q=80&w=800'
    ],
    sellerId: 's1',
    seller: INITIAL_SELLERS[0],
    stock: 8,
    viewCount: 520,
    likesCount: 178,
    tags: ['MulberrySilk', 'StylemodisteOriginal', 'EmeraldGreen', 'TulipPrint', 'LuxurySilk'],
    location: 'Lekki Phase 1, Lagos',
    material: '100% Pure Mulberry Silk Satin',
    fabricSpec: {
      fabricType: 'Pure Mulberry Silk Satin',
      yardsPerPiece: 6,
      texture: 'Ultra-lustrous, buttery soft with opulent drape',
      recommendedUse: 'Evening Gowns, Slip Dresses, Cowl Neck Outfits, Silk Wrappers'
    },
    createdAt: '2 hours ago',
    reviews: []
  },
  {
    id: 'f3',
    title: "Stylemodiste Cobalt Blue Floral Chiffon Fabric (6 Yards)",
    description: "Breezy, lightweight premium chiffon in crisp white with vibrant cobalt blue vintage floral branch prints. Breathable and fluid, perfect for floaty maxi gowns, kaftans, sheer sleeves, and layered skirts.",
    priceNaira: 18500,
    originalPriceNaira: 28000,
    section: 'fabrics',
    category: 'Chiffon & Organza',
    condition: 'Brand New Fabric',
    size: '6 Yards Full Cut',
    gender: 'Women',
    images: [
      imgBlueFloral,
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800'
    ],
    sellerId: 's1',
    seller: INITIAL_SELLERS[0],
    stock: 10,
    viewCount: 410,
    likesCount: 135,
    tags: ['Chiffon', 'CobaltBlue', 'StylemodisteOriginal', 'FloatyGown', 'Kaftan'],
    location: 'Lekki Phase 1, Lagos',
    material: '100% Silk Chiffon Blend',
    fabricSpec: {
      fabricType: 'Breezy Silk Chiffon',
      yardsPerPiece: 6,
      texture: 'Lightweight, semi-sheer, soft airy drape',
      recommendedUse: 'Maxi Dresses, Sheer Kaftans, Layered Skirts, Kimonos'
    },
    createdAt: '4 hours ago',
    reviews: []
  },
  {
    id: 'f4',
    title: "Stylemodiste Fiery Flame Graphic Silk Satin Fabric (6 Yards)",
    description: "Bold, modern statement fabric in midnight black featuring radiant orange and yellow fiery flame graphics. Smooth satin finish with brilliant luster.",
    priceNaira: 24500,
    originalPriceNaira: 38000,
    section: 'fabrics',
    category: 'Silk & Satin',
    condition: 'Brand New Fabric',
    size: '6 Yards Full Cut',
    gender: 'Women',
    images: [
      imgFlameSatin,
      'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&q=80&w=800'
    ],
    sellerId: 's1',
    seller: INITIAL_SELLERS[0],
    stock: 7,
    viewCount: 390,
    likesCount: 142,
    tags: ['FlameSatin', 'StylemodisteOriginal', 'StatementFabric', 'PartyWear'],
    location: 'Lekki Phase 1, Lagos',
    material: 'Silky Polyester Satin Blend',
    fabricSpec: {
      fabricType: 'Graphic Silk Satin',
      yardsPerPiece: 6,
      texture: 'Sleek, lustrous, smooth touch',
      recommendedUse: 'High-Fashion Gowns, Statement Shirts, Corset Dresses'
    },
    createdAt: '5 hours ago',
    reviews: []
  },
  {
    id: 'f5',
    title: "Stylemodiste Fuchsia Baroque Regal Crepe Fabric (6 Yards)",
    description: "Rich fuchsia pink crepe adorned with opulent gold acanthus baroque scrollwork. Regal, high-contrast fabric that radiates elegance and luxury for special celebrations.",
    priceNaira: 25000,
    originalPriceNaira: 40000,
    section: 'fabrics',
    category: 'Crepe Fabrics',
    condition: 'Brand New Fabric',
    size: '6 Yards Full Cut',
    gender: 'Women',
    images: [
      imgFuchsiaBaroque,
      'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&q=80&w=800'
    ],
    sellerId: 's1',
    seller: INITIAL_SELLERS[0],
    stock: 9,
    viewCount: 480,
    likesCount: 165,
    tags: ['BaroqueCrepe', 'FuchsiaGold', 'StylemodisteOriginal', 'OwambeGlam'],
    location: 'Lekki Phase 1, Lagos',
    material: 'Heavy Crepe Blend',
    fabricSpec: {
      fabricType: 'Baroque Printed Crepe',
      yardsPerPiece: 6,
      texture: 'Firm yet fluid drape, wrinkle-resistant',
      recommendedUse: 'Traditional Wrappers, Owambe Gowns, Tailored Suits'
    },
    createdAt: '6 hours ago',
    reviews: []
  },
  {
    id: 'f6',
    title: "Stylemodiste Psychedelic Tie-Dye Swirl Chiffon Fabric (6 Yards)",
    description: "Eye-catching black chiffon featuring spiral tie-dye swirls in cyan, yellow, and magenta. Dynamic, artistic print with a breezy weight.",
    priceNaira: 19500,
    originalPriceNaira: 32000,
    section: 'fabrics',
    category: 'Chiffon & Organza',
    condition: 'Brand New Fabric',
    size: '6 Yards Full Cut',
    gender: 'Women',
    images: [
      imgSwirlChiffon,
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800'
    ],
    sellerId: 's1',
    seller: INITIAL_SELLERS[0],
    stock: 8,
    viewCount: 340,
    likesCount: 110,
    tags: ['TieDyeChiffon', 'SwirlPrint', 'StylemodisteOriginal', 'ResortWear'],
    location: 'Lekki Phase 1, Lagos',
    material: 'Lightweight Polyester Chiffon',
    fabricSpec: {
      fabricType: 'Printed Chiffon',
      yardsPerPiece: 6,
      texture: 'Breezy, lightweight, semi-translucent',
      recommendedUse: 'Resort Wear, Floaty Boubous, Scarves & Kimonos'
    },
    createdAt: '7 hours ago',
    reviews: []
  },
  {
    id: 'f7',
    title: "Stylemodiste Duchess Brocade & Silk Jacquard (6 Yards)",
    description: "Heavyweight structured jacquard brocade with embossed floral metallic motifs. Firm body that holds dramatic shapes, peplum skirts, corset tops, and regal gowns.",
    priceNaira: 26500,
    originalPriceNaira: 40000,
    section: 'fabrics',
    category: 'Brocade & Cashmere',
    condition: 'Brand New Fabric',
    size: '6 Yards Full Cut',
    gender: 'Women',
    images: [
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&q=80&w=800'
    ],
    sellerId: 's1',
    seller: INITIAL_SELLERS[0],
    stock: 7,
    viewCount: 220,
    likesCount: 62,
    tags: ['Brocade', 'DuchessSatin', 'Jacquard', 'Stylemodiste', 'StructureFabric'],
    location: 'Lekki Phase 1, Lagos',
    material: 'Metallic Brocade & Jacquard',
    fabricSpec: {
      fabricType: 'Duchess Brocade Jacquard',
      yardsPerPiece: 6,
      texture: 'Firm, structured, embossed metallic weave',
      recommendedUse: 'Corsets, Peplum Tops, Ball Skirts, Structured Jackets'
    },
    createdAt: '2 days ago',
    reviews: []
  },

  // THRIFT WEARS SECTION
  {
    id: 't1',
    title: "Vintage 90s Carhartt Oversized Workwear Canvas Jacket",
    description: "Authentic heavy-canvas vintage Carhartt jacket in washed tan. Blanket lining, brass zip, corduroy collar. Sourced directly from Grade A thrift bales for Stylemodiste Thrift Vault.",
    priceNaira: 28500,
    originalPriceNaira: 140000,
    section: 'thrift',
    category: 'Grade A Denim & Jackets',
    condition: 'Grade A+',
    size: 'XL (Oversized)',
    gender: 'Unisex',
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&q=80&w=800'
    ],
    sellerId: 's2',
    seller: INITIAL_SELLERS[1],
    stock: 1,
    viewCount: 540,
    likesCount: 142,
    tags: ['Carhartt', 'VintageJacket', 'StylemodisteThrift', 'YabaThrift', 'Workwear'],
    location: 'Yaba, Lagos Mainland',
    defectNotes: 'Minor natural distressing on sleeve cuff adding vintage charm.',
    material: '100% Heavy Cotton Canvas',
    createdAt: '2 hours ago',
    reviews: [
      {
        id: 'tr1',
        productId: 't1',
        userName: 'Emeka N.',
        rating: 5,
        comment: 'Super crisp Grade A thrift jacket! Arrived in under 3 hours via Kwik Delivery in Lagos.',
        date: '1 day ago',
        conditionAccurate: true,
        fitFeedback: 'Oversized fit',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 't2',
    title: "Nike Dunk Low Retro 'Panda' - Grade A Thrift Kicks",
    description: "Classic Black/White Nike Dunk Lows in exceptional pre-loved condition. Stars intact on outsole, zero creasing on toe box. Deep cleaned & sanitized.",
    priceNaira: 35000,
    originalPriceNaira: 180000,
    section: 'thrift',
    category: 'Thrift Kicks & Shoes',
    condition: 'Grade A',
    size: 'EU 43 / US 9.5',
    gender: 'Men',
    images: [
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?auto=format&fit=crop&q=80&w=800'
    ],
    sellerId: 's2',
    seller: INITIAL_SELLERS[1],
    stock: 1,
    viewCount: 620,
    likesCount: 188,
    tags: ['NikeDunk', 'PandaDunk', 'ThriftSneakers', 'StylemodisteThrift', 'Kicks'],
    location: 'Yaba, Lagos Mainland',
    defectNotes: 'Outsoles in 9/10 crisp condition.',
    material: 'Leather & Rubber Sole',
    createdAt: '4 hours ago',
    reviews: []
  },
  {
    id: 't3',
    title: "Y2K Washed Baggy Carpenter Denim Jeans",
    description: "Heavyweight 90s vintage washed denim with carpenter side pockets and hammer loop. Wide leg baggy fit for modern Afro-streetwear styling.",
    priceNaira: 18500,
    originalPriceNaira: 65000,
    section: 'thrift',
    category: 'Unisex Thrift Streetwear',
    condition: 'Grade A+',
    size: 'Waist 34 / Length 32',
    gender: 'Unisex',
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1582552938357-32b906df40cb?auto=format&fit=crop&q=80&w=800'
    ],
    sellerId: 's2',
    seller: INITIAL_SELLERS[1],
    stock: 1,
    viewCount: 310,
    likesCount: 89,
    tags: ['BaggyJeans', 'Y2KDenim', 'StylemodisteThrift', 'Streetwear'],
    location: 'Yaba, Lagos Mainland',
    material: '100% Cotton Denim',
    createdAt: '6 hours ago',
    reviews: []
  },
  {
    id: 't4',
    title: "Vintage Silk Floral Wrap Midi Dress - Grade A",
    description: "Floaty 100% silk wrap dress with vibrant botanical floral prints and ruffled hemline. Figure-flattering adjustable waist tie.",
    priceNaira: 16500,
    originalPriceNaira: 55000,
    section: 'thrift',
    category: 'Thrift Tops & Dresses',
    condition: 'Grade A',
    size: 'Medium (UK 10-12)',
    gender: 'Women',
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=800'
    ],
    sellerId: 's3',
    seller: INITIAL_SELLERS[2],
    stock: 1,
    viewCount: 450,
    likesCount: 128,
    tags: ['ThriftDress', 'VintageSilk', 'StylemodisteThrift', 'WuseThrift'],
    location: 'Wuse II, Abuja',
    material: '100% Silk',
    createdAt: '1 day ago',
    reviews: []
  },
  {
    id: 't5',
    title: "Vintage Gucci Monogram Canvas Pochette Bag",
    description: "Authentic pre-loved GG monogram canvas shoulder bag with dark brown leather piping and silver buckle. Serial number verified inside.",
    priceNaira: 68000,
    originalPriceNaira: 450000,
    section: 'thrift',
    category: 'Pre-Loved Luxury Bags',
    condition: 'Grade A',
    size: 'Medium (9.5" x 5.5")',
    gender: 'Women',
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=800'
    ],
    sellerId: 's3',
    seller: INITIAL_SELLERS[2],
    stock: 1,
    viewCount: 780,
    likesCount: 230,
    tags: ['Gucci', 'PrelovedBag', 'StylemodisteThrift', 'LuxuryThrift'],
    location: 'Wuse II, Abuja',
    material: 'Monogram Canvas & Leather',
    createdAt: '2 days ago',
    reviews: []
  }
];

export const NIGERIAN_STATES = [
  { name: 'Lagos', lgas: ['Ikeja', 'Yaba', 'Lekki / Victoria Island', 'Surulere', 'Amuwo-Odofin', 'Ikorodu', 'Alimosho', 'Oshodi', 'Epe'] },
  { name: 'Abuja FCT', lgas: ['Abuja Municipal (Wuse/Maitama/Garki)', 'Gwagwalada', 'Kuje', 'Bwari', 'Kubwa'] },
  { name: 'Rivers', lgas: ['Port Harcourt City', 'Obio-Akpor', 'Eleme', 'Oyigbo'] },
  { name: 'Oyo', lgas: ['Ibadan North (Bodija)', 'Ibadan Southwest', 'Ibadan Southeast', 'Ogbomoso'] },
  { name: 'Enugu', lgas: ['Enugu North', 'Enugu South', 'Nsukka'] },
  { name: 'Kano', lgas: ['Kano Municipal', 'Fagge', 'Dala', 'Nasarawa'] }
];

export const COURIER_PROVIDERS: { id: string; name: CourierProvider; time: string; priceLagos: number; priceInterstate: number; badge: string; description: string }[] = [
  {
    id: 'bolt',
    name: 'Bolt Delivery (Bolt Send)',
    time: 'Instant (30 - 60 Mins)',
    priceLagos: 1500,
    priceInterstate: 3200,
    badge: 'Most Popular On-Demand',
    description: 'Instant door-to-door rider dispatch with live shareable GPS tracking link (Lagos, Abuja, PH, Ibadan, Kano, etc.).'
  },
  {
    id: 'gigl',
    name: 'GIG Logistics (GIGL)',
    time: '24 - 48 Hours',
    priceLagos: 2200,
    priceInterstate: 3800,
    badge: '#1 Nationwide Leader',
    description: 'Tracked doorstep delivery & 120+ GIG hub pickups across all 36 Nigerian states & FCT Abuja.'
  },
  {
    id: 'speedaf',
    name: 'Speedaf Express',
    time: '24 Hours Express',
    priceLagos: 2000,
    priceInterstate: 3200,
    badge: 'Top E-Commerce Nationwide',
    description: 'Reliable e-commerce express logistics with drop-off centers across all 36 states.'
  },
  {
    id: 'dhl',
    name: 'DHL Express Nigeria',
    time: '12 - 24 Hours Guaranteed',
    priceLagos: 3500,
    priceInterstate: 5800,
    badge: 'Premium Insured Express',
    description: 'Ultra-fast guaranteed express air cargo with full value insurance across all 36 states.'
  },
  {
    id: 'redstar',
    name: 'Red Star Express (FedEx)',
    time: '24 - 72 Hours',
    priceLagos: 2500,
    priceInterstate: 4200,
    badge: 'Nationwide Postal & Cargo',
    description: 'Nigeria stock-exchange listed pioneer postal carrier with 150+ station offices nationwide.'
  }
];

export const MOCK_RECENT_ACTIVITIES = [
  { id: 'act-1', type: 'sale' as const, itemTitle: "5 Yards Crepe Fabric (Emerald)", itemPrice: 22500, location: 'Lekki, Lagos', timeAgo: '2 mins ago', buyerOrSellerName: 'Mrs. Folake from Ikeja' },
  { id: 'act-2', type: 'reservation' as const, itemTitle: "Pure Mulberry Silk Satin (4 Yards)", itemPrice: 28000, location: 'Victoria Island', timeAgo: '5 mins ago', buyerOrSellerName: 'Amina reserved' },
  { id: 'act-3', type: 'new_listing' as const, itemTitle: 'French Chantilly Lace (5 Yards)', itemPrice: 45000, location: 'Wuse II, Abuja', timeAgo: '10 mins ago', buyerOrSellerName: 'Stylemodiste Atelier' },
  { id: 'act-4', type: 'sale' as const, itemTitle: 'Vintage 90s Carhartt Jacket', itemPrice: 28500, location: 'Yaba, Lagos', timeAgo: '15 mins ago', buyerOrSellerName: 'Chidi from Surulere' },
  { id: 'act-5', type: 'sale' as const, itemTitle: 'Velvet George Wrapper Set', itemPrice: 38000, location: 'Maitama, Abuja', timeAgo: '22 mins ago', buyerOrSellerName: 'Hadiza from Abuja' }
];

