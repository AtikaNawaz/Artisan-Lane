import type { Review, Testimonial, Dispute } from "@/lib/types";

export const reviews: Review[] = [
  {
    id: "rev_01",
    productId: "prod_01",
    artisanId: "art_ayesha",
    authorName: "Hina R.",
    rating: 5,
    title: "My new morning ritual",
    comment: "The glaze is stunning and the mug feels perfectly weighted. Arrived carefully packed from Lahore in three days.",
    createdAt: "2026-07-28",
    verifiedPurchase: true,
  },
  {
    id: "rev_02",
    productId: "prod_01",
    artisanId: "art_ayesha",
    authorName: "Usman K.",
    rating: 5,
    title: "Gift that felt personal",
    comment: "Bought two for my sister. She loved the slight handmade variation — nothing cookie-cutter about these.",
    createdAt: "2026-08-02",
    verifiedPurchase: true,
  },
  {
    id: "rev_03",
    productId: "prod_04",
    artisanId: "art_bilal",
    authorName: "Amna S.",
    rating: 5,
    title: "Board is a showpiece",
    comment: "The live edge is beautiful. We use it every Friday for cheese and fruit. Worth every rupee.",
    createdAt: "2026-07-19",
    verifiedPurchase: true,
  },
  {
    id: "rev_04",
    productId: "prod_06",
    artisanId: "art_fatima",
    authorName: "Sara T.",
    rating: 5,
    title: "True Multani craft",
    comment: "Colours are rich and the cotton softens after one wash. Finally a marketplace that doesn’t charge artisans absurd fees.",
    createdAt: "2026-07-01",
    verifiedPurchase: true,
  },
  {
    id: "rev_05",
    productId: "prod_09",
    artisanId: "art_hassan",
    authorName: "Ali M.",
    rating: 4,
    title: "Solid everyday bag",
    comment: "Stitching is excellent. Wish it had one more interior pocket, but the leather quality is outstanding.",
    createdAt: "2026-08-01",
    verifiedPurchase: true,
  },
  {
    id: "rev_06",
    productId: "prod_11",
    artisanId: "art_sara",
    authorName: "Noor F.",
    rating: 5,
    title: "Delicate and special",
    comment: "These earrings are lighter than they look and get compliments every time. Supporting a Peshawar maker made it even better.",
    createdAt: "2026-08-06",
    verifiedPurchase: true,
  },
  {
    id: "rev_07",
    productId: "prod_15",
    artisanId: "art_zara",
    authorName: "Rabia Z.",
    rating: 5,
    title: "Scent fills the room gently",
    comment: "Jasmine and cedar without being overpowering. Burn is clean. Already ordered the travel set.",
    createdAt: "2026-08-07",
    verifiedPurchase: true,
  },
  {
    id: "rev_08",
    productId: "prod_08",
    artisanId: "art_fatima",
    authorName: "Imran D.",
    rating: 5,
    title: "Throw of the year",
    comment: "Kantha stitching is even and the indigo is deep. Guests always ask where we found it.",
    createdAt: "2026-07-15",
    verifiedPurchase: true,
  },
  {
    id: "rev_09",
    productId: "prod_13",
    artisanId: "art_imran",
    authorName: "Mariam A.",
    rating: 5,
    title: "Peaceful presence on the wall",
    comment: "The ink washes feel meditative. Framing quality was better than expected for the price.",
    createdAt: "2026-07-25",
    verifiedPurchase: true,
  },
  {
    id: "rev_10",
    productId: "prod_18",
    artisanId: "art_meher",
    authorName: "Sana B.",
    rating: 5,
    title: "Bright and useful",
    comment: "Love the embroidery and the maker note inside. Perfect small gift under 3k.",
    createdAt: "2026-08-08",
    verifiedPurchase: true,
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "t_01",
    name: "Hina Raza",
    city: "Lahore",
    quote:
      "I stopped scrolling mass-market sites. On Artisan Lane I can meet the maker, read their story, and know my rupees stay with independent craftspeople.",
    rating: 5,
    role: "buyer",
  },
  {
    id: "t_02",
    name: "Bilal Ahmed",
    city: "Islamabad",
    quote:
      "The 10% launch commission finally made online selling make sense. I listed five pieces in a weekend and had my first nationwide orders within days.",
    rating: 5,
    role: "seller",
  },
  {
    id: "t_03",
    name: "Fatima Noor",
    city: "Multan",
    quote:
      "New Seller Spotlight put Indigo Thread in front of buyers who would never find our Multan workshop. That kind of fairness is rare.",
    rating: 5,
    role: "seller",
  },
  {
    id: "t_04",
    name: "Omar Sheikh",
    city: "Karachi",
    quote:
      "Checkout with JazzCash was straightforward and tracking updates kept me informed. The packaging from sellers has been thoughtful every time.",
    rating: 5,
    role: "buyer",
  },
];

export const pendingSellers = [
  {
    id: "pending_01",
    name: "Kamran Iqbal",
    shopName: "Brass Bell Studio",
    city: "Gujranwala",
    specialty: "Hand-cast brass bells & hooks",
    appliedAt: "2026-08-08",
    email: "kamran.brass@example.com",
  },
  {
    id: "pending_02",
    name: "Lubna Shah",
    shopName: "Silk Road Scarves",
    city: "Lahore",
    specialty: "Hand-loomed silk scarves",
    appliedAt: "2026-08-07",
    email: "lubna.silk@example.com",
  },
];

export const disputes: Dispute[] = [
  {
    id: "disp_01",
    orderId: "ord_sample_01",
    raisedBy: "Buyer: Sana B.",
    against: "Seller: Copper & Coil",
    reason: "Item arrived with dent on rim — requesting replacement or partial refund.",
    status: "open",
    createdAt: "2026-08-08",
  },
  {
    id: "disp_02",
    orderId: "ord_sample_02",
    raisedBy: "Buyer: Ali M.",
    against: "Seller: Saddle & Stitch",
    reason: "Wrong colour shipped (espresso instead of cognac).",
    status: "in_review",
    createdAt: "2026-08-06",
  },
];

export function getReviewsForProduct(productId: string) {
  return reviews.filter((r) => r.productId === productId);
}

export function getReviewsForArtisan(artisanId: string) {
  return reviews.filter((r) => r.artisanId === artisanId);
}
