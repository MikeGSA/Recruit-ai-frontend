import Link from 'next/link';
import { useRouter } from 'next/router';
import { useRecruitStore } from '@/lib/store';
import ScoreBadge from '@/components/ScoreBadge';
import type { ScoreBreakdown } from '@/types';

const SCORE_COMPONENTS: { label: string; key: keyof ScoreBreakdown; weight: string }[] = [
  { label: 'Must-Have Skills', key: 'must_haves', weight: '40%' },
  { label: 'Experience Depth', key: 'experience', weight: '25%' },
  { label: 'Adjacent Skills',  key: 'adjacency',  weight: '20%' },
  { label: 'Culture Fit',      key: 'culture',    weight: '15%' },
];

function ScoreBar({ value }: { value: number }) {
  const color =
    value >= 80 ? 'bg-green-500' :
    value >= 60 ? 'bg-blue-500' :
    value >= 40 ? 'bg-yellow-500' :
                  'bg-red-500';

  return (
    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-500 ${color}`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

export default function CandidateProfile() {
  const router = useRouter();
  const { id } = router.query as { id: string };
  const { getCandidateById } = useRecruitStore();

  const candidateEmail = id ? decodeURIComponent(id) : '';
  const result = getCandidateById(candidateEmail);

  if (!result) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center text-gray-400">
        <p>Candidate not found.</p>
        <Link href="/" className="text-blue-600 hover:underline mt-2 inline-block">
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  const {
    candidate, job_requirements, fit_score, status,
    confidence, score_breakdown, strengths, gaps, proceed_to_scheduling,
  } = result;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      {/* Breadcrumb */}
      <Link href="/" className="text-sm text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 mb-6">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Dashboard
      </Link>

      {/* Candidate header */}
      <div className="card p-6 mb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{candidate.name}</h1>
            <p className="text-gray-500 mt-0.5">
              {candidate.current_title}
              {candidate.location ? ` · ${candidate.location}` : ''}
            </p>
            <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-400">
              {candidate.email && <span>{candidate.email}</span>}
              {candidate.phone && <span>{candidate.phone}</span>}
              {candidate.links?.github && (
                <a href={candidate.links.github} target="_blank" rel="noopener noreferrer"
                  className="text-blue-500 hover:underline">GitHub</a>
              )}
              {candidate.links?.linkedin && (
                <a href={candidate.links.linkedin} target="_blank" rel="noopener noreferrer"
                  className="text-blue-500 hover:underline">LinkedIn</a>
              )}
            </div>
          </div>
          <ScoreBadge score={fit_score} status={status} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Score Breakdown */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Score Breakdown</h2>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              confidence === 'High'   ? 'bg-green-100 text-green-700' :
              confidence === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-red-100 text-red-700'
            }`}>
              {confidence} confidence
            </span>
          </div>

          <div className="space-y-4">
            {SCORE_COMPONENTS.map(({ label, key, weight }) => (
              <div key={key}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-600">{label}</span>
                  <span className="text-gray-500 text-xs">{weight} weight · {score_breakdown[key]}/100</span>
                </div>
                <ScoreBar value={score_breakdown[key]} />
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between text-sm">
            <span className="text-gray-500 font-medium">Weighted Total</span>
            <span className="font-bold text-gray-900">{fit_score}/100</span>
          </div>
        </div>

        {/* Skills */}
        <div className="space-y-4">
          {/* Strengths */}
          <div className="card p-5">
            <h2 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Strengths
            </h2>
            <ul className="space-y-1.5">
              {strengths.map((s, i) => (
                <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Gaps */}
          <div className="card p-5">
            <h2 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Gaps
            </h2>
            <ul className="space-y-1.5">
              {gaps.map((g, i) => (
                <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="text-red-400 mt-0.5 flex-shrink-0">✗</span>
                  {g}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Skills */}
      {candidate.skills?.length > 0 && (
        <div className="card p-5 mb-6">
          <h2 className="font-semibold text-gray-900 mb-3">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {candidate.skills.map((skill) => {
              const isRequired = job_requirements?.must_haves?.includes(skill);
              return (
                <span
                  key={skill}
                  className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    isRequired
                      ? 'bg-blue-100 text-blue-800 border border-blue-200'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {skill}
                  {isRequired && <span className="ml-1 text-blue-500">✓</span>}
                </span>
              );
            })}
          </div>
          <p className="text-xs text-gray-400 mt-2">Blue = required by role</p>
        </div>
      )}

      {/* Work History */}
      {candidate.work_history?.length > 0 && (
        <div className="card p-5 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">Work History</h2>
          <div className="space-y-4">
            {candidate.work_history.map((job, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex-shrink-0 w-1 bg-blue-200 rounded-full self-stretch" />
                <div>
                  <div className="font-medium text-gray-900">{job.title}</div>
                  <div className="text-sm text-gray-500">{job.company} · {job.duration}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action */}
      <div className="card p-5 mb-6">
        {proceed_to_scheduling ? (
          <div>
            <p className="text-sm text-gray-600 mb-3">
              This candidate meets the threshold for an interview.
            </p>
            <Link
              href={`/schedule/${encodeURIComponent(candidate.email)}`}
              className="btn-primary inline-flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Schedule Interview
            </Link>
          </div>
        ) : (
          <div className="text-sm text-gray-500">
            <span className="font-medium text-gray-700">Status: {status}</span>
            {status === 'Rejected' && (
              <span className="ml-2 text-gray-400">
                — A personalized rejection email has been sent automatically via Agent 2b.
              </span>
            )}
            {status === 'Borderline' && (
              <span className="ml-2 text-gray-400">
                — This candidate requires manual review before proceeding.
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
