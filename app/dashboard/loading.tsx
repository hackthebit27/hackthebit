export default function LoadingDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-indigo-50/40">
      <div className="mx-auto max-w-7xl px-6 py-8 animate-pulse">
        <div className="mb-6 h-8 w-48 rounded bg-gray-200" />
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            <div className="h-28 rounded-2xl bg-gray-200" />
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="h-44 rounded-2xl bg-gray-200" />
              <div className="h-44 rounded-2xl bg-gray-200" />
            </div>
            <div className="h-40 rounded-2xl bg-gray-200" />
          </div>
          <div className="space-y-6">
            <div className="h-48 rounded-2xl bg-gray-200" />
            <div className="h-40 rounded-2xl bg-gray-200" />
          </div>
        </div>
      </div>
    </div>
  );
}