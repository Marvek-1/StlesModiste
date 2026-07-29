export type BrandSection = 'all' | 'fabrics' | 'thrift';

export type ConditionGrade = 'Brand New Fabric' | 'Grade A+' | 'Grade A' | 'Grade B' | 'Vintage / Retro' | 'Custom Upcycled';

export type Category = 
  | 'All'
  // Fabrics Section Categories
  | 'Crepe Fabrics'
  | 'Silk & Satin'
  | 'Chiffon & Organza'
  | 'Chantilly Lace'
  | 'Wrappers & Traditional'
  | 'Brocade & Cashmere'
  // Thrift Section Categories
  | 'Thrift Tops & Dresses'
  | 'Y2K & Vintage Wears'
  | 'Grade A Denim & Jackets'
  | 'Thrift Kicks & Shoes'
  | 'Pre-Loved Luxury Bags'
  | 'Unisex Thrift Streetwear';

export interface FabricSpec {
  fabricType: string; // e.g. "Crepe", "Mulberry Silk", "Chantilly Lace", "George / Velvet Wrapper"
  yardsPerPiece: number; // e.g. 4 yards, 5 yards, 6 yards
  texture: string; // e.g. "Smooth & Fluid", "Rich Heavy Velvet", "Sheer Floral Mesh"
  recommendedUse?: string; // e.g. "Maxi Dresses, Jumpsuits, Boubou", "Aso-Ebi Blouse & Wrapper"
}

export interface Seller {
  id: string;
  storeName: string;
  sellerName: string;
  avatar: string;
  city: string;
  state: string;
  bvnVerified: boolean;
  ninVerified: boolean;
  rating: number;
  totalReviews: number;
  totalSales: number;
  joinedDate: string;
  responseRate: string;
  badge: 'Top Rated Fabric Dealer' | 'Top Rated Thrifter' | 'Fast Shipper' | 'Verified Merchant' | 'Bale Wholesaler' | 'CAC Registered Wholesale' | 'Paystack Verified Merchant' | string;
  bio: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  conditionAccurate: boolean;
  fitFeedback: string;
  verifiedPurchase: boolean;
  photos?: string[];
}

export interface Product {
  id: string;
  title: string;
  description: string;
  priceNaira: number;
  originalPriceNaira: number;
  section: 'fabrics' | 'thrift';
  category: Category;
  condition: ConditionGrade;
  size: string; // e.g. "5 Yards", "4 Yards", "M", "XL (Oversized)", "EU 43"
  gender: 'Unisex' | 'Men' | 'Women';
  images: string[];
  sellerId: string;
  seller: Seller;
  stock: number;
  viewCount: number;
  likesCount: number;
  tags: string[];
  location: string; // e.g., "Lekki, Lagos" or "Wuse II, Abuja"
  defectNotes?: string;
  material?: string;
  fabricSpec?: FabricSpec;
  isReserved?: boolean;
  createdAt: string;
  reviews?: ProductReview[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type PaymentMethod = 'paystack_card' | 'bank_transfer' | 'ussd' | 'paystack_escrow';

export type CourierProvider = 'Bolt Delivery (Bolt Send)' | 'GIG Logistics (GIGL)' | 'Speedaf Express' | 'DHL Express Nigeria' | 'Red Star Express (FedEx)';

export interface DeliveryAddress {
  fullName: string;
  phone: string;
  email: string;
  state: string;
  lga: string;
  streetAddress: string;
  nearestLandmark?: string;
}

export interface OrderTrackingStep {
  title: string;
  description: string;
  timestamp: string;
  completed: boolean;
  current: boolean;
  location: string;
}

export interface Order {
  id: string;
  waybillNumber: string;
  items: CartItem[];
  subtotalNaira: number;
  deliveryFeeNaira: number;
  totalNaira: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'Paid (Escrow Secured)' | 'Pending Verification' | 'Failed';
  paymentReference: string;
  deliveryAddress: DeliveryAddress;
  courier: CourierProvider;
  courierPhone: string;
  status: 'Order Placed' | 'Dropped at Hub' | 'In Transit' | 'Out for Delivery' | 'Delivered' | 'Buyer Confirmed';
  estimatedDelivery: string;
  trackingSteps: OrderTrackingStep[];
  createdAt: string;
}

export interface LiveActivityEvent {
  id: string;
  type: 'sale' | 'reservation' | 'new_listing' | 'price_drop';
  itemTitle: string;
  itemPrice: number;
  location: string;
  timeAgo: string;
  buyerOrSellerName?: string;
}

export interface SellerOnboardingData {
  storeName: string;
  ownerName: string;
  email: string;
  phone: string;
  ninNumber: string;
  bvnNumber: string;
  state: string;
  lga: string;
  primaryCategory: Category;
  bankName: string;
  accountNumber: string;
  accountName: string;
  bio: string;
}
