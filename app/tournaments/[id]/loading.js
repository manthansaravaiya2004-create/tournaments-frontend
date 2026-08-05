export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12 animate-pulse">
      <div className="h-4 w-24 bg-ink-800 rounded-md mb-2"></div>
      <div className="h-10 w-64 bg-ink-800 rounded-md mb-4"></div>
      <div className="h-4 w-96 bg-ink-900 rounded-md mb-8"></div>
      
      <div className="flex flex-wrap gap-3 mb-10">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-8 w-32 bg-ink-900 rounded-full border border-ink-800"></div>
        ))}
      </div>
      
      <div className="h-64 w-full bg-ink-900 rounded-xl border border-ink-800 mb-8"></div>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="h-48 bg-ink-900 rounded-xl border border-ink-800"></div>
        <div className="h-48 bg-ink-900 rounded-xl border border-ink-800"></div>
      </div>
    </div>
  );
}
