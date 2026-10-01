# White editorial product page

The white editorial layout is the default `product.json` template. It uses each product's own title, images, price, variants, description, media and optional story content. The earlier design remains available as the `product.cinematic` template.

## Merchant checklist

- Add product images and video in Shopify's product media. Gallery items and hover zoom adapt automatically.
- The gallery now shows a live media position and a discount marker computed from the selected variant's prices.
- The Product visual focus section automatically uses the second and third product images when present. In the theme editor you can turn it off, replace either image, change its crop, colors, and text. It hides itself when there is no extra image.
- Add headings, paragraphs, images, tables or embedded video to the product description; the content flows responsively.
- Optionally add scroll-story chapters using the Product chapters section or the `custom.product_story` metafield described in [CINEMATIC-CHAPTERS.md](CINEMATIC-CHAPTERS.md).
- Edit the trust-detail blocks in the Product information section. Keep only claims that match your actual policies and service. Links and captions are optional.
- The variant picker is automatically hidden for a product with one variant and shown when it has two or more.
- Dynamic checkout can be switched off in the Product information section. Shopify controls the appearance of branded payment buttons; the theme styles the ordinary unbranded “Buy it now” button.

## Optional offer countdown

The countdown is enabled in the white editorial template, but stays hidden unless the selected variant has a real compare-at discount and a future deadline is configured. Set a Shopify product metafield with namespace/key `custom.promotion_ends_at`, type **Date and time**. A product-specific metafield takes priority over the section's optional ISO 8601 fallback deadline. The timer disappears automatically when the deadline passes or a non-discounted variant is selected. Do not add a deadline unless the offer actually ends then.

The local blender preview supplies an illustrative deadline; it is not included in live Shopify product data.
