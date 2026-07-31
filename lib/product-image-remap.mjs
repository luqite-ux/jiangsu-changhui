export const TENANT_ID = '0f4f3ffa-9a1b-468f-8408-2f59a3b64e45'

export const R2_BASE = 'https://pub-c7a22068052144a5805830c30d280128.r2.dev/v0-design-assets/jiangsu-changhui/'

export const MANUFACTURING_REFERENCE = 'Manufacturing reference — customer-supplied photo, not model-specific'

const r2 = (fileName) => `${R2_BASE}${fileName}`

export const manufacturingOnlyFiles = [
  '02f2c9b85494be5f6063823e28e5665f.jpg',
  '07aa12b7ec089769602cf99396ad4717.jpg',
  '145d8f2fb35cde497a78de753733de09.jpg',
  '30d699934a9dc20b49d07ccb91fa1cef.jpg',
  '387e1063a6c0345b8c690c4a64cd7b7d.jpg',
  '3e9c2d13f4aee978503506a95c46f298.jpg',
  '41a7662e2280501fc87a68d90e51c191.jpg',
  '5c14f20c11cae0e7c9617cdd638846fd.jpg',
  '5db473a5465b7db0c12cc26e0c1843cc.jpg',
  '60a2398278c02f4d6441f2c715df5a6f.jpg',
  '95cdd4127a66a1c65e08bc0b816e41e4.jpg',
  'dc66751b92bf3bd2a4edc3589a63270d.jpg',
  'e4915e3ee3bcf118efd515fa321ab0a5.jpg',
  'f0b42be9bff25d93aea867d94460452e.jpg',
  'fa5cc2105a12324374ce3e47e9e7c65d.jpg',
]

const manufacturingContext = `${MANUFACTURING_REFERENCE}.`
const highVoltageContext = `${MANUFACTURING_REFERENCE}. High-voltage project/manufacturing reference; visible customer-supplied switchgear-series photo, not the exact listed model.`
const kyn28Context = `${MANUFACTURING_REFERENCE}. Visible KYN28A-12 series variant shown for KYN28-12 context; not the exact listed model.`

const referenceAlt = (scene) => `${scene} manufacturing reference; customer-supplied photo, not model-specific.`

const product = (slug, category, files, imageAlt, imageContext = manufacturingContext) => ({
  tenantId: TENANT_ID,
  slug,
  category,
  imageUrl: r2(files[0]),
  images: files.map(r2),
  imageAlt,
  imageContext,
})

export const productImageMappings = [
  product('kyn61-40-5', 'hv-switchgear', ['9f207edbf52231ba32365ec49be9a90d.jpg', '72df68df4bc1cfa526bb3ae4da3d4f06.jpg'], 'High-voltage project/manufacturing reference with visible XGN-40.5-series markings; customer-supplied photo, not the listed KYN61-40.5 model.', highVoltageContext),
  product('kyn28-12', 'hv-switchgear', ['31da433f19c652ef226adf68587f0afd.jpg', 'bfb6243b6e876212a40c6c1f97cd18d2.jpg', 'd9fdc25dc385d622514d29fad41d86dc.jpg'], 'Visible KYN28A-12 series variant; customer-supplied photo shown as context for KYN28-12, not the exact listed model.', kyn28Context),
  product('hxgn-12', 'hv-switchgear', ['fcabfea35ff10fbd7d0106d729a26390.jpg', '74555b5dbc17d0e1f4dbd000e97d0cda.jpg'], 'High-voltage project/manufacturing reference with visible XGN-40.5G or KYN28-24 markings; customer-supplied photo, not the listed HXGN-12 model.', highVoltageContext),

  product('mns', 'lv-switchgear', ['145d8f2fb35cde497a78de753733de09.jpg'], referenceAlt('Electrical-cabinet assembly workshop')),
  product('gcs', 'lv-switchgear', ['30d699934a9dc20b49d07ccb91fa1cef.jpg'], referenceAlt('Completed cabinet production-line')),
  product('gck', 'lv-switchgear', ['5c14f20c11cae0e7c9617cdd638846fd.jpg'], referenceAlt('Cabinet assembly and wiring')),
  product('ggd', 'lv-switchgear', ['5db473a5465b7db0c12cc26e0c1843cc.jpg'], referenceAlt('Mixed electrical-equipment workshop')),
  product('svc', 'lv-switchgear', ['e4915e3ee3bcf118efd515fa321ab0a5.jpg'], referenceAlt('Factory logistics and workshop entrance')),

  product('xl-power-distribution-box', 'distribution-box', ['60a2398278c02f4d6441f2c715df5a6f.jpg'], referenceAlt('Sheet-metal enclosure fabrication')),
  product('jxf', 'distribution-box', ['f0b42be9bff25d93aea867d94460452e.jpg'], referenceAlt('Open workshop with cabinet frames')),
  product('ats-dual-source', 'distribution-box', ['02f2c9b85494be5f6063823e28e5665f.jpg'], referenceAlt('Components storage and materials handling')),
  product('jp-integrated', 'distribution-box', ['387e1063a6c0345b8c690c4a64cd7b7d.jpg'], referenceAlt('Parts warehouse and material management')),
  product('dbx-smc', 'distribution-box', ['07aa12b7ec089769602cf99396ad4717.jpg'], referenceAlt('Factory campus and safety environment')),
  product('pz30', 'distribution-box', ['95cdd4127a66a1c65e08bc0b816e41e4.jpg'], referenceAlt('Factory road and workshop exterior')),

  product('box-substation', 'box-substation', ['41a7662e2280501fc87a68d90e51c191.jpg'], referenceAlt('Factory campus and production-building exterior')),

  product('cl-compact-busway', 'busway', ['3e9c2d13f4aee978503506a95c46f298.jpg'], referenceAlt('Factory campus and manufacturing-site')),
  product('cfw-air-busway', 'busway', ['5db473a5465b7db0c12cc26e0c1843cc.jpg'], referenceAlt('Mixed electrical-equipment workshop')),
  product('nhmc-fire-busway', 'busway', ['dc66751b92bf3bd2a4edc3589a63270d.jpg'], referenceAlt('Factory buildings and internal logistics')),
  product('fsmc-resin-busway', 'busway', ['fa5cc2105a12324374ce3e47e9e7c65d.jpg'], referenceAlt('Factory campus and delivery access')),

  product('xqj-c-trough', 'cable-tray', ['60a2398278c02f4d6441f2c715df5a6f.jpg'], referenceAlt('Sheet-metal enclosure and frame fabrication')),
  product('xqj-p-tray', 'cable-tray', ['f0b42be9bff25d93aea867d94460452e.jpg'], referenceAlt('Metal fabrication workshop')),
  product('xqj-t-ladder', 'cable-tray', ['02f2c9b85494be5f6063823e28e5665f.jpg'], referenceAlt('Components warehouse and materials handling')),
  product('lqj-aluminum', 'cable-tray', ['387e1063a6c0345b8c690c4a64cd7b7d.jpg'], referenceAlt('Parts racks and material storage')),
  product('dnch-fk', 'cable-tray', ['145d8f2fb35cde497a78de753733de09.jpg'], referenceAlt('Metal enclosure assembly workshop')),
  product('dnch-fx', 'cable-tray', ['5c14f20c11cae0e7c9617cdd638846fd.jpg'], referenceAlt('Workshop assembly process')),
  product('xqj-p-light', 'cable-tray', ['e4915e3ee3bcf118efd515fa321ab0a5.jpg'], referenceAlt('Factory logistics and workshop entrance')),
  product('gqqj-high-strength', 'cable-tray', ['30d699934a9dc20b49d07ccb91fa1cef.jpg'], referenceAlt('Manufacturing output and warehouse staging')),
]

const category = (slug, file, scene, imageContext = manufacturingContext) => ({
  tenantId: TENANT_ID,
  slug,
  imageUrl: r2(file),
  imageAlt: `${scene} category reference; customer-supplied photo, not model-specific.`,
  imageContext,
})

export const categoryImageMappings = [
  category('hv-switchgear', '9f207edbf52231ba32365ec49be9a90d.jpg', 'High-voltage project/manufacturing', highVoltageContext),
  category('lv-switchgear', '145d8f2fb35cde497a78de753733de09.jpg', 'Electrical-cabinet assembly workshop'),
  category('distribution-box', '60a2398278c02f4d6441f2c715df5a6f.jpg', 'Sheet-metal enclosure fabrication'),
  category('box-substation', '41a7662e2280501fc87a68d90e51c191.jpg', 'Factory campus and production-building'),
  category('busway', '5db473a5465b7db0c12cc26e0c1843cc.jpg', 'General electrical-equipment workshop'),
  category('cable-tray', '02f2c9b85494be5f6063823e28e5665f.jpg', 'Materials warehouse and metal-fabrication support'),
]

export const productImageMappingBySlug = Object.fromEntries(productImageMappings.map((mapping) => [mapping.slug, mapping]))
export const categoryImageMappingBySlug = Object.fromEntries(categoryImageMappings.map((mapping) => [mapping.slug, mapping]))
