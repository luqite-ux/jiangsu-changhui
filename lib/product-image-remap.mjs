import { customerRefreshPublicUrl } from './customer-product-image-refresh.mjs'

export const TENANT_ID = '0f4f3ffa-9a1b-468f-8408-2f59a3b64e45'
export const CUSTOMER_PRODUCT_REFERENCE = 'Customer-supplied product photograph'

const exactContext = `${CUSTOMER_PRODUCT_REFERENCE}; restored for consistent catalogue presentation.`
const familyContext = `${CUSTOMER_PRODUCT_REFERENCE}; related product-family reference, not the exact listed model.`

const product = (slug, category, sourceIds, exact = true) => ({
  tenantId: TENANT_ID,
  slug,
  category,
  sourceIds,
  imageUrl: customerRefreshPublicUrl(sourceIds[0]),
  images: sourceIds.map(customerRefreshPublicUrl),
  imageAlt: exact
    ? `${slug} customer-supplied product photograph.`
    : `${slug} related product-family reference; not the exact listed model.`,
  imageContext: exact ? exactContext : familyContext,
})

export const productImageMappings = [
  product('kyn61-40-5', 'hv-switchgear', ['switchgear-kyn61-40-5']),
  product('kyn28-12', 'hv-switchgear', ['switchgear-kyn28-12']),
  product('hxgn-12', 'hv-switchgear', ['switchgear-hxgn15']),

  product('mns', 'lv-switchgear', ['switchgear-mns', 'switchgear-mns-workshop']),
  product('gcs', 'lv-switchgear', ['switchgear-gcs']),
  product('gck', 'lv-switchgear', ['switchgear-gck']),
  product('ggd', 'lv-switchgear', ['switchgear-ggd']),
  product('svc', 'lv-switchgear', ['switchgear-mns-workshop'], false),

  product('xl-power-distribution-box', 'distribution-box', ['distribution-xl-cabinet', 'distribution-xl-open']),
  product('jxf', 'distribution-box', ['distribution-jxf', 'distribution-jxf-control-box']),
  product('ats-dual-source', 'distribution-box', ['distribution-jxf-control-box'], false),
  product('jp-integrated', 'distribution-box', ['distribution-xl-open'], false),
  product('dbx-smc', 'distribution-box', ['distribution-jxf'], false),
  product('pz30', 'distribution-box', ['distribution-pz30']),

  product('box-substation', 'box-substation', ['switchgear-mns-workshop'], false),

  product('cl-compact-busway', 'busway', ['busway-compact-with-tap', 'busway-compact-section', 'busway-plug-in-start', 'busway-connector-one']),
  product('cfw-air-busway', 'busway', ['busway-air-insulated', 'busway-common-enclosure', 'busway-connector-two']),
  product('nhmc-fire-busway', 'busway', ['busway-fire-resistant', 'busway-lighting']),
  product('fsmc-resin-busway', 'busway', ['busway-cast-resin', 'busway-volcanic-rock-waterproof']),

  product('xqj-c-trough', 'cable-tray', ['cable-tray-vci-trough', 'cable-tray-steel-trough']),
  product('xqj-p-tray', 'cable-tray', ['cable-tray-steel-trough']),
  product('xqj-t-ladder', 'cable-tray', ['cable-tray-galvanised-ladder']),
  product('lqj-aluminum', 'cable-tray', ['cable-tray-aluminium-long-span']),
  product('dnch-fk', 'cable-tray', ['cable-tray-fire-resistant']),
  product('dnch-fx', 'cable-tray', ['cable-tray-riser'], false),
  product('xqj-p-light', 'cable-tray', ['cable-tray-energy-saving-ladder-tee']),
  product('gqqj-high-strength', 'cable-tray', ['cable-tray-fibreglass'], false),
]

const category = (slug, sourceId, label) => ({
  tenantId: TENANT_ID,
  slug,
  sourceId,
  imageUrl: customerRefreshPublicUrl(sourceId),
  imageAlt: `${label} category — customer-supplied product photograph.`,
  imageContext: `${CUSTOMER_PRODUCT_REFERENCE}; representative category image.`,
})

export const categoryImageMappings = [
  category('hv-switchgear', 'switchgear-kyn28-12', 'High-voltage switchgear'),
  category('lv-switchgear', 'switchgear-mns', 'Low-voltage switchgear'),
  category('distribution-box', 'distribution-xl-cabinet', 'Distribution boxes'),
  category('box-substation', 'switchgear-mns-workshop', 'Box-type substations'),
  category('busway', 'busway-compact-with-tap', 'Busway systems'),
  category('cable-tray', 'cable-tray-galvanised-ladder', 'Cable tray systems'),
]

export const productImageMappingBySlug = Object.fromEntries(productImageMappings.map((mapping) => [mapping.slug, mapping]))
export const categoryImageMappingBySlug = Object.fromEntries(categoryImageMappings.map((mapping) => [mapping.slug, mapping]))
