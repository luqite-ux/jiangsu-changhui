import { SectionHeading } from '@/components/section-heading'
import { Reveal } from '@/components/reveal'
import { customerVideos } from '@/lib/site-data'

export function CustomerVideoGallery() {
  return (
    <section className="bg-secondary/60 py-24" aria-labelledby="customer-video-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div id="customer-video-heading">
          <SectionHeading
            eyebrow="Company Videos"
            title="Customer-Supplied Footage"
            description="Five original videos supplied by Jiangsu Changhui Electric, shown with neutral labels because the supplied materials do not verify a specific product model or process for each file."
          />
        </div>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {customerVideos.map((video, index) => (
            <Reveal key={video.src} delay={(index % 3) * 80}>
              <figure className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                <video
                  controls
                  playsInline
                  preload="metadata"
                  className="aspect-video w-full bg-black"
                  aria-label={video.title}
                >
                  <source src={video.src} type="video/mp4" />
                  <track
                    kind="captions"
                    src="/captions/customer-media.vtt"
                    srcLang="en"
                    label="English"
                    default
                  />
                  Your browser does not support HTML video.
                </video>
                <figcaption className="p-4">
                  <p className="font-display text-base font-semibold text-primary">{video.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{video.description}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
