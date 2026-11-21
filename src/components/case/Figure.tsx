import { useRef } from 'react';
import { Text } from '@/components/case/Text';
import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import type { CaseImage } from '@/content/caseStudies';
import { cn } from '@/lib/cn';
import { imageExists } from '@/lib/images';
import { isTodo, stripTodo } from '@/lib/todo';

type FigureProps = {
  image: CaseImage;
  /** Load eagerly (the hero). */
  priority?: boolean;
  /** Crop to 16:9 (the full image still opens in the lightbox). */
  video?: boolean;
  /** Show the caption under the image. It always shows in the full-size view. */
  showCaption?: boolean;
  className?: string;
};

/**
 * A captioned image. Click (or Enter) opens it full size in a lightbox, so
 * small UI text in screenshots stays readable. Esc or a click outside closes it.
 */
export function Figure({
  image,
  priority = false,
  video = false,
  showCaption = true,
  className,
}: FigureProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const exists = imageExists(image.src);
  const ratio = video ? '16 / 9' : `${image.width} / ${image.height}`;

  return (
    <figure className={cn('flex flex-col gap-3', className)}>
      {exists ? (
        <button
          type="button"
          onClick={() => dialogRef.current?.showModal()}
          className="group/zoom relative block cursor-zoom-in overflow-hidden rounded-tile border border-line bg-on-accent"
        >
          <img
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            className={cn(
              'block h-auto w-full transition-transform duration-500 ease-out-expo group-hover/zoom:scale-[1.015]',
              video && 'aspect-video object-cover',
            )}
          />
          <span className="sr-only">Open full size</span>
        </button>
      ) : (
        <ImagePlaceholder
          label={isTodo(image.alt) ? stripTodo(image.alt) : image.alt}
          path={image.src}
          ratio={ratio}
          className="rounded-tile border border-line"
        />
      )}

      {showCaption ? (
        <Text as="figcaption" className="text-small text-ink-muted">
          {image.caption}
        </Text>
      ) : null}

      {exists && (
        <dialog
          ref={dialogRef}
          aria-label={image.alt}
          // A click on the backdrop lands on the dialog itself: close.
          onClick={(event) => event.target === event.currentTarget && dialogRef.current?.close()}
          className="m-auto max-h-none max-w-none border-0 bg-transparent p-0 text-on-accent backdrop:bg-ink-base/85 backdrop:backdrop-blur-sm"
        >
          <div className="flex flex-col items-center gap-3 p-4">
            <img
              src={image.src}
              alt=""
              width={image.width}
              height={image.height}
              className="h-auto max-h-[82svh] w-auto max-w-[94vw] rounded-tile-sm object-contain"
            />
            <p className="max-w-prose text-center text-small">{image.caption}</p>
            <form method="dialog">
              <button
                type="submit"
                autoFocus
                className="inline-flex h-10 items-center rounded-pill border border-on-accent/40 px-4 text-small font-medium"
              >
                Close
              </button>
            </form>
          </div>
        </dialog>
      )}
    </figure>
  );
}
