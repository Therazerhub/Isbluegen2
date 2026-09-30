# Universal product page

## Implementation checklist

- [x] Minimal responsive gallery and purchase panel, preserving complete product titles.
- [x] Pointer-following desktop image zoom with full-size image links.
- [x] Automatic video showcase from each product's media.
- [x] Full-width description story with responsive images, tables, and video embeds.
- [x] GSAP scroll reveals with reduced-motion and no-JavaScript fallbacks.
- [x] Validate Liquid, build assets, check product rendering and package.

Validation: Shopify Theme Check, synthetic Liquid rendering for empty media/description, sold-out variants, hosted/external videos and disabled settings; desktop/mobile visual preview and simulated add-to-bag. Real video playback and checkout must be checked on Shopify with the store's media and settings.

## Adding products

Use the default Product template. Upload images and videos to the product's Media field; the gallery and video showcase update automatically. Add descriptive alt text to media for accessible labels and video captions.

Write the Description using Shopify's editor. Insert images between paragraphs, use headings to divide the story, and add tables or video embeds when useful. Images retain their aspect ratio and fit the content width automatically, including images pasted with fixed dimensions. No product-specific code or template is needed.

In Customize → Products → Default product → Product information, change the details/video headings, enable or disable hover zoom, scroll reveals, the video showcase, and dynamic checkout. Empty descriptions and missing videos do not create blank sections. Videos use playback controls and do not autoplay. Desktop hover zoom is intentionally disabled for touch screens.

Before publishing, check real inventory, variants, apps, and checkout in Shopify's preview. Local preview simulates commerce and cannot verify Shopify checkout.
