import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <h1 className="text-3xl font-bold text-gray-900">
            FluxChat
          </h1>
          <p className="mt-2 text-gray-600">
            超高速・統合メッセージング
          </p>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 px-4">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Welcome to FluxChat</h2>
          <p className="text-gray-600 mb-6">
            Experience ultra-fast, unified messaging across multiple platforms.
          </p>
          
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold mb-2">🚀 Features</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Real-time messaging with Server-Sent Events</li>
                <li>Unified inbox for all message sources</li>
                <li>NATS JetStream for reliable message delivery</li>
                <li>Message deduplication and idempotency</li>
              </ul>
            </div>
            
            <div className="flex gap-4">
              <Link
                href="/inbox"
                className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Open Inbox →
              </Link>
              
              <a
                href="http://localhost:8080/health"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Check API Health
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}