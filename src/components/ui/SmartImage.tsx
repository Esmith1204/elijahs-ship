import { ImagePlaceholder } from '@/components/ui/ImagePlaceholder';
import type { ProjectImage } from '@/content/projects';
import { cn } from '@/lib/cn';
import { imageExists } from '@/lib/images';

type SmartImageProps = {
  image: ProjectImage;
  /** Shown on the placeholder while the file is missing, e.g. "Grouper cover". */
  label: string;
  /** For small slots: the placeholder shows only the file name. */
  compact?: boolean;
  /** Load eagerly for images above the fold. */
  priority?: boolean;
  className?: string;
};

/**
 * Renders the image if its file exists in public/images, otherwise a
 * labelled placeholder naming the file to add. No code change needed when
 * the real image arrives.
 */
export function SmartImage({
  image,
  label,
  compact,
  priority = false,
  className,
}: SmartImageProps) {
  if (!imageExists(image.src)) {
    return (
      <ImagePlaceholder label={label} path={image.src} compact={compact} className={className} />
    );
  }

  return (
    <img
      src={image.src}
      alt={image.alt}
      width={image.width}
      height={image.height}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      className={cn('object-cover', className)}
    />
  );
}
