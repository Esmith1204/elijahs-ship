import { useEffect, useState } from 'react';
import { MaskedHeading, Reveal } from '@/components/motion/Reveal';
import { Button } from '@/components/ui/Button';
import { Sparkle, TickRule } from '@/components/ui/Motifs';
import { SocialIcon } from '@/components/ui/SocialIcon';
import type { SocialIconName } from '@/components/ui/SocialIcon';
import { Toast } from '@/components/ui/Toast';
import { home } from '@/content/home';
import { site } from '@/content/site';

const TOAST_MS = 2600;

const links: { label: string; href: string; icon?: SocialIconName }[] = [
  { label: 'LinkedIn', href: site.links.linkedin, icon: 'linkedin' },
  { label: 'GitHub', href: site.links.github, icon: 'github' },
  { label: 'Instagram', href: site.links.instagram, icon: 'instagram' },
  { label: 'Resume', href: site.links.resume },
];

/** Underline wipes in on hover, the same move as the nav. */
const linkClass =
  'relative inline-flex h-11 items-center gap-2 text-body font-medium ' +
  'after:absolute after:inset-x-0 after:bottom-2 after:h-0.5 after:rounded-pill after:bg-current ' +
  'after:origin-right after:scale-x-0 after:transition-transform after:duration-300 after:ease-out-expo ' +
  'hover:after:origin-left hover:after:scale-x-100 focus-visible:after:origin-left focus-visible:after:scale-x-100';

/** Site footer and contact section: the last thing on every page. */
export function ContactFooter() {
  const { contact } = home;
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), TOAST_MS);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setToast(contact.copiedMessage);
    } catch {
      // Clipboard blocked: show the address so it can be copied by hand.
      setToast(contact.copyFailedMessage + site.email);
    }
  };

  return (
    <footer id="contact" className="border-t border-line">
      <div className="mx-auto flex max-w-content flex-col gap-10 px-gutter pt-section pb-10">
        <div className="flex flex-col items-start gap-6">
          <MaskedHeading className="text-display font-semibold">{contact.headline}</MaskedHeading>
          <Reveal>
            <p className="max-w-prose text-lead text-ink-muted">{contact.blurb}</p>
          </Reveal>
        </div>

        <Reveal className="flex flex-col items-start gap-4">
          <p className="font-display text-h3 font-medium break-all">{site.email}</p>
          <div className="flex flex-wrap gap-3">
            <Button size="lg" onClick={copyEmail}>
              {contact.copyLabel}
            </Button>
            <Button size="lg" variant="secondary" href={`mailto:${site.email}`}>
              {home.hero.secondaryCta}
            </Button>
          </div>
        </Reveal>

        <nav aria-label="Elsewhere">
          <ul className="flex flex-wrap gap-x-8 gap-y-1">
            {links.map((link) => (
              <li key={link.label}>
                <a href={link.href} target="_blank" rel="noreferrer" className={linkClass}>
                  {link.icon ? (
                    <SocialIcon name={link.icon} />
                  ) : (
                    <span aria-hidden="true" className="text-lead leading-none">
                      ↗
                    </span>
                  )}
                  {link.label}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col gap-4 pt-8">
          <TickRule />
          <div className="flex items-center justify-between gap-4 text-micro text-ink-muted uppercase">
            <p>
              © {new Date().getFullYear()} {site.name}
            </p>
            <p className="hidden sm:block">{contact.footnote}</p>
            <Sparkle className="size-4 text-ink" />
          </div>
        </div>
      </div>

      <Toast message={toast} />
    </footer>
  );
}
