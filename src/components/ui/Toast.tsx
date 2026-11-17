import { AnimatePresence, motion } from 'motion/react';
import { DURATION, EASE_OUT } from '@/lib/motion';

type ToastProps = {
  /** Text to show. `null` hides the toast. */
  message: string | null;
};

/**
 * A short status message pinned to the bottom of the screen. The live region
 * is always mounted so screen readers announce the text when it appears.
 */
export function Toast({ message }: ToastProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4"
    >
      <AnimatePresence>
        {message && (
          <motion.p
            key={message}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: DURATION.fast, ease: EASE_OUT }}
            className="theme-light rounded-pill border border-line-strong bg-surface px-5 py-3 text-small font-medium text-ink shadow-lift"
          >
            {message}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
