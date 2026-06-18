# LUMÉ — Cosmetics E-Commerce Homepage

A premium, dark-mode cosmetics storefront homepage built with **React 18**, **Vite**, and **Tailwind CSS**. Fully responsive, built from small reusable components, and themed with a warm gold / blush design system on a deep obsidian background.

## Sections

- **Navbar** — sticky, blurs on scroll, responsive mobile menu
- **Hero** — asymmetric layout, animated entrance, illustrated product bottle
- **Categories** — 6 category cards with layered shade-swatch icons
- **Products** — filterable product grid (All / Skincare / Makeup / Fragrance / Hair Care), wishlist toggle, add-to-bag
- **Reviews** — community testimonials with star ratings
- **Brands** — infinite-scrolling brand marquee
- **Offers** — promotional banners (seasonal edit + referral program)
- **Newsletter** — email signup with inline success state
- **Footer** — link columns, socials, legal links

All product photography is replaced with original hand-drawn SVG bottle/jar/tube illustrations (`src/components/ui/BottleIllustration.jsx`), so the project has zero external image dependencies.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (typically `http://localhost:5173`).

## Build for production

```bash
npm run build
npm run preview
```

## Project structure

```
src/
  components/
    ui/              # Reusable primitives: Button, ProductCard, CategoryCard,
                      # ReviewCard, ShadeSwatch, BottleIllustration, StarRating,
                      # SectionHeading
    Navbar.jsx
    Hero.jsx
    Categories.jsx
    Products.jsx
    Reviews.jsx
    Brands.jsx
    Offers.jsx
    Newsletter.jsx
    Footer.jsx
  data/
    products.js      # Sample categories, products, reviews, brands — swap with your own
  App.jsx
  main.jsx
  index.css
```

## Customizing

- **Colors / fonts** — edit `tailwind.config.js` (the `obsidian`, `ivory`, `gold`, `rose` palette and `Fraunces` / `Manrope` font families).
- **Content** — edit `src/data/products.js`. The `Products`, `Categories`, `Reviews`, and `Brands` components all render from this file.
- **Bottle artwork** — `BottleIllustration` accepts `variant` (`bottle` | `jar` | `tube`) and two gradient colors, so new products automatically get on-brand artwork without needing photos.

## Tech stack

- React 18
- Vite 5
- Tailwind CSS 3
- [lucide-react](https://lucide.dev/) for icons
