import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Navbar() {
  const router = useRouter();

  const isActive = (path: string) =>
    router.pathname === path
      ? 'text-blue-600 font-medium'
      : 'text-gray-500 hover:text-gray-900';

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-xs">RA</span>
            </div>
            <span className="font-semibold text-gray-900">Recruit-AI</span>
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-6 text-sm">
            <Link href="/" className={isActive('/')}>
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
