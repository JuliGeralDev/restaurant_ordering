const D_PAD_PARTS = [
  "absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 rounded-md border-2 border-zinc-800 bg-zinc-700 shadow-lg",
  "absolute bottom-0 left-1/2 h-4 w-4 -translate-x-1/2 rounded-md border-2 border-zinc-800 bg-zinc-700 shadow-lg",
  "absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 rounded-md border-2 border-zinc-800 bg-zinc-700 shadow-lg",
  "absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 rounded-md border-2 border-zinc-800 bg-zinc-700 shadow-lg",
] as const;

export const RetroDPad = () => (
  <div className="relative h-12 w-12">
    {D_PAD_PARTS.map((className) => (
      <div key={className} className={className} />
    ))}
    <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-md bg-zinc-800 shadow-inner" />
  </div>
);
