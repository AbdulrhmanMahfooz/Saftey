export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-1/3 rounded bg-slate-200" />
        <div className="h-4 w-2/3 rounded bg-slate-200" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-8">
          <div className="h-40 rounded-xl bg-slate-200" />
          <div className="h-40 rounded-xl bg-slate-200" />
          <div className="h-40 rounded-xl bg-slate-200" />
        </div>
      </div>
    </div>
  );
}
