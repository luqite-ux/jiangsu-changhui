export const SOURCE_ARCHIVE_FILE_COUNT = 52

const productSource = (sourceId, archivePath, category, options = {}) => ({
  sourceId,
  archivePath,
  kind: 'product',
  decision: 'approve',
  reason: 'customer-supplied-product-image',
  target: { category, ...options },
  restorationProfile: 'product-catalogue-identity-preserving',
})

const industrySource = (sourceId, archivePath, placement) => ({
  sourceId,
  archivePath,
  kind: 'industry',
  decision: 'approve',
  reason: 'customer-approved-industry-context',
  target: { placement },
  restorationProfile: 'industry-context-natural-restoration',
})

const conditionalAdSource = (sourceId, archivePath) => ({
  sourceId,
  archivePath,
  kind: 'advertising-composite',
  decision: 'conditional',
  reason: 'publish-only-after-brand-and-quality-review',
  target: { placement: 'secondary-editorial' },
  restorationProfile: 'editorial-composite-light-restoration',
})

const rejectedSource = (sourceId, archivePath) => ({
  sourceId,
  archivePath,
  kind: 'unclear-origin',
  decision: 'reject',
  reason: 'unclear-origin',
  target: {},
  restorationProfile: 'none',
})

const sourceImageInventory = [
  productSource('switchgear-gck', '开关柜/GCK开关柜.jpg', 'lv-switchgear', { exactProductSlug: 'gck' }),
  productSource('switchgear-gcs', '开关柜/GCS昌晖.jpg', 'lv-switchgear', { exactProductSlug: 'gcs' }),
  productSource('switchgear-ggd', '开关柜/GGD低压配电柜.jpg', 'lv-switchgear', { exactProductSlug: 'ggd' }),
  productSource('switchgear-hxgn15', '开关柜/HXGN15环网开关柜.jpg', 'hv-switchgear', { exactProductSlug: 'hxgn-12' }),
  productSource('distribution-jxf', '开关柜/JXF.jpg', 'distribution-box', { exactProductSlug: 'jxf' }),
  productSource('distribution-jxf-control-box', '开关柜/JXF控制箱.jpg', 'distribution-box', { exactProductSlug: 'jxf' }),
  productSource('switchgear-kyn28-12', '开关柜/KYN28-12昌晖.jpg', 'hv-switchgear', { exactProductSlug: 'kyn28-12' }),
  productSource('switchgear-kyn61-40-5', '开关柜/KYN61-40.5昌晖.jpg', 'hv-switchgear', { exactProductSlug: 'kyn61-40-5' }),
  productSource('switchgear-mns', '开关柜/MNS昌晖.jpg', 'lv-switchgear', { exactProductSlug: 'mns' }),
  productSource('switchgear-mns-workshop', '开关柜/MNS车间图.jpg', 'lv-switchgear', { placement: 'family-gallery' }),
  productSource('distribution-pz30', '开关柜/PZ30照明配电箱.jpg', 'distribution-box', { exactProductSlug: 'pz30' }),
  productSource('distribution-xl-cabinet', '开关柜/XL动力柜.jpg', 'distribution-box', { exactProductSlug: 'xl-power-distribution-box' }),
  productSource('distribution-xl-open', '开关柜/XL打开.jpg', 'distribution-box', { exactProductSlug: 'xl-power-distribution-box' }),

  productSource('busway-common-enclosure', '母线图片/共箱母线.jpg', 'busway', { placement: 'family-gallery' }),
  productSource('busway-compact-with-tap', '母线图片/密集式母线槽-带插口.jpg', 'busway', { exactProductSlug: 'cl-compact-busway' }),
  productSource('busway-compact-section', '母线图片/密集式母线槽2.jpg', 'busway', { exactProductSlug: 'cl-compact-busway' }),
  productSource('busway-plug-in-start', '母线图片/插接始端.jpg', 'busway', { exactProductSlug: 'cl-compact-busway' }),
  productSource('busway-tap-box-open', '母线图片/插接箱打开2.jpg', 'busway', { placement: 'family-gallery' }),
  productSource('busway-cast-resin', '母线图片/浇注母线.jpg', 'busway', { exactProductSlug: 'fsmc-resin-busway' }),
  productSource('busway-volcanic-rock-waterproof', '母线图片/火山岩浇注防水母线.jpg', 'busway', { exactProductSlug: 'fsmc-resin-busway' }),
  productSource('busway-lighting', '母线图片/照明母线.jpg', 'busway', { placement: 'family-gallery' }),
  productSource('busway-air-insulated', '母线图片/空气型母线槽.jpg', 'busway', { exactProductSlug: 'cfw-air-busway' }),
  productSource('busway-fire-resistant', '母线图片/耐火母线.jpg', 'busway', { exactProductSlug: 'nhmc-fire-busway' }),
  productSource('busway-connector-one', '母线图片/连接器.jpg', 'busway', { placement: 'family-gallery' }),
  productSource('busway-connector-two', '母线图片/连接器2.jpg', 'busway', { placement: 'family-gallery' }),

  productSource('cable-tray-vci-trough', '电缆桥架/槽式VCI表面处理.jpg', 'cable-tray', { exactProductSlug: 'xqj-c-trough' }),
  productSource('cable-tray-fibreglass', '电缆桥架/玻璃钢桥架.jpg', 'cable-tray', { placement: 'family-gallery' }),
  productSource('cable-tray-riser', '电缆桥架/电缆竖井.jpg', 'cable-tray', { placement: 'family-gallery' }),
  productSource('cable-tray-fire-resistant', '电缆桥架/耐火桥架.jpg', 'cable-tray', { productSlugs: ['dnch-fk', 'dnch-fx'] }),
  productSource('cable-tray-energy-saving-ladder-tee', '电缆桥架/节能梯级式水平三通.jpg', 'cable-tray', { productSlugs: ['xqj-p-light', 'gqqj-high-strength'] }),
  productSource('cable-tray-steel-trough', '电缆桥架/钢制电缆槽式桥架.jpg', 'cable-tray', { exactProductSlug: 'xqj-c-trough' }),
  productSource('cable-tray-galvanised-ladder', '电缆桥架/钢制镀锌梯级式桥架.jpg', 'cable-tray', { exactProductSlug: 'xqj-t-ladder' }),
  productSource('cable-tray-aluminium-long-span', '电缆桥架/铝合金大跨距桥架.jpg', 'cable-tray', { exactProductSlug: 'lqj-aluminum' }),

  industrySource('industry-solar', '网站图片/光伏.jpeg', 'industries-solar'),
  industrySource('industry-grid', '网站图片/电网.webp', 'industries-grid'),
  industrySource('industry-mixed-use', '网站图片/综合体.webp', 'industries-commercial-complex'),
  industrySource('industry-wind', '网站图片/风电.jpeg', 'industries-wind'),
  industrySource('industry-high-speed-rail', '网站图片/高铁.jpeg', 'industries-rail'),

  conditionalAdSource('advertising-composite-one', '广告图-1.jpg'),
  conditionalAdSource('advertising-composite-two', '广告图-2.jpg'),

  rejectedSource('unclear-origin-1622515850336074', '网站图片/其他图片/1622515850336074.jpg'),
  rejectedSource('unclear-origin-64573c15e8b541d9905f364d16824dd5', '网站图片/其他图片/64573c15e8b541d9905f364d16824dd5.jpeg'),
  rejectedSource('unclear-origin-1536545698', '网站图片/其他图片/u=1536545698,4174031839&fm=253&fmt=auto&app=138&f=JPEG.webp'),
  rejectedSource('unclear-origin-1644793220', '网站图片/其他图片/u=1644793220,1086852053&fm=253&fmt=auto&app=138&f=JPEG.webp'),
  rejectedSource('unclear-origin-1786349218', '网站图片/其他图片/u=1786349218,3665391894&fm=253&fmt=auto&app=138&f=JPEG.webp'),
  rejectedSource('unclear-origin-1950599644', '网站图片/其他图片/u=1950599644,1473187572&fm=253&fmt=auto&app=138&f=JPEG.jpg'),
  rejectedSource('unclear-origin-2472093948', '网站图片/其他图片/u=2472093948,2170874824&fm=253&fmt=auto&app=138&f=JPEG.webp'),
  rejectedSource('unclear-origin-2932160962', '网站图片/其他图片/u=2932160962,2339405332&fm=253&fmt=auto&app=138&f=JPEG.webp'),
  rejectedSource('unclear-origin-3176021514', '网站图片/其他图片/u=3176021514,2236432751&fm=253&fmt=auto&app=138&f=JPEG.webp'),
  rejectedSource('unclear-origin-3428214437', '网站图片/其他图片/u=3428214437,4082920882&fm=253&fmt=auto&app=138&f=JPEG.webp'),
  rejectedSource('unclear-origin-3526317564', '网站图片/其他图片/u=3526317564,275500254&fm=253&fmt=auto&app=138&f=JPEG.webp'),
  rejectedSource('unclear-origin-3733158392', '网站图片/其他图片/u=3733158392,2408810100&fm=253&fmt=auto&app=138&f=JPEG.webp'),
]

const reviewRejections = new Map([
  ['busway-tap-box-open', 'third-party-brand-visible-after-restoration'],
  ['advertising-composite-one', 'misleading-multi-landmark-composite'],
])

export const sourceImageManifest = sourceImageInventory.map((source) => {
  const reviewReason = source.decision === 'reject'
    ? source.reason
    : reviewRejections.get(source.sourceId)

  if (reviewReason) {
    return {
      ...source,
      reviewStatus: 'reject',
      reviewReason,
      restoredFileName: null,
    }
  }

  return {
    ...source,
    reviewStatus: 'publish',
    reviewReason: 'identity-preserving-restoration-approved',
    restoredFileName: `${source.sourceId}.png`,
  }
})

export const approvedProductSources = sourceImageManifest.filter(({ kind, decision }) => kind === 'product' && decision === 'approve')
export const approvedIndustrySources = sourceImageManifest.filter(({ kind, decision }) => kind === 'industry' && decision === 'approve')
export const conditionalAdSources = sourceImageManifest.filter(({ kind, decision }) => kind === 'advertising-composite' && decision === 'conditional')
export const rejectedSources = sourceImageManifest.filter(({ decision }) => decision === 'reject')
export const publishableSources = sourceImageManifest.filter(({ reviewStatus }) => reviewStatus === 'publish')
export const finalRejectedSources = sourceImageManifest.filter(({ reviewStatus }) => reviewStatus === 'reject')
export const sourceById = Object.fromEntries(sourceImageManifest.map((source) => [source.sourceId, source]))
