import { Outlet, Link, useLocation } from 'react-router-dom';

export function AppLayout() {
  const location = useLocation();

  const isActive = (path: string) =>
    location.pathname === path ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-blue-600';

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans flex flex-col">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="text-lg font-bold tracking-tight text-blue-600 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            DevGraph
          </Link>

          <nav className="flex gap-6 text-sm font-medium">
            <Link to="/" className={`transition-colors ${isActive('/')}`}>
              Search
            </Link>
            <Link to="/connections" className={`transition-colors ${isActive('/connections')}`}>
              Find Connection
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 w-full">
        <Outlet />
      </main>
    </div>
  );
}
