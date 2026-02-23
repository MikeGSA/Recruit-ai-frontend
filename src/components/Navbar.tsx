import Link from 'next/link';
import { useRouter } from 'next/router';
import { useRecruitStore } from '@/lib/store';

export default function Navbar() {
  const router = useRouter();
  const { roles } = useRecruitStore();

  const isActive = (path: string) =>
    router.pathname === path
      ? 'text-blue-600 font-medium'
      : 'text-gray-500 hover:text-gray-900';

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 bg-blue-600 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-xs">RA</span>
            </div>
            <span className="font-semibold text-gray-900 hidden sm:inline">Recruit-AI</span>
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-6 text-sm">
            <Link href="/" className={isActive('/')}>
              Dashboard
            </Link>

            {/* Roles dropdown link */}
            {roles.length > 0 && (
              <div className="relative group">
                <button className="text-gray-500 hover:text-gray-900 flex items-center gap-1">
                  Roles
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </button>
                <div className="hidden group-hover:block absolute left-0 mt-0 w-48 bg-white rounded-lg shadow-lg border border-gray-200">
                  {roles.map((role) => (
                    <Link
                      key={role.id}
                      href={`/roles/${role.id}`}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg border-b last:border-b-0 border-gray-100"
                    >
                      <div className="font-medium">{role.title}</div>
                      <div className="text-xs text-gray-400">{role.department}</div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
