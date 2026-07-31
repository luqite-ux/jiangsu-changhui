import Image from 'next/image'
import { SectionHeading } from '@/components/section-heading'
import { Reveal } from '@/components/reveal'
import { photos } from '@/lib/site-data'

const galleryPhotos = [
  {
    src: photos.factoryRoadD,
    alt: 'Chang Hui Electric factory campus — symmetric workshop buildings with blue-trim facades, Yangzhong, Jiangsu',
    caption: 'Factory Campus, Yangzhong, Jiangsu',
    wide: true,
  },
  {
    src: photos.factoryDoorForklift,
    alt: 'Main workshop entrance with large blue sliding doors and forklift inside',
    caption: 'Main Workshop Entrance',
  },
  {
    src: photos.factoryGarden,
    alt: 'Landscaped garden area and walkway between Chang Hui Electric production buildings',
    caption: 'Factory Grounds',
  },
  {
    src: photos.productionHallC,
    alt: 'Production bay showing LV distribution cabinet assemblies and box-substation enclosures being prepared',
    caption: 'LV Cabinet & Box-Substation Assembly',
  },
  {
    src: photos.hvXgnOpenDoor,
    alt: 'XGN-40.5G high-voltage switchgear unit with door open showing wiring, insulators and relay compartments',
    caption: 'HV Switchgear Internal Assembly',
  },
  {
    src: photos.enclosureShells,
    alt: 'Rows of powder-coated white steel cabinet enclosure shells lined up on the factory floor before wiring',
    caption: 'Enclosure Shells Before Wiring',
  },
  {
    src: photos.assemblyWiringA,
    alt: 'Two workers wiring a row of grey LV distribution cabinets in a bright modern workshop bay',
    caption: 'LV Cabinet Wiring — Assembly Floor',
  },
  {
    src: photos.factorySafety,
    alt: 'Safety signage and regulations board at the Chang Hui Electric production facility entrance',
    caption: 'Production Safety Management',
  },
  {
    src: photos.warehouse,
    alt: 'Finished goods warehouse with rows of packaged electrical distribution equipment ready for delivery',
    caption: 'Finished Goods Warehouse',
  },
]

const factoryVideos = [
  {
    src: photos.video1,
    title: 'Factory Overview — Workshop Tour',
    description: 'A walk through the main production hall showing the manufacturing workflow at our Yangzhong facility.',
  },
  {
    src: photos.video2,
    title: 'Switchgear Assembly Process',
    description: 'In-process footage of HV/LV switchgear cabinet assembly, wiring and busbar installation.',
  },
  {
    src: photos.video3,
    title: 'Production Line — Distribution Boxes',
    description: 'Manufacturing line for distribution boxes and enclosures, from sheet metal to finished product.',
  },
  {
    src: photos.video4,
    title: 'Quality Inspection & Testing',
    description: 'Factory acceptance test procedures including dielectric testing and relay verification.',
  },
  {
    src: photos.video5,
    title: 'Facility & Equipment',
    description: 'Overview of major production equipment including CNC press brakes, punches and powder coating lines.',
  },
]

export function FactoryGallery() {
  return (
    <>
      {/* Photo gallery */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Our Factory"
          title="Built for Scale and Quality"
          description="42,000 m² total facility area in Yangzhong, Jiangsu — vertically integrated production from sheet metal fabrication to fully tested switchgear delivery."
        />

        <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-3">
          {galleryPhotos.map((photo, i) => (
            <Reveal
              key={photo.caption}
              delay={(i % 3) * 80}
              className={photo.wide ? 'col-span-2 md:col-span-1 md:row-span-2' : ''}
            >
              <figure className="group relative h-full min-h-[200px] overflow-hidden rounded-xl border border-border bg-secondary">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
                <figcaption className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-sm font-medium text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  {photo.caption}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Video section */}
      <section className="bg-secondary/50 py-24" aria-label="Factory video tours">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Factory in Action"
            title="See Manufacturing From the Inside"
            description="Watch our production team at work — from raw sheet metal to fully tested switchgear cabinets."
          />

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {factoryVideos.map((vid, i) => (
              <Reveal key={vid.title} delay={(i % 3) * 80}>
                <figure className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                  {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                  <video
                    controls
                    preload="metadata"
                    className="aspect-video w-full rounded-t-xl bg-black"
                    aria-label={vid.title}
                  >
                    <source src={vid.src} />
                    Your browser does not support the video tag.
                  </video>
                  <figcaption className="p-4">
                    <p className="font-display text-base font-semibold text-primary">{vid.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{vid.description}</p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
