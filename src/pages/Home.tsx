import { About } from '@/components/home/About';
import { ArchiveTeaser } from '@/components/home/ArchiveTeaser';
import { FeaturedWork } from '@/components/home/FeaturedWork';
import { Hero } from '@/components/home/Hero';
import { ToolsStrip } from '@/components/home/ToolsStrip';
import { AfterFirstPaint } from '@/components/motion/AfterFirstPaint';

/**
 * Homepage. All of its text lives in src/content/home.ts. The contact
 * section is the site footer (see Layout), so it follows on every page.
 *
 * The hero renders first; everything below the first screen follows a moment
 * later (AfterFirstPaint), so slow phones show the hero sooner.
 */
export default function Home() {
  return (
    <div className="pb-section">
      <Hero />
      <AfterFirstPaint>
        <ToolsStrip />
        <FeaturedWork />
        <ArchiveTeaser />
        <About />
      </AfterFirstPaint>
    </div>
  );
}
