import { About } from '@/components/home/About';
import { ArchiveTeaser } from '@/components/home/ArchiveTeaser';
import { FeaturedWork } from '@/components/home/FeaturedWork';
import { Hero } from '@/components/home/Hero';
import { ToolsStrip } from '@/components/home/ToolsStrip';

/**
 * Homepage. All of its text lives in src/content/home.ts. The contact
 * section is the site footer (see Layout), so it follows on every page.
 */
export default function Home() {
  return (
    <div className="pb-section">
      <Hero />
      <ToolsStrip />
      <FeaturedWork />
      <ArchiveTeaser />
      <About />
    </div>
  );
}
