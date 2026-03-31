# Product Detail Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a product detail page at `/shop/[category]/[productId]` so customers can tap a product card to see full details and add it to the cart from there.

**Architecture:** The product card in `category-view.tsx` becomes a full-card `<Link>` (no add button). The detail page follows the existing Suspense + async-server-component pattern: `page.tsx` is `async` only to `await params` (no data fetching — this matches the existing `category/page.tsx` pattern and is the accepted exception for Next.js 15 dynamic params). It wraps `ProductData` (async server component) in Suspense, which fetches via a new server action and renders `ProductView` (client component). Back navigation is a `<Link>` to `/shop/[category]` derived from the URL params.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript strict, TailwindCSS v4, shadcn/ui, Framer Motion, Zustand (useCart), Lucide icons.

---

## File Map

| Action | Path | Responsibility |
|--------|------|---------------|
| Create | `src/app/shop/_actions/get-product-by-id.ts` | Thin server action wrapping `getProductById` |
| Create | `src/app/shop/[category]/[productId]/page.tsx` | Suspense wrapper, validates slug, passes params |
| Create | `src/app/shop/[category]/[productId]/_components/product-data.tsx` | Async server component — fetches product, renders view |
| Create | `src/app/shop/[category]/[productId]/_components/product-view.tsx` | Client component — image, description, add-to-cart button |
| Create | `src/app/shop/[category]/[productId]/_components/product-skeleton.tsx` | Loading skeleton matching product-view layout |
| Modify | `src/app/shop/[category]/_components/category-view.tsx` | Wrap ProductCard in Link, remove AddButton |

---

## Task 1: Server action `get-product-by-id`

**Files:**
- Create: `src/app/shop/_actions/get-product-by-id.ts`

- [ ] **Step 1: Create the action**

```typescript
"use server";

import { getProductById } from "@/services/shop";
import type { Product } from "@/types/shop";

export async function getProductByIdAction(id: string): Promise<Product | null> {
  return await getProductById(id);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/shop/_actions/get-product-by-id.ts
git commit -m "feat(shop): add get-product-by-id server action"
```

---

## Task 2: Modify `ProductCard` — make entire card a Link, remove AddButton

**Files:**
- Modify: `src/app/shop/[category]/_components/category-view.tsx`

Changes:
- `categoryToSlug` is already imported — no new imports needed for the Link href.
- Add `category` prop to `ProductCard` so it can build the href.
- Wrap the card root `<div>` in `<Link href={`/shop/${categoryToSlug(category)}/${product.id}`}>`.
- Remove `<AddButton product={product} added={added} />` from the card body.
- Remove the `AddButton` component definition entirely.
- Remove the unused `ShoppingCart` import (was only used in AddButton). Keep `Check` and `Star` (still used in badges).
- Keep `const added = useCart(...)`, the `ring-gold` ring, and the "En carrito" badge — useful visual feedback when a product is already in the cart.
- The stock badge `!added` guard (original line 104) is intentionally removed — the badge is always visible now since there's no "En carrito" competing for space in the card.
- `text-[0.55rem]` and `text-[0.6rem]` are preserved exactly from the original component — no Tailwind scale equivalent exists for these sizes, so they are acceptable carry-overs.
- Pass `category` to `ProductCard` from the grid in `CategoryView`.

- [ ] **Step 1: Edit `category-view.tsx`**

Replace the `AddButton` function and the `ProductCard` function with the following. Also update the `ProductCard` usage in the grid at the bottom.

**Remove** the entire `AddButton` function block (currently lines ~34–60).

**Replace** the `ProductCard` function:

```tsx
// ─── Product card (vertical, works for both featured and regular) ─────────────

function ProductCard({ product, category }: { product: Product; category: ShopCategory }) {
  const added = useCart((state) => state.items.some((i) => i.id === product.id));
  const priceFormatted = `$${product.price.toLocaleString("es-AR")}`;
  const href = `/shop/${categoryToSlug(category)}/${product.id}`;

  return (
    <Link
      href={href}
      className={`relative rounded-2xl overflow-hidden flex flex-col shadow-sm bg-white dark:bg-zinc-900 ring-2 transition-[box-shadow] duration-200 h-full ${
        added ? "ring-gold" : "ring-border-subtle dark:ring-zinc-800"
      }`}
    >
      {/* Badges row */}
      <div className="absolute top-2 left-2 z-10 flex items-center gap-1 flex-wrap">
        {product.featured && (
          <span className="flex items-center gap-1 bg-amber-400/90 text-white text-[0.55rem] font-bold px-1.5 py-0.5 rounded-full shadow">
            <Star className="w-2.5 h-2.5 fill-white" />
            Destacado
          </span>
        )}
        {added && (
          <span className="flex items-center gap-1 bg-gold text-white text-[0.55rem] font-bold px-1.5 py-0.5 rounded-full shadow">
            <Check className="w-2.5 h-2.5" strokeWidth={3} />
            En carrito
          </span>
        )}
      </div>

      {/* Image */}
      <div className="bg-surface dark:bg-zinc-800 aspect-[4/3] flex items-center justify-center relative overflow-hidden">
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-5xl select-none">
            {CATEGORY_EMOJI[product.category as ShopCategory] ?? "📦"}
          </span>
        )}
        {product.stock <= 3 && product.stock > 0 && (
          <span className="absolute bottom-2 right-2 text-[0.55rem] font-bold bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 border border-amber-300/50 px-1.5 py-0.5 rounded-full">
            Últimas unidades
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-2 p-3 flex-1 justify-between">
        <div>
          <p className="text-xs font-bold text-content dark:text-zinc-100 leading-tight">
            {product.name}
          </p>
          {product.description && (
            <p className="text-[0.6rem] text-content-quaternary dark:text-zinc-500 mt-0.5 line-clamp-2">
              {product.description}
            </p>
          )}
        </div>
        <span className="text-sm font-extrabold text-content dark:text-zinc-100 mt-1">
          {priceFormatted}
        </span>
      </div>
    </Link>
  );
}
```

**Update** the `ProductCard` usage in the grid (inside `CategoryView`):
```tsx
<ProductCard key={product.id} product={product} category={category} />
```

**Update** the top import line — remove `ShoppingCart`:
```tsx
import { Package, ChevronRight, Check, Star } from "lucide-react";
```

- [ ] **Step 2: Verify visually in dev** — Run `pnpm dev`, open `/shop/shampoo-y-acondicionador`, confirm cards are tappable links with no "Agregar" button.

- [ ] **Step 3: Commit**

```bash
git add src/app/shop/[category]/_components/category-view.tsx
git commit -m "feat(shop): make product card a full link, remove add button from grid"
```

---

## Task 3: Product skeleton

**Files:**
- Create: `src/app/shop/[category]/[productId]/_components/product-skeleton.tsx`

- [ ] **Step 1: Create skeleton**

```tsx
export default function ProductSkeleton() {
  return (
    <div className="animate-pulse space-y-4 pb-8">
      {/* Back link placeholder */}
      <div className="h-3 w-32 bg-surface dark:bg-zinc-800 rounded" />

      {/* Image */}
      <div className="aspect-[4/3] rounded-2xl bg-surface dark:bg-zinc-800" />

      {/* Name + price */}
      <div className="space-y-2">
        <div className="h-6 w-3/4 bg-surface dark:bg-zinc-800 rounded-lg" />
        <div className="h-8 w-1/3 bg-surface dark:bg-zinc-800 rounded-lg" />
      </div>

      {/* Description lines */}
      <div className="space-y-2">
        <div className="h-3 w-full bg-surface dark:bg-zinc-800 rounded" />
        <div className="h-3 w-5/6 bg-surface dark:bg-zinc-800 rounded" />
        <div className="h-3 w-4/6 bg-surface dark:bg-zinc-800 rounded" />
      </div>

      {/* Button */}
      <div className="h-12 w-full bg-surface dark:bg-zinc-800 rounded-xl" />
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/shop/[category]/[productId]/_components/product-skeleton.tsx
git commit -m "feat(shop): add product detail skeleton"
```

---

## Task 4: `ProductView` client component

**Files:**
- Create: `src/app/shop/[category]/[productId]/_components/product-view.tsx`

> **Note:** `CATEGORY_EMOJI` is duplicated from `category-view.tsx` intentionally — extracting it to a shared constants file is a future task.

- [ ] **Step 1: Create the component**

```tsx
"use client";

import { motion } from "framer-motion";
import { ShoppingCart, Check, Star, AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { type ShopCategory, type Product } from "@/types/shop";
import { categoryToSlug } from "@/lib/shop-utils";
import { useCart } from "@/app/shop/_store/use-cart";

// Duplicated from category-view.tsx intentionally — future task: extract to shared constants
const CATEGORY_EMOJI: Record<ShopCategory, string> = {
  "Shampoo y Acondicionador":     "💧",
  "Mascarillas y Baños de Crema": "🫙",
  "Tratamientos Capilares":       "✨",
  "Aceites y Serums":             "🌿",
  "Protectores y Sprays":         "💨",
  "Cremas para Peinar":           "🪄",
  "Accesorios":                   "🪮",
};

export default function ProductView({ product }: { product: Product }) {
  const added = useCart((state) => state.items.some((i) => i.id === product.id));
  const toggle = useCart((state) => state.toggle);
  const categorySlug = categoryToSlug(product.category as ShopCategory);
  const backHref = `/shop/${categorySlug}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5 pb-8"
    >
      {/* Back link */}
      <Link
        href={backHref}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-content-tertiary dark:text-zinc-500 hover:text-gold transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Volver a {product.category}
      </Link>

      {/* Image */}
      <div className="relative rounded-2xl overflow-hidden bg-surface dark:bg-zinc-800 aspect-[4/3] flex items-center justify-center">
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-8xl select-none">
            {CATEGORY_EMOJI[product.category as ShopCategory] ?? "📦"}
          </span>
        )}
        {product.featured && (
          <span className="absolute top-3 left-3 flex items-center gap-1 bg-amber-400/90 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
            <Star className="w-3 h-3 fill-white" />
            Destacado
          </span>
        )}
      </div>

      {/* Name + price */}
      <div>
        <h1 className="text-xl font-extrabold text-content dark:text-zinc-100 leading-tight">
          {product.name}
        </h1>
        <p className="text-2xl font-extrabold text-gold mt-1 tabular-nums">
          ${product.price.toLocaleString("es-AR")}
        </p>
      </div>

      {/* Stock warning */}
      {product.stock <= 3 && product.stock > 0 && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900">
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
            Últimas {product.stock} unidades disponibles
          </span>
        </div>
      )}

      {/* Description */}
      {product.description && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-content-quaternary dark:text-zinc-500 mb-2">
            Descripción
          </p>
          <p className="text-sm text-content-secondary dark:text-zinc-300 leading-relaxed">
            {product.description}
          </p>
        </div>
      )}

      {/* Add to cart button */}
      <button
        onClick={() => toggle(product)}
        className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold active:scale-[0.98] transition-all border-2 ${
          added
            ? "border-gold text-gold bg-transparent"
            : "border-transparent bg-gold text-white shadow-md"
        }`}
      >
        {added ? (
          <>
            <Check className="w-4 h-4" />
            Quitar del carrito
          </>
        ) : (
          <>
            <ShoppingCart className="w-4 h-4" />
            Agregar al carrito
          </>
        )}
      </button>
    </motion.div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/shop/[category]/[productId]/_components/product-view.tsx
git commit -m "feat(shop): add product detail view client component"
```

---

## Task 5: `ProductData` async server component

**Files:**
- Create: `src/app/shop/[category]/[productId]/_components/product-data.tsx`

- [ ] **Step 1: Create the component**

```tsx
import { notFound } from "next/navigation";
import { getProductByIdAction } from "@/app/shop/_actions/get-product-by-id";
import ProductView from "./product-view";

export default async function ProductData({ productId }: { productId: string }) {
  const product = await getProductByIdAction(productId);
  if (!product) notFound();
  return <ProductView product={product} />;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/shop/[category]/[productId]/_components/product-data.tsx
git commit -m "feat(shop): add product detail data fetching server component"
```

---

## Task 6: `page.tsx` — route entry point

**Files:**
- Create: `src/app/shop/[category]/[productId]/page.tsx`

> **Note:** This page is `async` only to `await params` — no data fetching happens here. This matches the existing `category/page.tsx` pattern and is the accepted exception for Next.js 15 dynamic params. The `h-svh` layout classes match all other shop pages.

- [ ] **Step 1: Create the page**

```tsx
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import Navbar from "@/components/navbar";
import CartButton from "@/app/shop/_components/cart-button";
import { slugToCategory } from "@/lib/shop-utils";
import ProductData from "./_components/product-data";
import ProductSkeleton from "./_components/product-skeleton";

interface Props {
  params: Promise<{ category: string; productId: string }>;
}

export default async function ProductPage({ params }: Props) {
  const { category: slug, productId } = await params;

  // Validate category slug so back-link is always safe
  if (!slugToCategory(slug)) notFound();

  return (
    <Container.wrapper className="h-svh">
      <Container.content className="h-svh md:h-[85vh]">
        <Navbar title="Producto" hideSettings rightElement={<CartButton />} />
        <div className="flex-1 overflow-y-auto -mx-4 px-4 pt-2">
          <Suspense fallback={<ProductSkeleton />}>
            <ProductData productId={productId} />
          </Suspense>
        </div>
      </Container.content>
    </Container.wrapper>
  );
}
```

- [ ] **Step 2: Verify in dev**

Run `pnpm dev`, open a category page, tap a product card, confirm:
- URL becomes `/shop/[category]/[productId]`
- Product detail renders (image, name, price, description, add button)
- Tapping "Agregar al carrito" works and cart badge updates
- "Volver a [Categoría]" link navigates back to the correct category page
- Cart button in navbar opens the cart drawer

- [ ] **Step 3: Commit**

```bash
git add src/app/shop/[category]/[productId]/page.tsx
git commit -m "feat(shop): add product detail page route"
```
