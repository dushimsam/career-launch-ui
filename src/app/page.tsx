import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Test styling */}
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">
          CareerLaunch Platform
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          If you can see this text in blue and gray, Tailwind CSS is working!
        </p>
        
        <div className="space-x-4">
          <Link href="/login">
            <button className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
              Login
            </button>
          </Link>
          <Link href="/register">
            <button className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600">
              Register
            </button>
          </Link>
        </div>
        
        <div className="mt-8 p-4 bg-white rounded shadow">
          <h2 className="text-2xl font-semibold mb-2">Debug Info:</h2>
          <p className="text-gray-600">
            This box should have a white background with a shadow.
          </p>
        </div>
      </div>
    </div>
  );
}
