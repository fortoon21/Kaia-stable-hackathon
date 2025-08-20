export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-8">
      <main className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to Kaia Hackathon
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-md">
          Your Next.js + TypeScript + Tailwind CSS project is ready to go!
        </p>
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Quick Start
          </h2>
          <ul className="text-left text-gray-600 space-y-2">
            <li>
              • Edit{" "}
              <code className="bg-gray-100 px-2 py-1 rounded">
                app/page.tsx
              </code>{" "}
              to start building
            </li>
            <li>
              • Add components in the{" "}
              <code className="bg-gray-100 px-2 py-1 rounded">components/</code>{" "}
              folder
            </li>
            <li>• Use Tailwind CSS for styling</li>
            <li>
              • Run{" "}
              <code className="bg-gray-100 px-2 py-1 rounded">yarn dev</code> to
              start development
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
