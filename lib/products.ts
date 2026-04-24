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

export const products: Product[] = [
  {
    slug: "ghost-shell-parka",
    name: "Ghost Shell Parka",
    subtitle: "SS26 / Outerwear",
    price: 489,
    currency: "€",
    category: "outerwear",
    colors: ["Obsidian", "Concrete"],
    sizes: ["XS", "S", "M", "L", "XL"],
    images: [
      unsplash("photo-1551028719-00167b16eac5"),
      unsplash("photo-1544022613-e87ca75a784a"),
    ],
    description:
      "Technical 3-layer shell. Taped seams, magnetic storm flap, reflective hem. Built for the commute and the afterparty.",
    drop: "SS26",
  },
  {
    slug: "brutalist-hood",
    name: "Brutalist Hood",
    subtitle: "Core / Tops",
    price: 189,
    currency: "€",
    category: "tops",
    colors: ["Ink", "Bone"],
    sizes: ["S", "M", "L", "XL"],
    images: [
      unsplash("photo-1556821840-3a63f95609a7"),
      unsplash("photo-1620799140408-edc6dcb6d633"),
    ],
    description: "500gsm loopback fleece. Oversized cut, boxed shoulder, no-logo policy.",
    drop: "CORE",
  },
  {
    slug: "concrete-cargo",
    name: "Concrete Cargo",
    subtitle: "SS26 / Bottoms",
    price: 229,
    currency: "€",
    category: "bottoms",
    colors: ["Concrete", "Asphalt"],
    sizes: ["28", "30", "32", "34", "36"],
    images: [
      unsplash("photo-1624378441864-6eb7c2d8f71c"),
      unsplash("photo-1473966968600-fa801b869a1a"),
    ],
    description: "Double-knee ripstop. Seven pockets, articulated gusset, silent hardware.",
    drop: "SS26",
  },
  {
    slug: "void-tee",
    name: "Void Tee",
    subtitle: "Core / Tops",
    price: 79,
    currency: "€",
    category: "tops",
    colors: ["Ink", "Bone", "Volt"],
    sizes: ["XS", "S", "M", "L", "XL"],
    images: [
      unsplash("photo-1583743814966-8936f5b7be1a"),
      unsplash("photo-1581655353564-df123a1eb820"),
    ],
    description: "Heavyweight 260gsm tubular cotton. Boxy cut, drop shoulder, garment-dyed.",
    drop: "CORE",
  },
  {
    slug: "signal-sneaker",
    name: "Signal Sneaker",
    subtitle: "SS26 / Footwear",
    price: 349,
    currency: "€",
    category: "footwear",
    colors: ["Bone", "Volt"],
    sizes: ["40", "41", "42", "43", "44", "45"],
    images: [
      unsplash("photo-1542291026-7eec264c27ff"),
      unsplash("photo-1606107557195-0e29a4b5b4aa"),
    ],
    description: "Cushioned midsole, knit upper, reflective 3M pull-tabs.",
    drop: "SS26",
  },
  {
    slug: "static-cap",
    name: "Static Cap",
    subtitle: "Core / Accessories",
    price: 59,
    currency: "€",
    category: "accessories",
    colors: ["Ink", "Concrete"],
    sizes: ["One Size"],
    images: [
      unsplash("photo-1588850561407-ed78c282e89b"),
      unsplash("photo-1521369909029-2afed882baee"),
    ],
    description: "Unstructured 6-panel. Brushed twill, brass eyelets, debossed wordmark.",
    drop: "CORE",
  },
  {
    slug: "noise-jacket",
    name: "Noise Jacket",
    subtitle: "SS26 / Outerwear",
    price: 399,
    currency: "€",
    category: "outerwear",
    colors: ["Asphalt"],
    sizes: ["S", "M", "L", "XL"],
    images: [
      unsplash("photo-1591047139829-d91aecb6caea"),
      unsplash("photo-1551488831-00ddcb6c6bd3"),
    ],
    description: "Recycled nylon bomber. YKK Aquaguard zip, hidden internal stash pocket.",
    drop: "SS26",
  },
  {
    slug: "pulse-short",
    name: "Pulse Short",
    subtitle: "Core / Bottoms",
    price: 119,
    currency: "€",
    category: "bottoms",
    colors: ["Ink", "Bone"],
    sizes: ["S", "M", "L", "XL"],
    images: [
      unsplash("photo-1591195853828-11db59a44f6b"),
      unsplash("photo-1617137968427-85924c800a22"),
    ],
    description: "7-inch inseam, four-way stretch, silent zipper.",
    drop: "CORE",
  },
  {
    slug: "volt-beanie",
    name: "Volt Beanie",
    subtitle: "Core / Accessories",
    price: 49,
    currency: "€",
    category: "accessories",
    colors: ["Volt", "Ink"],
    sizes: ["One Size"],
    images: [
      unsplash("photo-1578920024129-1c96e94a17d1"),
      unsplash("photo-1608257735719-9c56c62079bd"),
    ],
    description: "Fine gauge merino rib. Folded cuff, invisible label.",
    drop: "CORE",
  },
  {
    slug: "drift-pant",
    name: "Drift Pant",
    subtitle: "SS26 / Bottoms",
    price: 259,
    currency: "€",
    category: "bottoms",
    colors: ["Concrete", "Ink"],
    sizes: ["28", "30", "32", "34", "36"],
    images: [
      unsplash("photo-1624378439575-d8705ad7ae80"),
      unsplash("photo-1584865288642-42078afe6942"),
    ],
    description: "Wide-leg pleated trouser in crinkle nylon. Elasticated back, welt pockets.",
    drop: "SS26",
  },
  {
    slug: "alloy-sunglasses",
    name: "Alloy Sunglasses",
    subtitle: "SS26 / Accessories",
    price: 149,
    currency: "€",
    category: "accessories",
    colors: ["Chrome", "Matte Black"],
    sizes: ["One Size"],
    images: [
      unsplash("photo-1572635196237-14b3f281503f"),
      unsplash("photo-1511499767150-a48a237f0083"),
    ],
    description: "Wrap-frame, CR-39 lenses, titanium hinge. Hard case included.",
    drop: "SS26",
  },
  {
    slug: "quarry-boot",
    name: "Quarry Boot",
    subtitle: "SS26 / Footwear",
    price: 429,
    currency: "€",
    category: "footwear",
    colors: ["Oiled Black", "Concrete"],
    sizes: ["40", "41", "42", "43", "44", "45"],
    images: [
      unsplash("photo-1542838132-92c53300491e"),
      unsplash("photo-1520639888713-7851133b1ed0"),
    ],
    description: "Goodyear-welted, vegetable-tanned leather, Vibram lug sole.",
    drop: "SS26",
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
