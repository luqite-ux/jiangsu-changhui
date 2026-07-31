import Image from 'next/image'
import { SectionHeading } from '@/components/section-heading'
import { Reveal } from '@/components/reveal'
import { customerImageAssets } from '@/lib/site-data'

export function FactoryGallery() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Company Gallery"
        title="Inside Chang Hui Electric"
        description="Original photographs supplied by Jiangsu Changhui Electric. They are presented as a company and manufacturing gallery without assigning an unverified product model to any image."
      />

      <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {customerImageAssets.map((photo, index) => (
          <Reveal
            key={photo.src}
            delay={(index % 4) * 60}
            className={index === 0 ? 'col-span-2 row-span-2' : ''}
          >
            <figure className="group relative h-full min-h-52 overflow-hidden rounded-xl border border-border bg-secondary">
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/65 to-transparent p-4 pt-10 text-sm font-medium text-white">
                {photo.caption}
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
