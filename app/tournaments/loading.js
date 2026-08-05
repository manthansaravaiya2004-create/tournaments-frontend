export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="h-8 w-48 bg-ink-800 rounded-md animate-pulse mb-2"></div>
          <div className="h-4 w-64 bg-ink-900 rounded-md animate-pulse"></div>
        </div>
        <div className="h-10 w-32 bg-ink-800 rounded-md animate-pulse hidden sm:block"></div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-[250px] w-full rounded-xl bg-ink-900 animate-pulse border border-ink-800"></div>
        ))}
      </div>
    </div>
  );
}
