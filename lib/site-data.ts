// CHANG HUI ELECTRIC — Central data source
// All facts sourced from confirmed company materials only.

export const company = {
  name: 'CHANG HUI ELECTRIC',
  legalName: 'Jiangsu Changhui Electric Co., Ltd.',
  cnName: '江苏昌晖电气有限公司',
  tagline: 'Custom Electrical Distribution Equipment — Built to Your Drawings',
  established: 'December 13, 2019',
  registeredCapital: 'RMB 30.05 million',
  totalArea: '42,000 m²',
  buildingArea: '25,000 m²',
  address: 'No. 168, Xinba Science & Technology Park, Yangzhong, Jiangsu, China',
  factoryAddress: 'No. 28, Yaoqiao Road, Yaoqiao Town, Zhenjiang New Area, Jiangsu, China',
  qualitySystem: 'The company materials state that an ISO 9001 quality management system is in place.',
  phones: ['+86-153-5862-3101', '+86-511-8888-1633'],
  emails: ['jschanghui@163.com', 'jschanghui@126.com'],
}

export const stats = [
  { value: '42,000', suffix: ' m²', label: 'Total Site Area' },
  { value: '25,000', suffix: ' m²', label: 'Building Area' },
  { value: '1', suffix: ' MOQ', label: 'Minimum Order Qty' },
  { value: '2', suffix: '-year', label: 'Free Warranty' },
]

export const nav = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Products', href: '/products' },
  { label: 'Capabilities', href: '/capabilities' },
  { label: 'Quality', href: '/quality' },
  { label: 'News', href: '/news' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
]

const r2AssetBase = 'https://pub-c7a22068052144a5805830c30d280128.r2.dev/v0-design-assets/jiangsu-changhui/'

const r2Asset = (fileName: string) => `${r2AssetBase}${fileName.endsWith('.jpg') ? 'brand-free/' : ''}${fileName}`

export const photos = {
  logo: r2Asset('LOGO.png'),
  factoryExteriorA: r2Asset('02f2c9b85494be5f6063823e28e5665f.jpg'),
  factoryExteriorB: r2Asset('07aa12b7ec089769602cf99396ad4717.jpg'),
  factoryExteriorC: r2Asset('145d8f2fb35cde497a78de753733de09.jpg'),
  factoryGarden: r2Asset('246d07276ec814ad150bfa9b0743524b.jpg'),
  factorySafety: r2Asset('30d699934a9dc20b49d07ccb91fa1cef.jpg'),
  productionHallA: r2Asset('31da433f19c652ef226adf68587f0afd.jpg'),
  productionHallB: r2Asset('387e1063a6c0345b8c690c4a64cd7b7d.jpg'),
  assemblyWiringA: r2Asset('3e9c2d13f4aee978503506a95c46f298.jpg'),
  enclosureShells: r2Asset('41a7662e2280501fc87a68d90e51c191.jpg'),
  hvKyn28Row: r2Asset('5c14f20c11cae0e7c9617cdd638846fd.jpg'),
  hvKyn28Units: r2Asset('5db473a5465b7db0c12cc26e0c1843cc.jpg'),
  hvKyn28Detail: r2Asset('60a2398278c02f4d6441f2c715df5a6f.jpg'),
  hvKyn28Tr5: r2Asset('72df68df4bc1cfa526bb3ae4da3d4f06.jpg'),
  hvKyn28Tr7: r2Asset('74555b5dbc17d0e1f4dbd000e97d0cda.jpg'),
  hvXgnUnit: r2Asset('95cdd4127a66a1c65e08bc0b816e41e4.jpg'),
  hvTechnicianWiring: r2Asset('9f207edbf52231ba32365ec49be9a90d.jpg'),
  warehouse: r2Asset('bfb6243b6e876212a40c6c1f97cd18d2.jpg'),
  partsWarehouse: r2Asset('d9fdc25dc385d622514d29fad41d86dc.jpg'),
  factoryDoorForklift: r2Asset('dc66751b92bf3bd2a4edc3589a63270d.jpg'),
  productionHallC: r2Asset('e4915e3ee3bcf118efd515fa321ab0a5.jpg'),
  factoryRoadD: r2Asset('f0b42be9bff25d93aea867d94460452e.jpg'),
  hvXgnOpenDoor: r2Asset('fa5cc2105a12324374ce3e47e9e7c65d.jpg'),
  customerPhoto23: r2Asset('fcabfea35ff10fbd7d0106d729a26390.jpg'),
  video1: r2Asset('6ac3922c83d45e180deaaa40ed76094a.mp4'),
  video2: r2Asset('71567e513fa6260a173a4f721bb6cb50.mp4'),
  video3: r2Asset('8a23dc13e83287e70477bd094f7c134d.mp4'),
  video4: r2Asset('a606292cd803c6034f21c14a4e93a42c.mp4'),
  video5: r2Asset('fe632746fdfc968d086c2afb3dfe63b2.mp4'),
}

export const customerImageAssets = [
  { src: r2Asset('02f2c9b85494be5f6063823e28e5665f.jpg'), alt: 'Customer-supplied company photograph 01', caption: 'Company photograph 01 — supplied by Jiangsu Changhui Electric' },
  { src: r2Asset('07aa12b7ec089769602cf99396ad4717.jpg'), alt: 'Customer-supplied company photograph 02', caption: 'Company photograph 02 — supplied by Jiangsu Changhui Electric' },
  { src: r2Asset('145d8f2fb35cde497a78de753733de09.jpg'), alt: 'Customer-supplied company photograph 03', caption: 'Company photograph 03 — supplied by Jiangsu Changhui Electric' },
  { src: r2Asset('246d07276ec814ad150bfa9b0743524b.jpg'), alt: 'Customer-supplied company photograph 04', caption: 'Company photograph 04 — supplied by Jiangsu Changhui Electric' },
  { src: r2Asset('30d699934a9dc20b49d07ccb91fa1cef.jpg'), alt: 'Customer-supplied company photograph 05', caption: 'Company photograph 05 — supplied by Jiangsu Changhui Electric' },
  { src: r2Asset('31da433f19c652ef226adf68587f0afd.jpg'), alt: 'Customer-supplied company photograph 06', caption: 'Company photograph 06 — supplied by Jiangsu Changhui Electric' },
  { src: r2Asset('387e1063a6c0345b8c690c4a64cd7b7d.jpg'), alt: 'Customer-supplied company photograph 07', caption: 'Company photograph 07 — supplied by Jiangsu Changhui Electric' },
  { src: r2Asset('3e9c2d13f4aee978503506a95c46f298.jpg'), alt: 'Customer-supplied company photograph 08', caption: 'Company photograph 08 — supplied by Jiangsu Changhui Electric' },
  { src: r2Asset('41a7662e2280501fc87a68d90e51c191.jpg'), alt: 'Customer-supplied company photograph 09', caption: 'Company photograph 09 — supplied by Jiangsu Changhui Electric' },
  { src: r2Asset('5c14f20c11cae0e7c9617cdd638846fd.jpg'), alt: 'Customer-supplied company photograph 10', caption: 'Company photograph 10 — supplied by Jiangsu Changhui Electric' },
  { src: r2Asset('5db473a5465b7db0c12cc26e0c1843cc.jpg'), alt: 'Customer-supplied company photograph 11', caption: 'Company photograph 11 — supplied by Jiangsu Changhui Electric' },
  { src: r2Asset('60a2398278c02f4d6441f2c715df5a6f.jpg'), alt: 'Customer-supplied company photograph 12', caption: 'Company photograph 12 — supplied by Jiangsu Changhui Electric' },
  { src: r2Asset('72df68df4bc1cfa526bb3ae4da3d4f06.jpg'), alt: 'Customer-supplied company photograph 13', caption: 'Company photograph 13 — supplied by Jiangsu Changhui Electric' },
  { src: r2Asset('74555b5dbc17d0e1f4dbd000e97d0cda.jpg'), alt: 'Customer-supplied company photograph 14', caption: 'Company photograph 14 — supplied by Jiangsu Changhui Electric' },
  { src: r2Asset('95cdd4127a66a1c65e08bc0b816e41e4.jpg'), alt: 'Customer-supplied company photograph 15', caption: 'Company photograph 15 — supplied by Jiangsu Changhui Electric' },
  { src: r2Asset('9f207edbf52231ba32365ec49be9a90d.jpg'), alt: 'Customer-supplied company photograph 16', caption: 'Company photograph 16 — supplied by Jiangsu Changhui Electric' },
  { src: r2Asset('bfb6243b6e876212a40c6c1f97cd18d2.jpg'), alt: 'Customer-supplied company photograph 17', caption: 'Company photograph 17 — supplied by Jiangsu Changhui Electric' },
  { src: r2Asset('d9fdc25dc385d622514d29fad41d86dc.jpg'), alt: 'Customer-supplied company photograph 18', caption: 'Company photograph 18 — supplied by Jiangsu Changhui Electric' },
  { src: r2Asset('dc66751b92bf3bd2a4edc3589a63270d.jpg'), alt: 'Customer-supplied company photograph 19', caption: 'Company photograph 19 — supplied by Jiangsu Changhui Electric' },
  { src: r2Asset('e4915e3ee3bcf118efd515fa321ab0a5.jpg'), alt: 'Customer-supplied company photograph 20', caption: 'Company photograph 20 — supplied by Jiangsu Changhui Electric' },
  { src: r2Asset('f0b42be9bff25d93aea867d94460452e.jpg'), alt: 'Customer-supplied company photograph 21', caption: 'Company photograph 21 — supplied by Jiangsu Changhui Electric' },
  { src: r2Asset('fa5cc2105a12324374ce3e47e9e7c65d.jpg'), alt: 'Customer-supplied company photograph 22', caption: 'Company photograph 22 — supplied by Jiangsu Changhui Electric' },
  { src: r2Asset('fcabfea35ff10fbd7d0106d729a26390.jpg'), alt: 'Customer-supplied company photograph 23', caption: 'Company photograph 23 — supplied by Jiangsu Changhui Electric' },
]

export const customerVideos = [
  { src: r2Asset('6ac3922c83d45e180deaaa40ed76094a.mp4'), trackSrc: '/captions/cabinet-wiring-ambient.vtt', title: 'Customer-supplied company video 1', description: 'A customer-supplied vertical clip of cabinet wiring work. The original audio contains workshop ambience and handling sounds; local Whisper analysis found no meaningful speech.' },
  { src: r2Asset('71567e513fa6260a173a4f721bb6cb50.mp4'), trackSrc: '/captions/brief-cabinet-pan-ambient.vtt', title: 'Customer-supplied company video 2', description: 'A brief customer-supplied view of electrical cabinets. The original audio contains short workshop ambience; local Whisper analysis found no meaningful speech.' },
  { src: r2Asset('8a23dc13e83287e70477bd094f7c134d.mp4'), trackSrc: '/captions/cabinet-work-ambient.vtt', title: 'Customer-supplied company video 3', description: 'A customer-supplied vertical clip of work inside a cabinet. The original audio contains workshop ambience and light work sounds; local Whisper analysis found no meaningful speech.' },
  { src: r2Asset('a606292cd803c6034f21c14a4e93a42c.mp4'), trackSrc: '/captions/extended-cabinet-work-ambient.vtt', title: 'Customer-supplied company video 4', description: 'A longer customer-supplied clip of cabinet work and nearby test equipment. The original audio is continuous workshop ambience without meaningful speech.' },
  { src: r2Asset('fe632746fdfc968d086c2afb3dfe63b2.mp4'), trackSrc: '/captions/workshop-pan-ambient.vtt', title: 'Customer-supplied company video 5', description: 'A customer-supplied horizontal pan across cabinets on a workshop floor. The original audio contains changing workshop ambience; local Whisper analysis found no meaningful speech.' },
]

// The only sustained landscape workshop overview among the supplied clips.
export const heroBackgroundVideo = customerVideos[4]

export type Product = {
  slug: string
  name: string
  category: string
  categoryName: string
  image: string
  images?: string[]
  imageAlt?: string
  imageContext?: string
  description: string
  customNote: string
  applications: string[]
  relatedSlugs: string[]
  updatedAt?: string
}

export type ProductCategory = {
  slug: string
  name: string
  image: string
  imageAlt?: string
  imageContext?: string
  short: string
  productSlugs: string[]
  products: Product[]
  updatedAt?: string
}

// Convenient alias used by components
export const clientImages = {
  // Factory exterior / campus
  factoryCampusMain:  photos.factoryRoadD,
  factoryExteriorA:   photos.factoryExteriorA,
  factoryExteriorB:   photos.factoryExteriorB,
  factoryExteriorC:   photos.factoryExteriorC,
  factoryGarden:      photos.factoryGarden,
  // Workshop
  workshopMain:       photos.factorySafety,
  workshopGate:       photos.factoryDoorForklift,
  workshopInterior:   photos.productionHallC,
  workshopAssembly:   photos.assemblyWiringA,
  workshopCabinets:   photos.productionHallA,
  engineerInspecting: photos.hvXgnOpenDoor,
  // Products
  kyn28Units:         photos.hvKyn28Units,
  kyn28Row:           photos.hvKyn28Row,
  xgnUnit:            photos.hvXgnUnit,
  enclosureShells:    photos.enclosureShells,
}

export const products: Product[] = [
  // HV Switchgear (3)
  { slug: 'kyn61-40-5', name: 'KYN61-40.5 Metal-Clad Withdrawable AC Switchgear', category: 'hv-switchgear', categoryName: 'High Voltage Switchgear', image: '/products/hv-switchgear.png', images: ['/products/hv-switchgear.png'], description: 'This model is included in the customer-supplied product list. Configuration, dimensions and technical performance are confirmed for each order from approved drawings and project requirements.', customNote: 'Please provide drawings, quantities and project requirements for engineering review and quotation.', applications: ['Made to drawings', 'Project-specific configuration'], relatedSlugs: ['kyn28-12', 'hxgn-12'] },
  { slug: 'kyn28-12', name: 'KYN28-12 Metal-Clad Withdrawable AC Switchgear', category: 'hv-switchgear', categoryName: 'High Voltage Switchgear', image: '/products/hv-switchgear.png', images: ['/products/hv-switchgear.png'], description: 'This model is included in the customer-supplied product list. Configuration, dimensions and technical performance are confirmed for each order from approved drawings and project requirements.', customNote: 'Please provide drawings, quantities and project requirements for engineering review and quotation.', applications: ['Made to drawings', 'Project-specific configuration'], relatedSlugs: ['kyn61-40-5', 'hxgn-12'] },
  { slug: 'hxgn-12', name: 'HXGN\u25a1-12 AC Metal Ring Main Unit', category: 'hv-switchgear', categoryName: 'High Voltage Switchgear', image: '/products/hv-switchgear.png', images: ['/products/hv-switchgear.png'], description: 'This model is included in the customer-supplied product list. Configuration, dimensions and technical performance are confirmed for each order from approved drawings and project requirements.', customNote: 'Please provide drawings, quantities and project requirements for engineering review and quotation.', applications: ['Made to drawings', 'Project-specific configuration'], relatedSlugs: ['kyn28-12', 'kyn61-40-5'] },
  // LV Switchgear (5)
  { slug: 'mns', name: 'MNS Low Voltage Withdrawable Switchgear', category: 'lv-switchgear', categoryName: 'Low Voltage Switchgear', image: '/products/lv-switchgear.png', images: ['/products/lv-switchgear.png'], description: 'This model is included in the customer-supplied product list. Configuration, dimensions and technical performance are confirmed for each order from approved drawings and project requirements.', customNote: 'Please provide drawings, quantities and project requirements for engineering review and quotation.', applications: ['Made to drawings', 'Project-specific configuration'], relatedSlugs: ['gcs', 'gck', 'ggd'] },
  { slug: 'gcs', name: 'GCS Low Voltage Withdrawable Switchgear', category: 'lv-switchgear', categoryName: 'Low Voltage Switchgear', image: '/products/lv-switchgear.png', images: ['/products/lv-switchgear.png'], description: 'This model is included in the customer-supplied product list. Configuration, dimensions and technical performance are confirmed for each order from approved drawings and project requirements.', customNote: 'Please provide drawings, quantities and project requirements for engineering review and quotation.', applications: ['Made to drawings', 'Project-specific configuration'], relatedSlugs: ['mns', 'gck', 'ggd'] },
  { slug: 'gck', name: 'GCK Low Voltage Withdrawable Switchgear', category: 'lv-switchgear', categoryName: 'Low Voltage Switchgear', image: '/products/lv-switchgear.png', images: ['/products/lv-switchgear.png'], description: 'This model is included in the customer-supplied product list. Configuration, dimensions and technical performance are confirmed for each order from approved drawings and project requirements.', customNote: 'Please provide drawings, quantities and project requirements for engineering review and quotation.', applications: ['Made to drawings', 'Project-specific configuration'], relatedSlugs: ['mns', 'gcs', 'ggd'] },
  { slug: 'ggd', name: 'GGD AC Low Voltage Power Distribution Cabinet', category: 'lv-switchgear', categoryName: 'Low Voltage Switchgear', image: '/products/lv-switchgear.png', images: ['/products/lv-switchgear.png'], description: 'This model is included in the customer-supplied product list. Configuration, dimensions and technical performance are confirmed for each order from approved drawings and project requirements.', customNote: 'Please provide drawings, quantities and project requirements for engineering review and quotation.', applications: ['Made to drawings', 'Project-specific configuration'], relatedSlugs: ['mns', 'gcs', 'svc'] },
  { slug: 'svc', name: 'SVC Low Voltage Reactive Power Compensation Device', category: 'lv-switchgear', categoryName: 'Low Voltage Switchgear', image: '/products/lv-switchgear.png', images: ['/products/lv-switchgear.png'], description: 'This model is included in the customer-supplied product list. Configuration, dimensions and technical performance are confirmed for each order from approved drawings and project requirements.', customNote: 'Please provide drawings, quantities and project requirements for engineering review and quotation.', applications: ['Made to drawings', 'Project-specific configuration'], relatedSlugs: ['ggd', 'mns'] },
  // Distribution Boxes (6)
  { slug: 'xl-power-distribution-box', name: 'XL Power Distribution Box (Cabinet)', category: 'distribution-box', categoryName: 'Distribution Boxes', image: '/products/distribution-box.png', images: ['/products/distribution-box.png'], description: 'This model is included in the customer-supplied product list. Configuration, dimensions and technical performance are confirmed for each order from approved drawings and project requirements.', customNote: 'Please provide drawings, quantities and project requirements for engineering review and quotation.', applications: ['Made to drawings', 'Project-specific configuration'], relatedSlugs: ['jxf', 'ats-dual-source', 'jp-integrated'] },
  { slug: 'jxf', name: 'JXF Distribution Box Series', category: 'distribution-box', categoryName: 'Distribution Boxes', image: '/products/distribution-box.png', images: ['/products/distribution-box.png'], description: 'This model is included in the customer-supplied product list. Configuration, dimensions and technical performance are confirmed for each order from approved drawings and project requirements.', customNote: 'Please provide drawings, quantities and project requirements for engineering review and quotation.', applications: ['Made to drawings', 'Project-specific configuration'], relatedSlugs: ['xl-power-distribution-box', 'pz30', 'jp-integrated'] },
  { slug: 'ats-dual-source', name: 'ATS Dual-Source Distribution Box (Cabinet)', category: 'distribution-box', categoryName: 'Distribution Boxes', image: '/products/distribution-box.png', images: ['/products/distribution-box.png'], description: 'This model is included in the customer-supplied product list. Configuration, dimensions and technical performance are confirmed for each order from approved drawings and project requirements.', customNote: 'Please provide drawings, quantities and project requirements for engineering review and quotation.', applications: ['Made to drawings', 'Project-specific configuration'], relatedSlugs: ['xl-power-distribution-box', 'jp-integrated'] },
  { slug: 'jp-integrated', name: 'JP Integrated Distribution Cabinet', category: 'distribution-box', categoryName: 'Distribution Boxes', image: '/products/distribution-box.png', images: ['/products/distribution-box.png'], description: 'This model is included in the customer-supplied product list. Configuration, dimensions and technical performance are confirmed for each order from approved drawings and project requirements.', customNote: 'Please provide drawings, quantities and project requirements for engineering review and quotation.', applications: ['Made to drawings', 'Project-specific configuration'], relatedSlugs: ['xl-power-distribution-box', 'ats-dual-source'] },
  { slug: 'dbx-smc', name: 'DBX-SMC Non-Metallic Distribution Box', category: 'distribution-box', categoryName: 'Distribution Boxes', image: '/products/distribution-box.png', images: ['/products/distribution-box.png'], description: 'This model is included in the customer-supplied product list. Configuration, dimensions and technical performance are confirmed for each order from approved drawings and project requirements.', customNote: 'Please provide drawings, quantities and project requirements for engineering review and quotation.', applications: ['Made to drawings', 'Project-specific configuration'], relatedSlugs: ['xl-power-distribution-box', 'jxf', 'pz30'] },
  { slug: 'pz30', name: 'PZ30 Series Distribution Box', category: 'distribution-box', categoryName: 'Distribution Boxes', image: '/products/distribution-box.png', images: ['/products/distribution-box.png'], description: 'This model is included in the customer-supplied product list. Configuration, dimensions and technical performance are confirmed for each order from approved drawings and project requirements.', customNote: 'Please provide drawings, quantities and project requirements for engineering review and quotation.', applications: ['Made to drawings', 'Project-specific configuration'], relatedSlugs: ['jxf', 'dbx-smc'] },
  // Box Substation (1)
  { slug: 'box-substation', name: 'Box-Type Substation Series (European Style)', category: 'box-substation', categoryName: 'Box-Type Substations', image: '/products/transformer.png', images: ['/products/transformer.png'], description: 'This model is included in the customer-supplied product list. Configuration, dimensions and technical performance are confirmed for each order from approved drawings and project requirements.', customNote: 'Please provide drawings, quantities and project requirements for engineering review and quotation.', applications: ['Made to drawings', 'Project-specific configuration'], relatedSlugs: ['kyn28-12', 'mns', 'ggd'] },
  // Busway (4)
  { slug: 'cl-compact-busway', name: 'CL Compact (Sandwich) Busway System', category: 'busway', categoryName: 'Busway Systems', image: '/products/busway.png', images: ['/products/busway.png'], description: 'This model is included in the customer-supplied product list. Configuration, dimensions and technical performance are confirmed for each order from approved drawings and project requirements.', customNote: 'Please provide drawings, quantities and project requirements for engineering review and quotation.', applications: ['Made to drawings', 'Project-specific configuration'], relatedSlugs: ['cfw-air-busway', 'nhmc-fire-busway', 'fsmc-resin-busway'] },
  { slug: 'cfw-air-busway', name: 'CFW Air-Insulated Busway', category: 'busway', categoryName: 'Busway Systems', image: '/products/busway.png', images: ['/products/busway.png'], description: 'This model is included in the customer-supplied product list. Configuration, dimensions and technical performance are confirmed for each order from approved drawings and project requirements.', customNote: 'Please provide drawings, quantities and project requirements for engineering review and quotation.', applications: ['Made to drawings', 'Project-specific configuration'], relatedSlugs: ['cl-compact-busway', 'nhmc-fire-busway', 'fsmc-resin-busway'] },
  { slug: 'nhmc-fire-busway', name: 'NHMC Fire-Resistant Busway', category: 'busway', categoryName: 'Busway Systems', image: '/products/busway.png', images: ['/products/busway.png'], description: 'This model is included in the customer-supplied product list. Configuration, dimensions and technical performance are confirmed for each order from approved drawings and project requirements.', customNote: 'Please provide drawings, quantities and project requirements for engineering review and quotation.', applications: ['Made to drawings', 'Project-specific configuration'], relatedSlugs: ['cl-compact-busway', 'cfw-air-busway', 'fsmc-resin-busway'] },
  { slug: 'fsmc-resin-busway', name: 'FSMC Fully Enclosed Resin-Cast Waterproof Busway', category: 'busway', categoryName: 'Busway Systems', image: '/products/busway.png', images: ['/products/busway.png'], description: 'This model is included in the customer-supplied product list. Configuration, dimensions and technical performance are confirmed for each order from approved drawings and project requirements.', customNote: 'Please provide drawings, quantities and project requirements for engineering review and quotation.', applications: ['Made to drawings', 'Project-specific configuration'], relatedSlugs: ['cl-compact-busway', 'nhmc-fire-busway', 'cfw-air-busway'] },
  // Cable Tray (8)
  { slug: 'xqj-c-trough', name: 'XQJ-C Trough Cable Tray', category: 'cable-tray', categoryName: 'Cable Tray Systems', image: '/products/cable-tray.png', images: ['/products/cable-tray.png'], description: 'This model is included in the customer-supplied product list. Configuration, dimensions and technical performance are confirmed for each order from approved drawings and project requirements.', customNote: 'Please provide drawings, quantities and project requirements for engineering review and quotation.', applications: ['Made to drawings', 'Project-specific configuration'], relatedSlugs: ['xqj-p-tray', 'xqj-t-ladder', 'lqj-aluminum'] },
  { slug: 'xqj-p-tray', name: 'XQJ-P Tray Cable Tray', category: 'cable-tray', categoryName: 'Cable Tray Systems', image: '/products/cable-tray.png', images: ['/products/cable-tray.png'], description: 'This model is included in the customer-supplied product list. Configuration, dimensions and technical performance are confirmed for each order from approved drawings and project requirements.', customNote: 'Please provide drawings, quantities and project requirements for engineering review and quotation.', applications: ['Made to drawings', 'Project-specific configuration'], relatedSlugs: ['xqj-c-trough', 'xqj-t-ladder', 'xqj-p-light'] },
  { slug: 'xqj-t-ladder', name: 'XQJ-T Ladder Cable Tray', category: 'cable-tray', categoryName: 'Cable Tray Systems', image: '/products/cable-tray.png', images: ['/products/cable-tray.png'], description: 'This model is included in the customer-supplied product list. Configuration, dimensions and technical performance are confirmed for each order from approved drawings and project requirements.', customNote: 'Please provide drawings, quantities and project requirements for engineering review and quotation.', applications: ['Made to drawings', 'Project-specific configuration'], relatedSlugs: ['xqj-p-tray', 'xqj-c-trough', 'lqj-aluminum'] },
  { slug: 'lqj-aluminum', name: 'LQJ Aluminum Alloy Cable Tray', category: 'cable-tray', categoryName: 'Cable Tray Systems', image: '/products/cable-tray.png', images: ['/products/cable-tray.png'], description: 'This model is included in the customer-supplied product list. Configuration, dimensions and technical performance are confirmed for each order from approved drawings and project requirements.', customNote: 'Please provide drawings, quantities and project requirements for engineering review and quotation.', applications: ['Made to drawings', 'Project-specific configuration'], relatedSlugs: ['xqj-p-tray', 'xqj-t-ladder', 'dnch-fk'] },
  { slug: 'dnch-fk', name: 'DNCH-FK Fire-Resistant Cable Tray', category: 'cable-tray', categoryName: 'Cable Tray Systems', image: '/products/cable-tray.png', images: ['/products/cable-tray.png'], description: 'This model is included in the customer-supplied product list. Configuration, dimensions and technical performance are confirmed for each order from approved drawings and project requirements.', customNote: 'Please provide drawings, quantities and project requirements for engineering review and quotation.', applications: ['Made to drawings', 'Project-specific configuration'], relatedSlugs: ['dnch-fx', 'xqj-c-trough', 'nhmc-fire-busway'] },
  { slug: 'dnch-fx', name: 'DNCH-FX Fire-Resistant Cable Tray', category: 'cable-tray', categoryName: 'Cable Tray Systems', image: '/products/cable-tray.png', images: ['/products/cable-tray.png'], description: 'This model is included in the customer-supplied product list. Configuration, dimensions and technical performance are confirmed for each order from approved drawings and project requirements.', customNote: 'Please provide drawings, quantities and project requirements for engineering review and quotation.', applications: ['Made to drawings', 'Project-specific configuration'], relatedSlugs: ['dnch-fk', 'xqj-c-trough', 'nhmc-fire-busway'] },
  { slug: 'xqj-p-light', name: 'XQJ-P Light-Duty Energy-Saving Cable Tray', category: 'cable-tray', categoryName: 'Cable Tray Systems', image: '/products/cable-tray.png', images: ['/products/cable-tray.png'], description: 'This model is included in the customer-supplied product list. Configuration, dimensions and technical performance are confirmed for each order from approved drawings and project requirements.', customNote: 'Please provide drawings, quantities and project requirements for engineering review and quotation.', applications: ['Made to drawings', 'Project-specific configuration'], relatedSlugs: ['xqj-p-tray', 'gqqj-high-strength', 'xqj-c-trough'] },
  { slug: 'gqqj-high-strength', name: 'GQQJ High-Strength Energy-Saving Cable Tray', category: 'cable-tray', categoryName: 'Cable Tray Systems', image: '/products/cable-tray.png', images: ['/products/cable-tray.png'], description: 'This model is included in the customer-supplied product list. Configuration, dimensions and technical performance are confirmed for each order from approved drawings and project requirements.', customNote: 'Please provide drawings, quantities and project requirements for engineering review and quotation.', applications: ['Made to drawings', 'Project-specific configuration'], relatedSlugs: ['xqj-p-light', 'xqj-t-ladder', 'xqj-p-tray'] },
]

function buildCategories(): ProductCategory[] {
  const defs = [
        { slug: 'hv-switchgear', name: 'High Voltage Switchgear', image: '/products/hv-switchgear.png', short: 'Customer-listed high-voltage switchgear models; final specifications are confirmed from project drawings.', productSlugs: ['kyn61-40-5', 'kyn28-12', 'hxgn-12'] },
    { slug: 'lv-switchgear', name: 'Low Voltage Switchgear', image: '/products/lv-switchgear.png', short: 'Customer-listed low-voltage switchgear models supplied to approved drawings and requirements.', productSlugs: ['mns', 'gcs', 'gck', 'ggd', 'svc'] },
    { slug: 'distribution-box', name: 'Distribution Boxes', image: '/products/distribution-box.png', short: 'Customer-listed distribution box series; dimensions and configurations are project-specific.', productSlugs: ['xl-power-distribution-box', 'jxf', 'ats-dual-source', 'jp-integrated', 'dbx-smc', 'pz30'] },
    { slug: 'box-substation', name: 'Box-Type Substations', image: '/products/transformer.png', short: 'Box-type substation series listed in the supplied product information.', productSlugs: ['box-substation'] },
    { slug: 'busway', name: 'Busway Systems', image: '/products/busway.png', short: 'Customer-listed busway series supplied according to approved project requirements.', productSlugs: ['cl-compact-busway', 'cfw-air-busway', 'nhmc-fire-busway', 'fsmc-resin-busway'] },
    { slug: 'cable-tray', name: 'Cable Tray Systems', image: '/products/cable-tray.png', short: 'Customer-listed cable tray series supplied according to approved project requirements.', productSlugs: ['xqj-c-trough', 'xqj-p-tray', 'xqj-t-ladder', 'lqj-aluminum', 'dnch-fk', 'dnch-fx', 'xqj-p-light', 'gqqj-high-strength'] },
  ]
  return defs.map((def) => ({
    ...def,
    products: def.productSlugs
      .map((s) => products.find((p) => p.slug === s))
      .filter((p): p is Product => p !== undefined),
  }))
}

export const productCategories: ProductCategory[] = buildCategories()

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}

export function getRelatedProducts(product: Product): Product[] {
  return product.relatedSlugs.map((s) => getProduct(s)).filter((p): p is Product => p !== undefined).slice(0, 3)
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((p) => p.category === categorySlug)
}

export const faqs = [
  { category: 'Product Specifications & Customization', items: [
    { q: 'Do you support customized size, material, color and process?', a: 'Yes. All products can be customized to your requirements for dimensions, materials, colors and manufacturing process. Please share your drawings or technical specifications.' },
    { q: 'What products do you manufacture?', a: 'We manufacture 27 products across 6 categories: high voltage switchgear (KYN61-40.5, KYN28-12, HXGN\u25a1-12), low voltage switchgear (MNS, GCS, GCK, GGD, SVC), distribution boxes (XL, JXF, ATS, JP, DBX-SMC, PZ30), box-type substations, busway systems (CL, CFW, NHMC, FSMC) and cable tray systems (XQJ-C, XQJ-P, XQJ-T, LQJ, DNCH-FK, DNCH-FX, XQJ-P light-duty, GQQJ). All products are made to project drawings and requirements.' },
    { q: 'Can you support OEM / ODM?', a: 'Yes, we support both OEM and ODM, including individually designed solutions backed by our in-house engineering team.' },
    { q: 'Can you provide technical data sheets or test reports?', a: 'Yes. We can provide technical data sheets and factory inspection or test reports for each order on request.' },
  ]},
  { category: 'Samples & Prototyping', items: [
    { q: 'Can you supply a sample before mass production?', a: 'Yes. Sample lead time is 10–20 days, confirmed against approved drawings before proceeding to production.' },
    { q: 'Are samples consistent with mass-production quality?', a: 'Yes. The approved sample and drawings define the production standard; mass production matches the confirmed sample exactly.' },
  ]},
  { category: 'MOQ & Pricing', items: [
    { q: 'What is the minimum order quantity (MOQ)?', a: 'Our MOQ is 1 unit — you can order a single cabinet or scale to a full project.' },
    { q: 'Does the website show product prices?', a: 'No. Every product is custom-built to drawings and project requirements, so pricing depends on specification, quantity and raw-material conditions. Please contact us with your drawings for a quotation.' },
    { q: 'Will prices fluctuate due to raw materials or exchange rates?', a: 'Yes. Our products use significant volumes of copper and steel, so pricing may vary with raw-material prices and exchange-rate movements.' },
  ]},
  { category: 'Production & Delivery', items: [
    { q: 'What is the production lead time after order confirmation?', a: 'Typical production lead time is 15–45 days and varies by product and quantity. The supplied company materials give an example of approximately 50 days for an order of 100 units.' },
    { q: 'Do you support expedited / rush production?', a: 'Yes, expedited production can be arranged. We also provide production progress updates during manufacturing.' },
  ]},
  { category: 'Quality Control & Warranty', items: [
    { q: 'What quality management system do you operate?', a: 'We have established and operate an ISO 9001 Quality Management System covering raw-material inspection, in-process stop-point inspections, factory testing, packaging and on-site commissioning support.' },
    { q: 'Do you support customer or third-party inspection?', a: 'Yes. Customer inspection of goods before shipment is welcome. We can also provide factory inspection reports and test records.' },
    { q: 'What is the warranty period?', a: 'We provide a 2-year free warranty from delivery, together with lifetime after-sales technical support.' },
    { q: 'Are product quality records traceable?', a: 'Yes. Each product carries a serial number and associated quality records for full traceability through our production process.' },
  ]},
  { category: 'Technical Service & After-Sales', items: [
    { q: 'What after-sales response time can I expect?', a: 'We commit to responding to after-sales requests within 1 hour.' },
    { q: 'Do you provide installation or commissioning support?', a: 'Yes. We provide technical support for installation, commissioning and maintenance, including documentation and remote guidance.' },
  ]},
]

export type NewsArticle = {
  slug: string
  title: string
  date: string
  category: string
  excerpt: string
  image: string
  body: string
}

export const newsArticles: NewsArticle[] = [
  { slug: 'about-changhui-electric', title: 'About Chang Hui Electric', date: '2026-01-10', category: 'Company', excerpt: 'Confirmed company facts, locations and listed product scope.', image: photos.factoryExteriorA, body: `Jiangsu Changhui Electric Co., Ltd. was established on December 13, 2019. Its registered office is in Xinba Science & Technology Park, Yangzhong, while the supplied company profile identifies the manufacturing base at No. 28, Yaoqiao Road, Yaoqiao Town, Zhenjiang New Area, Jiangsu, China.

The supplied materials state a total site area of 42,000 square metres and a building area of 25,000 square metres. Registered capital is RMB 30.05 million.

The customer-supplied product list contains 27 models. Final specifications are confirmed from drawings and project requirements.` },
  { slug: 'custom-distribution-manufacturing-process', title: 'From Drawings to Delivery', date: '2026-02-15', category: 'Manufacturing', excerpt: 'How project drawings and requirements guide made-to-order production.', image: photos.productionHallA, body: `Customer materials describe a made-to-order workflow that begins with drawings and project requirements.

Before production, product configuration, quantity and delivery requirements are reviewed. Manufacturing and inspection then follow the approved project information.

For a quotation, customers should provide available drawings, quantities and project requirements. Final technical details are confirmed for the specific order.` },
  { slug: 'quality-management-approach', title: 'Quality Management Approach', date: '2026-03-20', category: 'Quality', excerpt: 'A careful summary of quality information stated in the supplied company materials.', image: photos.hvTechnicianWiring, body: `The company materials state that Jiangsu Changhui Electric has established an ISO 9001 quality management system. Certificate details were not included in the website source materials and are therefore not presented as independently verified here.

The supplied materials describe incoming-material, in-process and factory inspection activities. Order-specific records and documents should be confirmed for the relevant product and project.

The stated free-warranty period is two years. The exact scope and terms should be confirmed in the order documentation.` },
]

export const industries = [
  { name: 'Industrial & Mining', icon: 'factory' },
  { name: 'Oil & Gas / Petrochemical', icon: 'flame' },
  { name: 'Power & Water Utilities', icon: 'zap' },
  { name: 'Infrastructure & Civil', icon: 'building-2' },
  { name: 'Healthcare', icon: 'heart-pulse' },
  { name: 'Residential & Commercial', icon: 'building' },
  { name: 'Research Facilities', icon: 'microscope' },
  { name: 'Warehousing & Logistics', icon: 'warehouse' },
  { name: 'Transportation', icon: 'train' },
]

export const processSteps = [
  { step: '01', title: 'Drawing & Requirement Confirmation', description: 'We review your drawings, single-line diagrams and project requirements before production begins.' },
  { step: '02', title: 'Design & Engineering', description: 'Our engineering team prepares manufacturing drawings and a bill of materials per your specification.' },
  { step: '03', title: 'Production & Manufacturing', description: 'CNC sheet metal processing, assembly, wiring and busbar installation with in-process inspection at defined stop points.' },
  { step: '04', title: 'Factory Testing & Inspection', description: 'Each unit is tested for insulation resistance, continuity, protection relay settings and dielectric strength. Customer inspection welcome.' },
  { step: '05', title: 'Delivery & Technical Support', description: 'Careful packaging, documentation, test records and operation manuals shipped with every order. 2-year warranty included.' },
]
