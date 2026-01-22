export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Missouri Float Planner</h1>
        <p className="text-lg text-gray-600 mb-8">
          Plan your float trip on Missouri rivers
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-md">
          <h2 className="text-xl font-semibold text-blue-800 mb-2">
            Project Setup Complete
          </h2>
          <p className="text-blue-700 text-sm">
            Foundation is ready. Configure your environment variables and run
            Supabase migrations to get started.
          </p>
        </div>
      </div>
    </main>
  );
}
