import { motion } from 'motion/react';
import type { CSSProperties, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { DURATION, EASE_OUT, revealGroup, revealItem, STAGGER } from '@/lib/motion';

/** Start when the element is a little way into the viewport, and only once. */
const viewport = { once: true, margin: '0px 0px -12% 0px' } as const;

type RevealProps = {
  children: ReactNode;
  /** Seconds to wait after entering the viewport. */
  delay?: number;
  className?: string;
};

/** Fade + short rise on first view. */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  return (
    <motion.div
      variants={revealItem}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      transition={{ duration: DURATION.base, ease: EASE_OUT, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

type RevealListProps = {
  children: ReactNode;
  className?: string;
  /** Accessible name when the list needs one. */
  label?: string;
  style?: CSSProperties;
};

/** A <ul> whose <RevealListItem> children rise in one after another. */
export function RevealList({ children, className, label, style }: RevealListProps) {
  return (
    <motion.ul
      variants={revealGroup}
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      aria-label={label}
      className={className}
      style={style}
    >
      {children}
    </motion.ul>
  );
}

export function RevealListItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.li variants={revealItem} className={className}>
      {children}
    </motion.li>
  );
}

type MaskedHeadingProps = {
  /** Plain text: it is split into words. */
  children: string;
  as?: 'h1' | 'h2' | 'h3';
  id?: string;
  /** Seconds before the first word moves. */
  delay?: number;
  /** Animate on mount instead of on first view (for the hero). */
  immediate?: boolean;
  className?: string;
};

/**
 * Heading whose words slide up from behind a mask, once. Screen readers get
 * the plain text; the animated spans are hidden from them.
 */
export function MaskedHeading({
  children,
  as = 'h2',
  id,
  delay = 0,
  immediate = false,
  className,
}: MaskedHeadingProps) {
  const Tag = motion[as];
  const words = children.split(' ');

  return (
    <Tag
      id={id}
      aria-label={children}
      initial="hidden"
      {...(immediate ? { animate: 'visible' } : { whileInView: 'visible', viewport })}
      transition={{ staggerChildren: STAGGER, delayChildren: delay }}
      className={className}
    >
      {words.map((word, index) => (
        // The padding/negative margin pair keeps descenders inside the mask.
        <span
          key={index}
          aria-hidden="true"
          className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-bottom"
        >
          <motion.span
            variants={{
              hidden: { y: '110%' },
              visible: { y: 0, transition: { duration: DURATION.slow, ease: EASE_OUT } },
            }}
            className={cn('inline-block', index < words.length - 1 && 'pr-[0.24em]')}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
