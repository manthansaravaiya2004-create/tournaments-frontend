export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12 animate-pulse">
      <div className="mb-12">
        <div className="h-12 w-64 bg-ink-800 rounded-md mb-4"></div>
        <div className="h-4 w-96 bg-ink-900 rounded-md"></div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="rounded-xl border border-ink-800 bg-ink-900/50 p-6 shadow-sm h-32">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-ink-800 rounded-lg"></div>
              <div className="space-y-2">
                <div className="h-4 w-24 bg-ink-800 rounded"></div>
                <div className="h-6 w-12 bg-ink-800 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-12 flex justify-center">
        <div className="h-12 w-48 bg-ink-800 rounded-md"></div>
      </div>
    </div>
  );
}
