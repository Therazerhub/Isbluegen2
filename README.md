# IsBlue Frequency Shopify theme

An editorial Shopify Online Store 2.0 theme for IsBlue, built from scratch with Liquid sections, native Shopify commerce flows, GSAP motion, and a lazy loaded ThreeUI hero atmosphere.

## What is included

- Configurable IsBlue homepage with hero, product edit, category atlas, brand statement, product spotlight, newsletter, and footer.
- Native product, collection, search, cart, contact, page, and 404 templates.
- Ajax add to bag, cart drawer quantity updates, predictive search, variant selection, product media switching, and reduced motion support.
- ThreeUI `DotMatrixBackground` loaded as an isolated React island only when the homepage hero enables it.
- GSAP scroll and entrance motion with cleanup for Shopify theme editor section events.
- Local product image assets and a generated blue glass brand hero image.

## Development

```bash
npm install
npm run build
npm run check
npm run preview
```

The local preview runs at `http://localhost:4173` and uses a small local commerce simulation. Checkout and Shopify customer accounts become active after uploading the `theme/` directory to a Shopify development store.

To refresh the bundled public catalog image fixtures:

```bash
node scripts/prepare-assets.mjs
```

To package the uploadable theme:

```bash
npm run package
```

The uploadable theme is the `theme/` directory. The `src/` and `scripts/` directories support local builds and can stay in the repository.

## Shopify setup

1. Upload `theme/` as an unpublished theme.
2. Set the logo and connect the desired collections in the theme editor.
3. Review the shipping, return, contact, and payment claims before publishing.
4. Test products with real variants, inventory, taxes, and checkout settings.

## Notes

ThreeUI and GSAP are development dependencies. Shopify receives their compiled assets, not the npm package or `node_modules`. The homepage keeps a static poster image when WebGL is unavailable, when Save Data is enabled, or when reduced motion is requested.
