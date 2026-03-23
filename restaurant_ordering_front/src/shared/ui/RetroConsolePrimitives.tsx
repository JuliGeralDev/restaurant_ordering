import { cn } from "@/shared/lib/utils";

interface RetroSpeakerGrilleProps {
  amount: number;
  itemClassName: string;
  className?: string;
}

export const RetroSpeakerGrille = ({
  amount,
  itemClassName,
  className,
}: RetroSpeakerGrilleProps) => (
  <div className={className}>
    {Array.from({ length: amount }).map((_, index) => (
      <div key={index} className={itemClassName} />
    ))}
  </div>
);

interface RetroDecorativeScrewsProps {
  positions: readonly string[];
  className?: string;
}

export const RetroDecorativeScrews = ({
  positions,
  className,
}: RetroDecorativeScrewsProps) => (
  <>
    {positions.map((position) => (
      <div
        key={position}
        className={cn(
          "absolute h-1.5 w-1.5 rounded-full bg-zinc-600 shadow-inner",
          position,
          className
        )}
      />
    ))}
  </>
);
