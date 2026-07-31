import { Hero } from '@/components/home/hero'
import { StatsStrip } from '@/components/home/stats-strip'
import { ProductsPreview } from '@/components/home/products-preview'
import { WhyUs } from '@/components/home/why-us'
import { CapabilitiesPreview } from '@/components/home/capabilities-preview'
import { ProcessSection } from '@/components/home/process-section'
import { IndustriesSection } from '@/components/home/industries-section'
import { FactoryGallery } from '@/components/home/factory-gallery'
import { HomeCta } from '@/components/home/cta'

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsStrip />
      <ProductsPreview />
      <WhyUs />
      <CapabilitiesPreview />
      <ProcessSection />
      <IndustriesSection />
      <FactoryGallery />
      <HomeCta />
    </>
  )
}
