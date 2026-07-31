import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import test from 'node:test'
import sharp from 'sharp'
import ts from 'typescript'

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const readProjectFile = (relativePath) =>
  readFile(resolve(repositoryRoot, relativePath), 'utf8')

async function loadSiteData() {
  const source = await readProjectFile('lib/site-data.ts')
  const javascript = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  }).outputText

  return import(`data:text/javascript;base64,${Buffer.from(javascript).toString('base64')}`)
}

test('stats begin after the Hero marquee with deliberate responsive whitespace', async () => {
  const statsStrip = await readProjectFile('components/home/stats-strip.tsx')

  assert.doesNotMatch(statsStrip, /(?:^|\s)-mt-(?:\[.*?\]|\d+)/m)
  assert.match(statsStrip, /\bmt-8\b/)
  assert.match(statsStrip, /\bsm:mt-10\b/)
  assert.match(statsStrip, /\blg:mt-12\b/)
})

test('Hero uses the selected landscape customer video as an inert decorative background', async () => {
  const hero = await readProjectFile('components/home/hero.tsx')
  const { heroBackgroundVideo, photos } = await loadSiteData()

  assert.ok(heroBackgroundVideo, 'lib/site-data.ts must identify the selected Hero background video')
  assert.equal(
    heroBackgroundVideo.src,
    'https://pub-c7a22068052144a5805830c30d280128.r2.dev/v0-design-assets/jiangsu-changhui/fe632746fdfc968d086c2afb3dfe63b2.mp4',
  )
  assert.match(hero, /import \{[^}]*heroBackgroundVideo[^}]*photos[^}]*\} from '@\/lib\/site-data'/)
  assert.match(hero, /<video[\s\S]*?autoPlay[\s\S]*?muted[\s\S]*?loop[\s\S]*?playsInline/)
  assert.match(hero, /preload="metadata"/)
  assert.match(hero, /poster=\{photos\.productionHallA\}/)
  assert.match(hero, /className="hero-background-video pointer-events-none absolute inset-0 h-full w-full object-cover object-center"/)
  assert.match(hero, /<source\s+src=\{heroBackgroundVideo\.src\}\s+type="video\/mp4"/)
  assert.match(hero, /aria-hidden="true"/)
  assert.match(hero, /tabIndex=\{-1\}/)
  assert.doesNotMatch(hero, /<video[\s\S]*?\scontrols(?:\s|>)/)
  assert.match(hero, /<Image[\s\S]*?src=\{photos\.productionHallA\}/)
  assert.match(hero, /loading="eager"/)
  assert.match(hero, /pointer-events-none absolute inset-0 bg-gradient-to-r/)
})

test('reduced-motion visitors retain the poster while the Hero video is hidden', async () => {
  const globalCss = await readProjectFile('app/globals.css')

  assert.match(
    globalCss,
    /@media \(prefers-reduced-motion: reduce\) \{[\s\S]*?\.hero-background-video\s*\{\s*display:\s*none\s*!important;\s*\}/,
  )
})

test('the full five-video gallery is exclusive to the capabilities page', async () => {
  const factoryGallery = await readProjectFile('components/home/factory-gallery.tsx')
  const capabilitiesPage = await readProjectFile('app/capabilities/page.tsx')

  assert.doesNotMatch(factoryGallery, /CustomerVideoGallery/)
  assert.match(capabilitiesPage, /import \{ CustomerVideoGallery \}/)
  assert.equal((capabilitiesPage.match(/<CustomerVideoGallery\s*\/>/g) ?? []).length, 1)
})

test('header displays a tightly cropped supplied logo at the approved responsive heights', async () => {
  const header = await readProjectFile('components/site-header.tsx')
  const logo = await sharp(resolve(repositoryRoot, 'public/logo-header.png'))
    .metadata()
    .catch(() => null)

  assert.ok(logo, 'public/logo-header.png must be generated from the supplied logo')
  assert.deepEqual({ width: logo.width, height: logo.height }, { width: 340, height: 306 })
  assert.match(header, /src="\/logo-header\.png"/)
  assert.match(header, /className="h-\[52px\] w-auto object-contain lg:h-16"/)
  assert.match(header, /min-h-\[72px\][^"']*lg:min-h-\[88px\]/)
  assert.match(header, /min-h-12[^"']*px-4[^"']*py-3/)
})
