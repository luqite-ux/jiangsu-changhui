# Customer Product Image Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore and publish the maximum safe set of customer-supplied Changhui product and industry images, then replace obsolete product imagery across R2, tenant-scoped Supabase data, static fallback content, and the deployed site.

**Architecture:** A source manifest accounts for every archive entry and separates product assets, industry context, conditional advertising composites, and rejected unclear-origin images. Approved images are restored one at a time with identity-preserving AI edits, validated against their originals, exported to a stable customer-specific R2 prefix, and consumed through one tenant-locked mapping shared by migration scripts and fallback data.

**Tech Stack:** Node.js 24, Next.js 16, Sharp, built-in image generation/editing, Cloudflare R2 S3 API, Supabase, Node test runner, Vercel.

## Global Constraints

- Only the Jiangsu Changhui customer repository, tenant `0f4f3ffa-9a1b-468f-8408-2f59a3b64e45`, customer-specific R2 assets, and its deployment may change.
- Publish approximately 38–40 assets only when each passes ownership, third-party-brand, clarity, structural-truth, and mapping checks; quantity never overrides safety.
- Never redraw product geometry, components, labels, material, proportions, model identity, or intended use.
- No published asset may contain a third-party logo, trademark, watermark, copyright mark, packaging identity, or private information.
- The 12 search-style `u=...` files remain rejected unless separate ownership evidence is supplied.
- Products and categories must use public absolute R2 URLs; database writes are tenant locked and preceded by a rollback snapshot.
- Product and article multilingual fields, prohibited-claims rules, shared `huanqiu-admin`, and other tenants remain unchanged.

---

### Task 1: Build the 52-file source inventory and decision manifest

**Files:**
- Create: `lib/customer-product-image-refresh.mjs`
- Create: `scripts/inventory-jiangsu-changhui-customer-images.mjs`
- Create: `tests/customer-product-image-refresh.test.mjs`

**Interfaces:**
- Consumes: `C:/Users/Grandlin/Documents/xwechat_files/wxid_zdhqp0r6gpta22_43a9/msg/file/2026-08/产品图片.zip`.
- Produces: `SOURCE_ARCHIVE_FILE_COUNT`, `sourceImageManifest`, `approvedProductSources`, `approvedIndustrySources`, `conditionalAdSources`, `rejectedSources`, and `sourceById`.

- [ ] **Step 1: Write the failing manifest tests**

Assert that the manifest contains exactly 52 unique archive paths; the 12 `网站图片/其他图片/` entries are rejected with `unclear-origin`; 33 product-folder entries are review candidates; five named industry images are industry context only; two advertising composites are conditional; every entry has `sourceId`, `archivePath`, `kind`, `decision`, `reason`, `target`, and `restorationProfile`; and no approved entry lacks a target category or placement.

- [ ] **Step 2: Run the focused test and verify RED**

Run: `node --test tests/customer-product-image-refresh.test.mjs`

Expected: FAIL because the manifest module does not exist.

- [ ] **Step 3: Implement the explicit 52-entry manifest**

Use stable English `sourceId` values derived from the Chinese filenames. Map:

- switchgear sources to exact matching models where the filename identifies KYN61-40.5, KYN28-12, HXGN, MNS, GCS, GCK, GGD, JXF, PZ30, or XL;
- `MNS车间图` as LV-switchgear family context only;
- JXF and XL open/interior variants into the corresponding detail galleries;
- all 12 busway sources among compact, air-insulated, fire-resistant, and resin-cast busway galleries according to visible construction and filename;
- all eight cable-tray sources among trough, tray, ladder, aluminium, fire-resistant, light-duty, and high-strength galleries according to filename and visible form;
- `光伏`, `电网`, `综合体`, `风电`, and `高铁` to industry/application placement only;
- the two advertising composites to conditional secondary editorial placement;
- all `网站图片/其他图片` paths to `reject` with `unclear-origin`.

The manifest must explicitly avoid assigning a source to SVC, ATS, JP, DBX-SMC, or box-substation as an exact model when the archive contains no verified exact photo.

- [ ] **Step 4: Add the read-only ZIP inventory command**

The script opens the ZIP without modifying it, verifies that every manifest path exists exactly once, reads image metadata with Sharp, records width/height/format/size, and writes a UTF-8 JSON report only when an explicit `--output` path is supplied. It must reject archive traversal paths and never extract outside its validated temporary directory.

- [ ] **Step 5: Run the test and inventory script**

Run:

```powershell
node --test tests/customer-product-image-refresh.test.mjs
node scripts/inventory-jiangsu-changhui-customer-images.mjs --archive "C:/Users/Grandlin/Documents/xwechat_files/wxid_zdhqp0r6gpta22_43a9/msg/file/2026-08/产品图片.zip" --output output/private/changhui-customer-image-inventory.json
```

Expected: PASS; the report accounts for 52 images with dimensions and no missing manifest entries.

- [ ] **Step 6: Commit the manifest and inventory tooling**

```powershell
git add -- lib/customer-product-image-refresh.mjs scripts/inventory-jiangsu-changhui-customer-images.mjs tests/customer-product-image-refresh.test.mjs
git commit -m "feat: inventory Changhui customer product images"
```

### Task 2: Restore approved sources in identity-preserving batches

**Files:**
- Create locally, do not commit: `output/private/changhui-image-refresh/sources/`
- Create locally, do not commit: `output/private/changhui-image-refresh/restored/`
- Create locally, do not commit: `output/private/changhui-image-refresh/review.json`
- Modify: `lib/customer-product-image-refresh.mjs`
- Test: `tests/customer-product-image-refresh.test.mjs`

**Interfaces:**
- Consumes: manifest entries whose decision is `approve` or `conditional` and source files extracted into the private work directory.
- Produces: one restored image per accepted source, `restoredFileName`, `reviewStatus`, `reviewReason`, source/output dimensions, and final `publish` or `reject` decision.

- [ ] **Step 1: Extend tests for publish-gate completeness**

Assert every `publish` entry has a unique stable English `.webp` filename, a restoration profile, source/output review metadata, no prohibited-brand flag, no blur flag, and at least one placement. Assert every rejected output has a non-empty reason and cannot appear in product or industry mappings.

- [ ] **Step 2: Verify the extended test fails**

Run: `node --test tests/customer-product-image-refresh.test.mjs`

Expected: FAIL because restored review fields do not exist.

- [ ] **Step 3: Extract only manifest-approved sources to the private work directory**

Validate all resolved paths remain under `output/private/changhui-image-refresh/sources/`. Preserve originals untouched for source/output comparison.

- [ ] **Step 4: Run one built-in AI edit per approved product image**

For each product source, inspect the original first and use this invariant prompt shape:

```text
Use case: precise-object-edit
Asset type: B2B electrical product catalogue image
Primary request: lightly restore this exact customer-supplied product photograph for a consistent overseas website catalogue
Scene/backdrop: clean white or very light neutral studio background when the existing background is unsuitable
Composition/framing: preserve the complete product; consistent margins; no cropped edges; catalogue-friendly framing
Lighting/mood: neutral, even, realistic product lighting with a restrained natural contact shadow
Constraints: preserve exact product geometry, cabinet/component layout, material, proportions, openings, accessories, model identity, and authentic Changhui marks; improve clarity and remove compression noise, colour cast, clutter, unrelated marks, and third-party branding only; do not invent or rewrite unreadable label text
Avoid: redesigned product, new components, changed internals, fake controls, fake labels, third-party logos, watermark, dramatic background, excessive sharpening, plastic CGI appearance
```

Use the smallest recent-image count that includes only the current source. Save the final output into the private restored directory with the manifest filename.

- [ ] **Step 5: Run one built-in AI edit per approved industry or conditional advertising image**

Preserve the original scene and use natural colour/contrast/clarity restoration only. Do not add projects, equipment, locations, logos, or people. Remove a third-party mark only when the scene remains truthful; otherwise reject the image.

- [ ] **Step 6: Inspect every source/output pair and record the decision**

Reject outputs with changed structure, hallucinated labels, visible third-party brands, unresolved watermarks, soft focus, unreadable compression, poor cutout edges, distorted proportions, or misleading project implications. Conditional advertising images become `publish` only when both pass; otherwise record rejection.

- [ ] **Step 7: Normalise accepted outputs with Sharp**

Export product assets as colour-managed WebP with a maximum 1600-pixel edge, preserved aspect ratio, quality 88, and no upscaling beyond the reviewed AI result. Industry/editorial assets use a maximum 1920-pixel edge and quality 88. Do not stretch images into one fixed aspect ratio; layout containers remain responsible for cropping.

- [ ] **Step 8: Update manifest decisions and verify GREEN**

Run: `node --test tests/customer-product-image-refresh.test.mjs`

Expected: PASS with all 52 sources accounted for and only reviewed outputs eligible for publication.

- [ ] **Step 9: Commit reviewed manifest decisions only**

```powershell
git add -- lib/customer-product-image-refresh.mjs tests/customer-product-image-refresh.test.mjs
git commit -m "feat: approve restored Changhui image set"
```

### Task 3: Upload the reviewed set to a locked R2 prefix

**Files:**
- Create: `scripts/upload-jiangsu-changhui-customer-images.mjs`
- Modify: `tests/customer-product-image-refresh.test.mjs`
- Local evidence only: `output/private/changhui-image-refresh/upload-report.json`

**Interfaces:**
- Consumes: reviewed `publish` entries and local restored WebP files.
- Produces: public URLs under `v0-design-assets/jiangsu-changhui/customer-product-refresh-2026-08/` and a local upload report containing key, URL, content type, bytes, and ETag.

- [ ] **Step 1: Write failing uploader safety tests**

Assert the uploader refuses missing review approval, missing local files, duplicate keys, keys outside the locked prefix, non-WebP output, or an unexpected tenant ID. Assert dry-run is the default and `--apply` is required for writes.

- [ ] **Step 2: Verify uploader tests fail**

Run: `node --test tests/customer-product-image-refresh.test.mjs`

- [ ] **Step 3: Implement idempotent R2 upload**

Read R2 credentials from environment only. Upload with `Content-Type: image/webp`, a long immutable cache header, and exact manifest keys. Before overwriting an existing key, compare content metadata; never delete existing older-prefix assets.

- [ ] **Step 4: Run dry-run then apply**

```powershell
node scripts/upload-jiangsu-changhui-customer-images.mjs --source output/private/changhui-image-refresh/restored
node scripts/upload-jiangsu-changhui-customer-images.mjs --source output/private/changhui-image-refresh/restored --apply --report output/private/changhui-image-refresh/upload-report.json
```

- [ ] **Step 5: Verify every public object**

HEAD every uploaded URL and require status 200, `image/webp`, non-zero content length, and the expected immutable cache header. Download a sample from every product family and compare dimensions/hash with the reviewed local output.

- [ ] **Step 6: Commit uploader and tests**

```powershell
git add -- scripts/upload-jiangsu-changhui-customer-images.mjs tests/customer-product-image-refresh.test.mjs
git commit -m "feat: upload restored Changhui image set"
```

### Task 4: Replace the 27-product, six-category, and industry mappings

**Files:**
- Modify: `lib/product-image-remap.mjs`
- Modify: `scripts/remap-jiangsu-changhui-product-images.mjs`
- Modify: `lib/site-data.ts`
- Modify: `tests/product-image-remap.test.mjs`
- Modify: `tests/media-contract.test.mjs`

**Interfaces:**
- Consumes: published R2 URLs from the reviewed manifest.
- Produces: exact `productImageMappings`, `categoryImageMappings`, industry image mappings, and an idempotent tenant-scoped Supabase patch.

- [ ] **Step 1: Write failing mapping tests**

Require all 27 products and six categories; require every new URL to use the locked refresh prefix; require all published product assets to be used at least once; require exact filename/model matches to be covers for KYN61-40.5, KYN28-12, HXGN, MNS, GCS, GCK, GGD, JXF, PZ30, XL, named busway types, and named cable-tray types; forbid any switchgear image outside switchgear/distribution categories and every cable-tray image outside cable-tray; require product cover equals gallery item zero; require six unique category covers; and require five industry images to appear only in industry/application placements.

- [ ] **Step 2: Verify mapping tests fail**

Run: `node --test tests/product-image-remap.test.mjs tests/media-contract.test.mjs`

- [ ] **Step 3: Implement the reviewed product galleries**

Assign exact model images first. Distribute same-family supplemental images across detail galleries without falsely claiming exact model attribution. Keep SVC, ATS, JP, DBX-SMC, and box-substation on clearly labelled family/manufacturing context when no exact supplied photo exists. Replace obsolete manufacturing-only covers wherever a verified new product photo exists.

- [ ] **Step 4: Implement category and industry mappings**

Use one strong matching product image per category. Replace the appropriate homepage/capabilities industry visuals with the five reviewed industry assets and retain neutral application-reference wording.

- [ ] **Step 5: Update the tenant patch without losing extra data**

Preserve unrelated `extra_data`, replace only `images`, `imageAlt`, `imageContext`, and category image fields, keep tenant and slug guards, and raise the minimum distinct cover expectation to match the reviewed set. Continue writing a first-state rollback snapshot with exclusive-create semantics.

- [ ] **Step 6: Run focused tests and dry-run database migration**

```powershell
node --test tests/customer-product-image-refresh.test.mjs tests/product-image-remap.test.mjs tests/media-contract.test.mjs
node scripts/remap-jiangsu-changhui-product-images.mjs --dry-run --snapshot output/private/changhui-image-refresh/db-before.json
```

Expected: tests PASS; dry-run reports 27 product rows, six categories, all R2 HEAD checks successful, and only the locked Changhui tenant.

- [ ] **Step 7: Commit mapping and migration changes**

```powershell
git add -- lib/product-image-remap.mjs scripts/remap-jiangsu-changhui-product-images.mjs lib/site-data.ts tests/product-image-remap.test.mjs tests/media-contract.test.mjs
git commit -m "feat: replace Changhui product imagery"
```

### Task 5: Apply, verify, deploy, and audit the full visual replacement

**Files:**
- Database snapshot, not committed: `output/private/changhui-image-refresh/db-before.json`
- Review evidence, not committed: `output/private/changhui-image-refresh/`
- Modify delivery documentation only if an existing Changhui evidence record requires the new asset status.

**Interfaces:**
- Consumes: fully tested mappings, uploaded R2 objects, company GitHub/Vercel credentials, and the locked tenant migration.
- Produces: updated tenant rows, deployed customer site, browser evidence, and verified rollback readiness.

- [ ] **Step 1: Run full pre-apply verification**

Run:

```powershell
pnpm test
pnpm exec tsc --noEmit
pnpm build
```

Also scan source, manifest text, image OCR where available, tenant product/article/category text, and every indexed online page for prohibited warranty/guarantee wording.

- [ ] **Step 2: Apply the exact tenant migration**

Run:

```powershell
node scripts/remap-jiangsu-changhui-product-images.mjs --apply --snapshot output/private/changhui-image-refresh/db-before.json
```

Read back all 27 products and six categories. Require cover/gallery consistency, public R2 URLs, expected mapping counts, and unchanged unrelated `extra_data`.

- [ ] **Step 3: Verify local desktop and mobile rendering**

Check homepage, product list, all six category pages, all 27 product details, industry/capabilities sections, image gallery controls, alt/caption wording, header/footer, and mobile image cropping. Run an accessibility/contrast audit and inspect browser console/network failures.

- [ ] **Step 4: Push exact commits through the company GitHub token flow**

Verify the token belongs to `luqite-ux`, confirm repository ownership/default branch, push `main` with the temporary Basic header and credential helper disabled, then compare local HEAD with the authenticated GitHub branch SHA.

- [ ] **Step 5: Wait for and verify Vercel Production**

Confirm the deployment commit reaches READY. Use `jiangsu-changhui.vercel.app` for ISR/data checks and the formal domain for canonical/visual checks.

- [ ] **Step 6: Run Production closure checks**

Verify all R2 images, homepage and category images, all 27 product covers/galleries, admin thumbnails, metadata/Open Graph image URLs, robots, sitemap XML, every sitemap URL, apex/`www` HTTPS behavior, desktop/mobile visuals, and no console/network errors. Confirm the five industry images are never labelled as Changhui project cases.

- [ ] **Step 7: Confirm rollback readiness and hand off**

Keep the pre-apply database snapshot private and verify it contains only tenant `0f4f3ffa-9a1b-468f-8408-2f59a3b64e45`. Report published/rejected counts and reasons, restored image families, deployment commit, Production URL, and any source rejected for brand, rights, blur, or structural-edit reasons.
