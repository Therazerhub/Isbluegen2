# Cinematic Chapters — IsBlue product pages

## Completed implementation
- Responsive purchase hero with a vertical desktop thumbnail rail and hover zoom.
- Navy Cinematic Chapters section with a sticky visual, crossfades and sequential feature copy.
- Natural stacked chapters on mobile, with image/text reveals.
- Reorderable product details/video section.
- Product-specific chapter data, plus a Theme Editor block authoring mode.
- No-JavaScript and reduced-motion fallbacks; Shopify editor lifecycle cleanup.

## Quick start in Shopify
Open Online Store → Themes → Customize → Products → Default product.
Select **Cinematic chapters**. For the quickest setup choose **Theme editor blocks**,
then add Feature chapter blocks. Each supports an eyebrow, heading, rich text,
image, mobile image, video, link and visibility toggle. Drag blocks to reorder.
Choose sticky chapters or image/text rows, image fit, colours, spacing and corners.
Video chapters stay in normal flow so playback controls remain usable.

**Important:** static editor blocks are shared by products assigned to that template.
Connect block fields to product dynamic sources, use different product templates,
or use the product story system below for different stories on the same template.

## Product-specific stories (one-time admin setup)
The theme cannot create Shopify custom data definitions by uploading theme files.
Create these in Settings → Custom data.

1. Create a metaobject definition named **Product chapter** (type: `product_chapter`).
   Enable storefront read access. Add fields with these exact keys:

| Key | Shopify field type | Required |
| --- | --- | --- |
| heading | Single line text | Yes |
| eyebrow | Single line text | No |
| body | Rich text | No |
| image | File, images only | No |
| mobile_image | File, images only | No |
| video | File, videos only | No |
| button_label | Single line text | No |
| button_url | URL | No |

2. Create a **Product metafield** named Product story, namespace/key
   `custom.product_story`, type **Metaobject → List of entries**, referencing Product chapter.
3. Create chapter entries under Content → Metaobjects. If using draft/active status,
   make the entries active.
4. Open each product and select/reorder its Product story entries.
5. In the theme editor set Cinematic chapters → Chapter content to
   **Product story metafield** (the default).

Optional: create product `custom.subtitle` as single-line text for the hero subtitle.
Missing stories are hidden on the storefront. The editor shows setup help instead.
The preview's demonstration entries and generated photos are not store product data.

## Motion and media
Desktop image-only chapter groups have a sticky image with 650ms crossfades.
Mobile uses 700ms image/text reveals. Reduced-motion users get static stacked content.
Videos never autoplay. The editor uses stacked content so every chapter is selectable.
Changing the viewport or removing a section reverts its animation state.

Upload real product imagery in Shopify and enter accurate product copy. Description
images and embeds still resize automatically. Preview photography is illustrative,
not a claim about the shipped product.

## Preview and verification
Run `npm run preview` and open a product route. The local preview simulates cart
operations; Shopify checkout, app blocks, custom data definition creation, and real
Shopify editor persistence must be verified in the connected store.
Run `npm run package` for Liquid checks, rendering checks and the upload ZIP.
