export type Product = {
  slug: string;
  name: string;
  subtitle: string;
  price: number;
  currency: string;
  category: "outerwear" | "tops" | "bottoms" | "accessories" | "footwear";
  colors: string[];
  sizes: string[];
  images: string[];
  description: string;
  drop: string;
};

const unsplash = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

// Verified-working Unsplash photo IDs (clothing/fashion only)
const IMG = {
  a: "photo-1509631179647-0177331693ae",
  b: "photo-1517438476312-10d79c077509",
  c: "photo-1551028719-00167b16eac5",
  d: "photo-1556821840-3a63f95609a7",
  e: "photo-1544022613-e87ca75a784a",
};

export const products: Product[] = [
  {
    slug: "ghost-shell-parka",
    name: "Ghost Shell Parka",
    subtitle: "Outerwear",
    price: 489,
    currency: "€",
    category: "outerwear",
    colors: ["Obsidian", "Concrete"],
    sizes: ["XS", "S", "M", "L", "XL"],
    images: [unsplash(IMG.c), unsplash(IMG.e)],
    description:
      "Technical 3-layer shell. Taped seams, magnetic storm flap, reflective hem. Built for the commute and the afterparty.",
    drop: "New",
  },
  {
    slug: "brutalist-hood",
    name: "Brutalist Hood",
    subtitle: "Tops",
    price: 189,
    currency: "€",
    category: "tops",
    colors: ["Ink", "Bone"],
    sizes: ["S", "M", "L", "XL"],
    images: [unsplash(IMG.d), unsplash(IMG.c)],
    description:
      "500gsm loopback fleece. Oversized cut, boxed shoulder, no-logo policy.",
    drop: "Core",
  },
  {
    slug: "concrete-cargo",
    name: "Concrete Cargo",
    subtitle: "Bottoms",
    price: 229,
    currency: "€",
    category: "bottoms",
    colors: ["Concrete", "Asphalt"],
    sizes: ["28", "30", "32", "34", "36"],
    images: [unsplash(IMG.b), unsplash(IMG.a)],
    description:
      "Double-knee ripstop. Seven pockets, articulated gusset, silent hardware.",
    drop: "New",
  },
  {
    slug: "void-tee",
    name: "Void Tee",
    subtitle: "Tops",
    price: 79,
    currency: "€",
    category: "tops",
    colors: ["Ink", "Bone", "Mares"],
    sizes: ["XS", "S", "M", "L", "XL"],
    images: [unsplash(IMG.a), unsplash(IMG.d)],
    description:
      "Heavyweight 260gsm tubular cotton. Boxy cut, drop shoulder, garment-dyed.",
    drop: "Core",
  },
  {
    slug: "quarry-boot",
    name: "Quarry Boot",
    subtitle: "Footwear",
    price: 429,
    currency: "€",
    category: "footwear",
    colors: ["Oiled Black", "Concrete"],
    sizes: ["40", "41", "42", "43", "44", "45"],
    images: [unsplash(IMG.e), unsplash(IMG.c)],
    description: "Goodyear-welted, vegetable-tanned leather, Vibram lug sole.",
    drop: "New",
  },
  {
    slug: "static-cap",
    name: "Static Cap",
    subtitle: "Accessories",
    price: 59,
    currency: "€",
    category: "accessories",
    colors: ["Ink", "Concrete"],
    sizes: ["One Size"],
    images: [unsplash(IMG.c), unsplash(IMG.b)],
    description:
      "Unstructured 6-panel. Brushed twill, brass eyelets, debossed wordmark.",
    drop: "Core",
  },
  {
    slug: "noise-jacket",
    name: "Noise Jacket",
    subtitle: "Outerwear",
    price: 399,
    currency: "€",
    category: "outerwear",
    colors: ["Asphalt"],
    sizes: ["S", "M", "L", "XL"],
    images: [unsplash(IMG.e), unsplash(IMG.d)],
    description:
      "Recycled nylon bomber. YKK Aquaguard zip, hidden internal stash pocket.",
    drop: "New",
  },
  {
    slug: "pulse-short",
    name: "Pulse Short",
    subtitle: "Bottoms",
    price: 119,
    currency: "€",
    category: "bottoms",
    colors: ["Ink", "Bone"],
    sizes: ["S", "M", "L", "XL"],
    images: [unsplash(IMG.a), unsplash(IMG.b)],
    description: "7-inch inseam, four-way stretch, silent zipper.",
    drop: "Core",
  },
  {
    slug: "mares-beanie",
    name: "Mares Beanie",
    subtitle: "Accessories",
    price: 49,
    currency: "€",
    category: "accessories",
    colors: ["Mares", "Ink"],
    sizes: ["One Size"],
    images: [unsplash(IMG.d), unsplash(IMG.a)],
    description: "Fine gauge merino rib. Folded cuff, invisible label.",
    drop: "Core",
  },
  {
    slug: "drift-pant",
    name: "Drift Pant",
    subtitle: "Bottoms",
    price: 259,
    currency: "€",
    category: "bottoms",
    colors: ["Concrete", "Ink"],
    sizes: ["28", "30", "32", "34", "36"],
    images: [unsplash(IMG.b), unsplash(IMG.c)],
    description:
      "Wide-leg pleated trouser in crinkle nylon. Elasticated back, welt pockets.",
    drop: "New",
  },
  {
    slug: "alloy-sunglasses",
    name: "Alloy Sunglasses",
    subtitle: "Accessories",
    price: 149,
    currency: "€",
    category: "accessories",
    colors: ["Chrome", "Matte Black"],
    sizes: ["One Size"],
    images: [unsplash(IMG.c), unsplash(IMG.e)],
    description:
      "Wrap-frame, CR-39 lenses, titanium hinge. Hard case included.",
    drop: "New",
  },
  {
    slug: "leather-derby",
    name: "Leather Derby",
    subtitle: "Footwear",
    price: 349,
    currency: "€",
    category: "footwear",
    colors: ["Oxblood", "Black"],
    sizes: ["40", "41", "42", "43", "44", "45"],
    images: [unsplash(IMG.e), unsplash(IMG.b)],
    description:
      "Hand-stitched derby in full-grain calfskin. Leather sole, brass eyelets.",
    drop: "Core",
  },
];

export const categories = [
  { slug: "all", label: "All" },
  { slug: "outerwear", label: "Outerwear" },
  { slug: "tops", label: "Tops" },
  { slug: "bottoms", label: "Bottoms" },
  { slug: "footwear", label: "Footwear" },
  { slug: "accessories", label: "Accessories" },
] as const;

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}
