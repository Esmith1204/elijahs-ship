/**
 * Project list for the homepage bento, the archive and case study links.
 * Edit copy here. Anything marked TODO is a gap only Elijah can fill:
 * never invent metrics, outcomes or roles.
 */

export type ProjectCategory = 'product' | 'development' | 'branding';

export const categoryLabels: Record<ProjectCategory, string> = {
  product: 'Product',
  development: 'Development',
  branding: 'Branding',
};

export type ProjectImage = {
  /** Path under /public. Shows a placeholder until the file exists. */
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type Project = {
  slug: string;
  title: string;
  /** One line: what it is. */
  summary: string;
  /** One line: what came of it. */
  outcome: string;
  role: string;
  team?: string;
  /** e.g. "Apr 2026 → Now". */
  timeline?: string;
  /** Where the project came from, e.g. a hackathon or course. */
  context?: string;
  categories: ProjectCategory[];
  tags: string[];
  cover: ProjectImage;
  /** Featured projects get a bento tile and a case study at /work/:slug. */
  featured: boolean;
  /** Tile tint. */
  tone?: 'surface' | 'purple' | 'blue';
  /** Live link, if public. Archive cards open it in a new tab. */
  href?: string;
  /** Button text for that link. Defaults to "Visit the live project". */
  hrefLabel?: string;
};

export const projects: Project[] = [
  {
    slug: 'grouper',
    title: 'Grouper',
    summary: 'A group trip planner for itineraries, car assignments and debt tracking.',
    outcome:
      'Won the Figma Design track at LA Hacks 2026. Since then: 30 trips planned and $11,000 settled across 470 shared debts.',
    role: 'Product Designer',
    team: '1 designer + 1 SWE',
    timeline: 'Apr 2026 → Now',
    context: 'LA Hacks 2026',
    categories: ['product'],
    tags: ['Product Design', 'Web App', 'Hackathon Winner'],
    cover: {
      src: '/images/grouper/cover.webp',
      alt: 'Grouper’s trip dashboard on a phone beside the Grouper fish logo',
      width: 1920,
      height: 1280,
    },
    featured: true,
    tone: 'surface',
    href: 'https://grouper.design',
  },
  {
    slug: 'needle',
    title: 'Needle',
    summary:
      'Rate, rank and share albums: log them on a 10-point scale and see what friends are spinning.',
    // DRAFT: no outcome on the resume or old site. Replace with a real result when there is one.
    outcome: 'Designed and built end to end, and live today.',
    role: 'Designer & Developer',
    team: 'Passion project',
    categories: ['product', 'development'],
    tags: ['Product Design', 'Development', 'Web App'],
    cover: {
      src: '/images/needle/cover.webp',
      alt: 'Needle wordmark: a social media platform for music',
      width: 1920,
      height: 1080,
    },
    featured: true,
    tone: 'purple',
    href: 'https://music-virid-theta.vercel.app',
  },
  {
    slug: 'rideshare',
    title: 'Rideshare.',
    summary:
      'An app that helps students living on campus find sustainable, affordable ways to get around.',
    // DRAFT: from the resume. The resume gives no job title for this project.
    outcome:
      'A mobile-first carpooling concept that pairs social ridesharing with safety protocols to cut student transit costs.',
    role: 'Product Designer',
    timeline: 'Jan 2026 → Mar 2026',
    context: 'Advanced Topics in Human-Computer Interaction, UC Irvine',
    categories: ['product'],
    tags: ['Product Design', 'Mobile App', 'HCI Coursework'],
    cover: {
      src: '/images/rideshare/cover.webp',
      alt: 'Rideshare. logo beside two phones showing upcoming group trips and a trip itinerary',
      width: 1440,
      height: 834,
    },
    featured: true,
    tone: 'blue',
    href: 'https://rideshare.framer.website',
    hrefLabel: 'Visit the project site',
  },
  {
    slug: 'kain-na',
    title: 'Kain Na!',
    summary: 'A cooking app made to keep family recipes alive.',
    // TODO(Elijah): the pitch deck is a Canva link I can't read. Add a one-line
    // outcome here; until then the tile shows the summary instead.
    outcome: '',
    role: 'TODO: role',
    categories: ['product'],
    tags: ['Product Design', 'Mobile App'],
    cover: {
      src: '/images/kain-na/cover.webp',
      alt: 'Kain na! logo: a pig wearing a chef’s hat',
      width: 1920,
      height: 1080,
    },
    featured: true,
    tone: 'surface',
    href: 'https://canva.link/dloabw95302eweg',
    hrefLabel: 'View the pitch deck',
  },
  {
    slug: 'prequaly',
    title: 'PreQualy Inc.',
    // From the resume.
    summary:
      'A redesign of PreQualy’s main website and interactive interest forms, built in Framer.',
    outcome: '',
    role: 'Product Design Intern',
    categories: ['development'],
    tags: ['React', 'Development'],
    cover: {
      src: '/images/archive/prequaly.webp',
      alt: 'PreQualy website showing sign-up cards for homebuyers, professionals, agencies and nonprofits',
      width: 2848,
      height: 1290,
    },
    featured: false,
    href: 'https://www.prequaly.ai',
  },
  {
    slug: 'rokkage-31',
    title: 'Rokkage 31',
    summary: 'Branding for Rokkage 31.',
    outcome: '',
    role: 'TODO: role',
    categories: ['branding'],
    tags: ['Branding'],
    cover: {
      src: '/images/archive/rokkage-31.webp',
      alt: 'Rokkage31 Discord bot explaining a block of Python code',
      width: 1564,
      height: 1398,
    },
    featured: false,
    href: 'https://github.com/Esmith1204/Rokkage31',
  },
  {
    slug: 'productivity-dashboard',
    title: 'Productivity Dashboard',
    summary: 'TODO: one-line description.',
    outcome: '',
    role: 'TODO: role',
    categories: ['product'],
    tags: ['Dashboard'],
    cover: {
      src: '/images/archive/productivity-dashboard.webp',
      alt: 'Productivity dashboard with a clock, weather, Pomodoro timer, water tracker and to-do list',
      width: 2880,
      height: 1276,
    },
    featured: false,
    href: 'https://elijahsproductivitydashboard.figma.site',
  },
  {
    slug: 'untitled-tab-app',
    title: 'Untitled Tab App',
    summary: 'TODO: one-line description.',
    outcome: '',
    role: 'TODO: role',
    categories: ['product'],
    tags: ['App'],
    cover: {
      src: '/images/archive/untitled-tab-app.webp',
      alt: 'Untitled Tab App account screen with saved presets',
      width: 1702,
      height: 1266,
    },
    featured: false,
    href: 'https://untitled-tab-app.vercel.app',
  },
];

export const featuredProjects = projects.filter((project) => project.featured);
export const archiveProjects = projects.filter((project) => !project.featured);

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
