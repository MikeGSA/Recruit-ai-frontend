import Link from 'next/link';
import { useRecruitStore } from '@/lib/store';
import ScoreBadge from '@/components/ScoreBadge';

export default function Dashboard() {
  const {
    roles,
    getAllCandidates,
    getQualifiedCandidates,
    getBorderlineCandidates,
    getRejectedCandidates,
  } = useRecruitStore();

  const allCandidates = getAllCandidates();
  const qualified = getQualifiedCandidates();
  const rejected = getRejectedCandidates();
  const borderline = getBorderlineCandidates();

  const openRoles = roles.filter((r) => r.status === 'Open');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Recruitment Dashboard</h1>
        <p className="text-gray-500 mt-1">AI-powered screening pipeline overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Total Screened', value: allCandidates.length, color: 'text-gray-900' },
          { label: 'Advancing',      value: qualified.length,    color: 'text-green-600' },
          { label: 'Borderline',     value: borderline.length,   color: 'text-yellow-600' },
          { label: 'Rejected',       value: rejected.length,     color: 'text-red-600' },
        ].map((stat) => (
          <div key={stat.label} className="card p-5">
            <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Open Roles */}
      <div className="mb-10">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Open Roles ({openRoles.length})</h2>
        <div className="grid gap-3">
          {openRoles.map((role) => (
            <Link key={role.id} href={`/roles/${role.id}`}>
              <div className="card p-5 hover:shadow-md transition-shadow cursor-pointer group">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {role.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-0.5">{role.department}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-400">
                      {role.candidate_count} candidate{role.candidate_count !== 1 ? 's' : ''}
                    </span>
                    <svg className="w-4 h-4 text-gray-300 group-hover:text-blue-400 transition-colors"
                      fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Candidates */}
      {allCandidates.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Candidates ({allCandidates.length})
          </h2>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Candidate
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[...allCandidates].reverse().slice(0, 10).map((result, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{result.candidate.name}</div>
                      <div className="text-gray-400 text-xs">{result.candidate.email}</div>
                    </td>
                    <td className="px-4 py-3">
                      <ScoreBadge score={result.fit_score} status={result.status} size="sm" />
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell text-gray-500">
                      {result.job_requirements?.job_title ?? '—'}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/candidates/${encodeURIComponent(result.candidate.email)}`}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {allCandidates.length === 0 && (
        <div className="card p-12 text-center text-gray-400">
          <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="font-medium">No candidates screened yet</p>
          <p className="text-sm mt-1">Open a role and upload a resume to get started</p>
        </div>
      )}
    </div>
  );
}
