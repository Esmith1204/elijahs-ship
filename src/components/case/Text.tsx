import { cn } from '@/lib/cn';
import { isTodo, stripTodo } from '@/lib/todo';

type TextProps = {
  children: string;
  as?: 'p' | 'span' | 'li' | 'dd' | 'h3' | 'figcaption';
  className?: string;
};

/**
 * Case study text. Anything starting with "TODO" renders as a dashed,
 * labelled placeholder so unfinished content is obvious at a glance.
 */
export function Text({ children, as: Tag = 'p', className }: TextProps) {
  if (!isTodo(children)) return <Tag className={className}>{children}</Tag>;

  return (
    <Tag
      className={cn(
        'rounded-tag bg-highlight/10 px-2 py-1 outline-1 -outline-offset-1 outline-highlight/60 outline-dashed',
        className,
      )}
    >
      <span className="mr-2 inline-block rounded-tag bg-highlight px-1.5 align-middle text-micro font-semibold text-bg">
        TODO
      </span>
      {stripTodo(children)}
    </Tag>
  );
}
