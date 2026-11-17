import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { cn } from '@/lib/cn';
import { DURATION, EASE_OUT } from '@/lib/motion';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'md' | 'lg';

type BaseProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
};

type ButtonProps = BaseProps &
  (
    | { to: string; href?: never; onClick?: never; type?: never }
    | { href: string; to?: never; onClick?: never; type?: never }
    | { onClick?: () => void; type?: 'button' | 'submit'; to?: never; href?: never }
  );

const base =
  'inline-flex items-center justify-center gap-2 rounded-pill font-medium whitespace-nowrap select-none';

const variants: Record<Variant, string> = {
  primary: 'bg-cta text-cta-fg shadow-tile',
  secondary: 'border border-line-strong bg-surface text-ink',
  ghost: 'text-ink underline decoration-line-strong underline-offset-4',
};

const sizes: Record<Size, string> = {
  md: 'h-11 px-5 text-small',
  lg: 'h-14 px-7 text-body',
};

const hover = { y: -2 };
const tap = { scale: 0.97 };
const spring = { duration: DURATION.fast, ease: EASE_OUT };

const MotionLink = motion.create(Link);

/** Pill button. Renders a router link (`to`), an anchor (`href`) or a button. */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  ...rest
}: ButtonProps) {
  const classes = cn(base, variants[variant], sizes[size], className);
  const motionProps = { whileHover: hover, whileTap: tap, transition: spring };

  if (rest.to !== undefined) {
    return (
      <MotionLink to={rest.to} className={classes} {...motionProps}>
        {children}
      </MotionLink>
    );
  }

  if (rest.href !== undefined) {
    const external = /^https?:/.test(rest.href);
    return (
      <motion.a
        href={rest.href}
        className={classes}
        {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
        {...motionProps}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={rest.type ?? 'button'}
      onClick={rest.onClick}
      className={classes}
      {...motionProps}
    >
      {children}
    </motion.button>
  );
}
