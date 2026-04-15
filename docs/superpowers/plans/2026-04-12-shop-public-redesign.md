# Shop Public Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the "caged" shop UI (`Container.wrapper/content`) with a full-width layout that matches `agendar turno` — `PublicNavbar` at top, desktop sidebar for category navigation, mobile bento grid preserved, mobile category pills on category pages.

**Architecture:** Three layout zones: `PublicNavbar` (full-width sticky), optional `ShopSidebar` (desktop only, `hidden lg:flex w-64 shrink-0 border-r`), and a scrollable main content area. `/shop` home shows the bento grid everywhere (no redirect). `/shop/[category]` shows pills on mobile/tablet, sidebar on desktop. The `CartButton` moves into `PublicNavbar` as a right-side slot via a `ShopNavbar` wrapper.

**Tech Stack:** Next.js App Router, React 19, TypeScript strict, TailwindCSS v4, Framer Motion, Zustand v5, shadcn/ui

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Create | `src/app/shop/_components/shop-navbar.tsx` | `PublicNavbar` + `CartButton` right slot, `"use client"`, dynamic import |
| Create | `src/app/shop/_components/shop-sidebar.tsx` | Sidebar UI (pure client — category links, active highlight) |
| Create | `src/app/shop/_components/shop-category-pills.tsx` | Horizontal scrollable pills (mobile/tablet only), `lg:hidden` |
| Modify | `src/app/shop/page.tsx` | Replace cage with full-width shell + sidebar layout |
| Modify | `src/app/shop/[category]/page.tsx` | Replace cage with full-width shell + sidebar + pills |
| Modify | `src/app/shop/[category]/_components/category-view.tsx` | Remove `CategorySwitcher` (replaced by pills/sidebar), remove `CategoryHeader` export or strip switcher from it |

---

## Task 1: `ShopNavbar` — PublicNavbar + CartButton

**Files:**
- Create: `src/app/shop/_components/shop-navbar.tsx`

- [ ] **Step 1: Create the file**

```tsx
"use client";

import dynamic from "next/dynamic";
import PublicNavbar from "@/components/public-navbar";
import CartButton from "./cart-button";

// PublicNavbar is already dynamic(ssr:false) internally.
// We create a thin wrapper that adds CartButton into the right slot.
// PublicNavbar doesn't accept a rightElement prop, so we overlay CartButton
// as a positioned sibling inside a relative wrapper.

export default function ShopNavbar() {
  return (
    <div className="relative shrink-0">
      <PublicNavbar />
      {/* Cart button pinned to the right of the navbar row */}
      <div className="absolute right-5 lg:right-8 top-1/2 -translate-y-1/2 z-10">
        <CartButton />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify CartButton import path**

Read `src/app/shop/_components/cart-button.tsx` and confirm the default export is `CartButton`. The import `@/app/shop/_components/cart-button` must resolve correctly.

- [ ] **Step 3: Type-check**

```bash
npx tsc --noEmit 2>&1 | grep shop-navbar
```

Expected: no output (no errors).

---

## Task 2: `ShopSidebar` — desktop category nav

**Files:**
- Create: `src/app/shop/_components/shop-sidebar.tsx`

- [ ] **Step 1: Create the file**

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { SHOP_CATEGORIES, type ShopCategory } from "@/types/shop";
import { categoryToSlug } from "@/lib/shop-utils";
import { cn } from "@/lib/utils";

const CATEGORY_EMOJI: Record<ShopCategory, string> = {
  "Shampoo y Acondicionador": "💧",
  "Mascarillas y Baños de Crema": "🫙",
  "Tratamientos Capilares": "✨",
  "Aceites y Serums": "🌿",
  "Protectores y Sprays": "💨",
  "Cremas para Peinar": "🪄",
  Accesorios: "🪮",
};

export default function ShopSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-border-subtle dark:border-zinc-800 py-8 px-4 gap-1">
      {/* "All categories" link */}
      <Link
        href="/shop"
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
          pathname === "/shop"
            ? "bg-gold/10 text-content dark:text-zinc-100"
            : "text-content-tertiary dark:text-zinc-500 hover:text-content dark:hover:text-zinc-300 hover:bg-black/5 dark:hover:bg-white/5",
        )}
      >
        <ShoppingBag className="w-4 h-4 shrink-0" />
        <span>Todas las categorías</span>
      </Link>

      <div className="my-2 h-px bg-border-subtle dark:bg-zinc-800" />

      {SHOP_CATEGORIES.map((cat) => {
        const slug = categoryToSlug(cat);
        const href = `/shop/${slug}`;
        const isActive = pathname === href;

        return (
          <Link
            key={cat}
            href={href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
              isActive
                ? "bg-gold/10 text-content dark:text-zinc-100 font-medium"
                : "text-content-tertiary dark:text-zinc-500 hover:text-content dark:hover:text-zinc-300 hover:bg-black/5 dark:hover:bg-white/5",
            )}
          >
            <span className="text-base leading-none w-5 text-center">
              {CATEGORY_EMOJI[cat]}
            </span>
            <span className="truncate">{cat}</span>
          </Link>
        );
      })}
    </aside>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit 2>&1 | grep shop-sidebar
```

Expected: no output.

---

## Task 3: `ShopCategoryPills` — mobile/tablet horizontal nav

**Files:**
- Create: `src/app/shop/_components/shop-category-pills.tsx`

- [ ] **Step 1: Create the file**

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SHOP_CATEGORIES, type ShopCategory } from "@/types/shop";
import { categoryToSlug } from "@/lib/shop-utils";
import { cn } from "@/lib/utils";

const CATEGORY_ACCENT: Record<ShopCategory, string> = {
  "Shampoo y Acondicionador":
    "bg-violet-500/15 text-violet-700 dark:text-violet-400 border-violet-500/25",
  "Mascarillas y Baños de Crema":
    "bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/25",
  "Tratamientos Capilares":
    "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/25",
  "Aceites y Serums":
    "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/25",
  "Protectores y Sprays":
    "bg-sky-500/15 text-sky-700 dark:text-sky-400 border-sky-500/25",
  "Cremas para Peinar":
    "bg-fuchsia-500/15 text-fuchsia-700 dark:text-fuchsia-400 border-fuchsia-500/25",
  Accesorios:
    "bg-slate-500/15 text-slate-700 dark:text-slate-400 border-slate-500/25",
};

const CATEGORY_EMOJI: Record<ShopCategory, string> = {
  "Shampoo y Acondicionador": "💧",
  "Mascarillas y Baños de Crema": "🫙",
  "Tratamientos Capilares": "✨",
  "Aceites y Serums": "🌿",
  "Protectores y Sprays": "💨",
  "Cremas para Peinar": "🪄",
  Accesorios: "🪮",
};

export default function ShopCategoryPills() {
  const pathname = usePathname();

  return (
    <div className="lg:hidden overflow-x-auto flex gap-2 pb-1 scrollbar-none px-5 mb-4">
      {SHOP_CATEGORIES.map((cat) => {
        const slug = categoryToSlug(cat);
        const href = `/shop/${slug}`;
        const isActive = pathname === href;
        const accent = CATEGORY_ACCENT[cat];

        return (
          <Link
            key={cat}
            href={href}
            className={cn(
              "shrink-0 flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all",
              isActive
                ? accent
                : "border-border-subtle dark:border-zinc-800 text-content-tertiary dark:text-zinc-500 hover:text-content dark:hover:text-zinc-300",
            )}
          >
            <span className="text-sm leading-none">{CATEGORY_EMOJI[cat]}</span>
            <span>{cat.split(" ")[0]}</span>
          </Link>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit 2>&1 | grep shop-category-pills
```

Expected: no output.

---

## Task 4: Rewrite `src/app/shop/page.tsx`

**Files:**
- Modify: `src/app/shop/page.tsx`

- [ ] **Step 1: Re-read the current file**

Read `src/app/shop/page.tsx` to confirm current contents before editing.

- [ ] **Step 2: Replace entirely**

New content:

```tsx
import { Suspense } from "react";
import ShopNavbar from "./_components/shop-navbar";
import ShopSidebar from "./_components/shop-sidebar";
import ShopHeader from "./_components/shop-header";
import ShopCategoriesData from "./_components/shop-categories-data";
import BentoSkeleton from "./_components/bento-skeleton";

export default function ShopPage() {
  return (
    <div className="min-h-svh flex flex-col bg-surface dark:bg-zinc-950 font-archivo">
      <ShopNavbar />

      <div className="flex flex-1 min-h-0">
        <ShopSidebar />

        {/* Main content */}
        <div className="flex-1 overflow-y-auto px-5 py-6 lg:px-12 lg:py-10">
          <ShopHeader />
          <Suspense fallback={<BentoSkeleton />}>
            <ShopCategoriesData />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Read the file back to verify**

Read `src/app/shop/page.tsx` and confirm the edit applied correctly.

- [ ] **Step 4: Type-check**

```bash
npx tsc --noEmit 2>&1 | grep "src/app/shop/page"
```

Expected: no output.

---

## Task 5: Rewrite `src/app/shop/[category]/page.tsx`

**Files:**
- Modify: `src/app/shop/[category]/page.tsx`

- [ ] **Step 1: Re-read the current file**

Read `src/app/shop/[category]/page.tsx` to confirm current contents.

- [ ] **Step 2: Replace entirely**

New content:

```tsx
import { Suspense } from "react";
import { notFound } from "next/navigation";
import ShopNavbar from "@/app/shop/_components/shop-navbar";
import ShopSidebar from "@/app/shop/_components/shop-sidebar";
import ShopCategoryPills from "@/app/shop/_components/shop-category-pills";
import CategoryData from "./_components/category-data";
import CategorySkeleton from "./_components/category-skeleton";
import { CategoryHeader } from "./_components/category-view";
import { slugToCategory } from "@/lib/shop-utils";

interface Props {
  params: Promise<{ category: string }>;
}

export default async function CategoryPage({ params }: Props) {
  const { category: slug } = await params;
  const category = slugToCategory(slug);

  if (!category) notFound();

  return (
    <div className="min-h-svh flex flex-col bg-surface dark:bg-zinc-950 font-archivo">
      <ShopNavbar />

      <div className="flex flex-1 min-h-0">
        <ShopSidebar />

        {/* Main content */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Mobile/tablet pills */}
          <div className="pt-5">
            <ShopCategoryPills />
          </div>

          {/* Scrollable area */}
          <div className="flex-1 overflow-y-auto px-5 pb-8 lg:px-12 lg:py-10">
            <CategoryHeader category={category} />
            <Suspense fallback={<CategorySkeleton />}>
              <CategoryData category={category} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Read the file back to verify**

Read `src/app/shop/[category]/page.tsx` and confirm the edit applied correctly.

- [ ] **Step 4: Type-check**

```bash
npx tsc --noEmit 2>&1 | grep "category.*page"
```

Expected: no output.

---

## Task 6: Clean up `category-view.tsx` — remove `CategorySwitcher`

**Files:**
- Modify: `src/app/shop/[category]/_components/category-view.tsx`

`CategorySwitcher` is now replaced by `ShopCategoryPills` (mobile) and `ShopSidebar` (desktop). `CategoryHeader` still shows breadcrumb + category title but no longer renders `CategorySwitcher`.

- [ ] **Step 1: Re-read the current file**

Read `src/app/shop/[category]/_components/category-view.tsx` to confirm current contents.

- [ ] **Step 2: Remove `CategorySwitcher` function and its usage in `CategoryHeader`**

Remove the entire `CategorySwitcher` function (lines ~120–143) and remove the switcher `<div>` block from `CategoryHeader`:

```tsx
// REMOVE this block from CategoryHeader:
{/* Category switcher */}
<div className="mb-4">
  <CategorySwitcher active={category} />
</div>
```

After the edit, `CategoryHeader` should look like:

```tsx
export function CategoryHeader({ category }: { category: ShopCategory }) {
  return (
    <>
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-[0.65rem] text-content-tertiary dark:text-zinc-500 mb-4">
        <Link href="/shop" className="hover:text-gold transition-colors">
          Tienda
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-content dark:text-zinc-300 font-medium">
          {category}
        </span>
      </div>

      {/* Category title */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-2xl">{CATEGORY_EMOJI[category]}</span>
          <h2 className="text-xl font-extrabold text-content dark:text-zinc-100 leading-tight">
            {category}
          </h2>
        </div>
        <div className="w-7 h-px mt-1.5 bg-gold-gradient" />
      </div>
    </>
  );
}
```

- [ ] **Step 3: Check if `CategorySwitcher` is imported/used elsewhere**

```bash
grep -r "CategorySwitcher" src/
```

Expected: no results (only existed in `category-view.tsx`).

- [ ] **Step 4: Read the file back to verify**

Read `src/app/shop/[category]/_components/category-view.tsx` to confirm `CategorySwitcher` is gone.

- [ ] **Step 5: Type-check the full project**

```bash
npx tsc --noEmit
```

Expected: no errors.

---

## Task 7: Final verification

- [ ] **Step 1: ESLint check**

```bash
npx eslint src/app/shop --quiet
```

Expected: no errors or warnings.

- [ ] **Step 2: Smoke-check imports**

```bash
grep -r "Container" src/app/shop/
```

Expected: no results (all Container imports removed).

```bash
grep -r "from \"@/components/navbar\"" src/app/shop/
```

Expected: no results (old Navbar replaced by ShopNavbar).

- [ ] **Step 3: Commit**

```bash
git add src/app/shop/page.tsx
git add 'src/app/shop/[category]/page.tsx'
git add 'src/app/shop/[category]/_components/category-view.tsx'
git add src/app/shop/_components/shop-navbar.tsx
git add src/app/shop/_components/shop-sidebar.tsx
git add src/app/shop/_components/shop-category-pills.tsx
git commit -m "feat: redesign public shop — full-width layout with sidebar + category pills"
```
