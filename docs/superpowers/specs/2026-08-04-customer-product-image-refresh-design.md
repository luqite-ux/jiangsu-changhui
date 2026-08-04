# Customer Product Image Refresh Design

## Goal

Replace the Jiangsu Changhui overseas site's older product imagery with as many usable customer-supplied images as practical, while preserving product truth, visual consistency, and public-use safety.

## Approved Scope

Use the authenticity-first approach:

- Process all 33 supplied product images across switchgear, busway, and cable-tray folders.
- Process the five supplied industry images for clearly labelled application or industry context only. They must not be presented as Changhui project cases.
- Review the two supplied advertising composites individually; publish them only if restoration produces a credible secondary visual without misleading claims.
- Exclude the 12 search-style `u=...` images unless their ownership and public-use rights can be verified from customer records.
- Target approximately 38–40 publishable images, but publish fewer whenever quality, ownership, or product-identity checks fail.

## Restoration Rules

- Use light, identity-preserving restoration rather than product redesign.
- Preserve exact product geometry, component layout, material, proportions, model identity, and intended use.
- Improve resolution where useful; reduce compression artifacts, noise, blur, colour casts, clipped highlights, and untidy edges.
- Standardise product imagery toward clean white or light-neutral backgrounds, restrained natural shadows, consistent framing, comparable margins, and suitable card/detail aspect ratios.
- Standardise industry imagery for colour, contrast, and clarity without adding equipment, people, locations, or project details.
- Never invent unreadable label content, technical features, accessories, or cabinet internals.
- Reject any output where AI changes product structure or makes the image less truthful.

## Brand, Rights, and Quality Gate

- No published image may contain a visible third-party logo, trademark, brand name, packaging identity, unrelated watermark, copyright mark, or private information.
- Changhui branding may remain only where it is genuinely present in the customer-supplied source and visually accurate.
- Third-party marks must be removed only when removal leaves a truthful, natural product image; otherwise the source is rejected.
- Blurry, out-of-focus, severely compressed, undersized, distorted, or poorly cropped sources must be rejected when they cannot be restored without inventing detail.
- Search-derived or otherwise unclear-origin imagery is not published merely to increase image count.

## Product Mapping

- Map every image to the exact supported product model when the filename and visual evidence agree.
- Use product-family context only where an exact model cannot be verified, and label the image reference neutrally.
- Product covers and galleries must remain internally consistent; one image must never be mapped across unrelated product categories.
- Additional same-family images may be assigned to a product detail gallery when exact individual model attribution is unavailable but the family relationship is visually and factually safe.
- Category covers use the strongest restored image from the matching product family.
- Industry images are used only in application/industry sections, not as product covers.

## Asset and Data Flow

1. Inventory and visually review all 52 archive entries.
2. Record a keep/reject decision, reason, product/category mapping, and intended placement for each entry.
3. Restore approved images individually and inspect each result against its source.
4. Export web-ready assets with stable English filenames and consistent dimensions/quality.
5. Upload approved images under a Jiangsu-Changhui-specific R2 prefix.
6. Update only the Jiangsu Changhui tenant's `products.image_url`, `products.extra_data.images`, and matching category image fields.
7. Update the customer site's static fallback mappings so database failure does not restore obsolete imagery.
8. Preserve a rollback manifest of previous tenant-scoped image values before applying database changes.

## Verification

- Automated contracts cover all 27 products and six categories, tenant lock, cover/gallery consistency, valid public R2 URLs, mapping diversity, and prohibited cross-category reuse.
- A manifest accounts for all 52 source files as published or rejected with a reason.
- Every published R2 asset returns a successful image response.
- Product list, category, product detail gallery, homepage imagery, admin thumbnails, Open Graph images, and mobile layouts are checked in a real browser.
- Each published result is compared with its source for structure preservation, absence of third-party branding, adequate clarity, correct framing, and no misleading project claim.
- Existing customer-site tests, TypeScript checks, production build, SEO checks, and prohibited-claims scans remain green.

## Change Boundary

Changes are limited to the Jiangsu Changhui customer repository, its tenant-scoped Supabase rows, its customer-specific R2 assets, its Vercel deployment, and its delivery evidence. Shared `huanqiu-admin` code and other tenants are not modified.
