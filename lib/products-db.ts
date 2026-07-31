import {
  productCategories as staticCategories,
  products as staticProducts,
  type Product,
  type ProductCategory,
} from '@/lib/site-data'
import { getSupabaseClient, getTenantId } from '@/lib/supabase'

type ProductRow = {
  slug: string | null
  name: string | null
  name_en: string | null
  description: string | null
  description_en: string | null
  overview: string | null
  overview_en: string | null
  image_url: string | null
  category: string | null
  category_slug: string | null
  applications: unknown
  extra_data: unknown
  sort_order: number | null
  updated_at: string | null
}

type CategoryRow = {
  slug: string
  name: string
  name_en: string | null
  description: string | null
  description_en: string | null
  extra_data: unknown
  sort_order: number | null
  updated_at: string | null
}

const productSelection =
  'slug,name,name_en,description,description_en,overview,overview_en,image_url,category,category_slug,applications,extra_data,sort_order,updated_at'

function objectValue(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string' && item.length > 0)
    : []
}

function stringValue(value: unknown): string {
  return typeof value === 'string' ? value : ''
}

export function mapProductRow(row: ProductRow): Product {
  const extra = objectValue(row.extra_data)
  const image = row.image_url || stringValue(extra.image) || '/products/hv-switchgear.png'
  const images = stringArray(extra.images)

  return {
    slug: row.slug || '',
    name: row.name_en || row.name || 'Untitled product',
    category: row.category_slug || '',
    categoryName: row.category || '',
    image,
    images: images.length > 0 ? images : [image],
    imageAlt:
      stringValue(extra.imageAlt) ||
      'Manufacturing reference — customer-supplied photo, not model-specific.',
    imageContext:
      stringValue(extra.imageContext) ||
      'Manufacturing reference — customer-supplied photo, not model-specific.',
    description: row.description_en || row.description || '',
    customNote:
      stringValue(extra.customNote) ||
      row.overview_en ||
      row.overview ||
      'Please provide drawings, quantities and project requirements for engineering review and quotation.',
    applications: stringArray(row.applications),
    relatedSlugs: stringArray(extra.relatedSlugs),
    updatedAt: row.updated_at || undefined,
  }
}

function mapCategoryRow(row: CategoryRow, products: Product[]): ProductCategory {
  const extra = objectValue(row.extra_data)
  const categoryProducts = products.filter((product) => product.category === row.slug)

  return {
    slug: row.slug,
    name: row.name_en || row.name,
    image: stringValue(extra.image_url) || categoryProducts[0]?.image || '/products/hv-switchgear.png',
    imageAlt:
      stringValue(extra.imageAlt) ||
      'Manufacturing reference — customer-supplied photo, not model-specific.',
    imageContext:
      stringValue(extra.imageContext) ||
      'Manufacturing reference — customer-supplied photo, not model-specific.',
    short: row.description_en || row.description || '',
    productSlugs: categoryProducts.map((product) => product.slug),
    products: categoryProducts,
    updatedAt: row.updated_at || undefined,
  }
}

function fallback(reason: string, error?: unknown) {
  console.error(`[products-db] ${reason}; using static product fallback.`, error ?? '')
  return {
    products: staticProducts,
    categories: staticCategories,
    source: 'fallback' as const,
  }
}

export async function fetchProductsData(): Promise<{
  products: Product[]
  categories: ProductCategory[]
  source: 'supabase' | 'fallback'
}> {
  const client = getSupabaseClient()
  const tenantId = getTenantId()
  if (!client || !tenantId) return fallback('public Supabase configuration is incomplete')

  const [productResult, categoryResult] = await Promise.all([
    client
      .from('products')
      .select(productSelection)
      .eq('tenant_id', tenantId)
      .eq('is_active', true)
      .order('sort_order', { ascending: true }),
    client
      .from('product_categories')
      .select('slug,name,name_en,description,description_en,extra_data,sort_order,updated_at')
      .eq('tenant_id', tenantId)
      .eq('is_active', true)
      .order('sort_order', { ascending: true }),
  ])

  if (productResult.error || categoryResult.error || !productResult.data || !categoryResult.data) {
    return fallback('Supabase query failed', productResult.error || categoryResult.error)
  }

  const products = (productResult.data as ProductRow[]).map(mapProductRow)
  const categories = (categoryResult.data as CategoryRow[]).map((row) => mapCategoryRow(row, products))
  return { products, categories, source: 'supabase' }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const client = getSupabaseClient()
  const tenantId = getTenantId()
  const staticProduct = staticProducts.find((product) => product.slug === slug) ?? null

  if (!client || !tenantId) {
    console.error('[products-db] public Supabase configuration is incomplete; using static product fallback.')
    return staticProduct
  }

  const { data, error } = await client
    .from('products')
    .select(productSelection)
    .eq('tenant_id', tenantId)
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle()

  if (error) {
    console.error('[products-db] product query failed; using static product fallback.', error.message)
    return staticProduct
  }

  return data ? mapProductRow(data as ProductRow) : null
}

export async function getProductsByCategorySlug(categorySlug: string): Promise<Product[]> {
  const { products } = await fetchProductsData()
  return products.filter((product) => product.category === categorySlug)
}
