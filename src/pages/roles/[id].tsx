import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useRecruitStore } from '@/lib/store';
import { runPipeline } from '@/lib/n8n';
import ResumeUploader from '@/components/ResumeUploader';
import ScoreBadge from '@/components/ScoreBadge';
import type { ScreeningResult } from '@/types';

export default function RoleDetail() {
  const router = useRouter();
  const { id } = router.query as { id: string };

  const { getRoleById, screeningResults, addScreeningResult } = useRecruitStore();
  const role       = getRoleById(id);
  const candidates = screeningResults[id] ?? [];

  const [resumeText,  setResumeText]  = useState('');
  const [isLoading,   setIsLoading]   = useState(false);
  const [error,       setError]       = useState<string | null>(null);
  const [lastResult,  setLastResult]  = useState<ScreeningResult | null>(null);
  const [currentStep, setCurrentStep] = useState<string | null>(null);

  if (!role) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center text-gray-400">
        <p>Role not found.</p>
        <Link href="/" className="text-blue-600 hover:underline mt-2 inline-block">
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  const handleScreen = async () => {
    if (!resumeText.trim()) {
      setError('Please upload a resume first.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setLastResult(null);

    try {
      setCurrentStep('Running AI pipeline (Agent 1 → 2 → scheduling)…');
      const result = await runPipeline({
        resume_text:     resumeText,
        job_description: role.description,
        job_id:          role.id,
      });
      addScreeningResult(role.id, result);
      setLastResult(result);
      setResumeText('');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Screening failed. Check your n8n webhook URLs in .env.local'
      );
    } finally {
      setIsLoading(false);
      setCurrentStep(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6">
      {/* Breadcrumb */}
      <Link href="/" className="text-sm text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 mb-6">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Dashboard
      </Link>

      {/* Role header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{role.title}</h1>
        <p className="text-gray-500 mt-0.5">{role.department}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Upload panel */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h2 className="font-semibold text-gray-900 mb-4">Screen a Candidate</h2>

            <ResumeUploader onTextExtracted={setResumeText} isLoading={isLoading} />

            {error && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {error}
              </div>
            )}

            {currentStep && (
              <p className="mt-3 text-sm text-blue-600 animate-pulse">{currentStep}</p>
            )}

            <button
              onClick={handleScreen}
              disabled={isLoading || !resumeText}
              className="mt-4 w-full btn-primary"
            >
              {isLoading ? 'Running AI Pipeline…' : 'Screen Candidate'}
            </button>

            {lastResult && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm font-medium text-green-800">
                  Screened: {lastResult.candidate.name}
                </p>
                <div className="mt-1">
                  <ScoreBadge score={lastResult.fit_score} status={lastResult.status} size="sm" />
                </div>
                <Link
                  href={`/candidates/${encodeURIComponent(lastResult.candidate.email)}`}
                  className="text-xs text-blue-600 hover:underline mt-2 inline-block"
                >
                  View full profile →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right: Candidate table */}
        <div className="lg:col-span-2">
          <h2 className="font-semibold text-gray-900 mb-4">
            Candidates ({candidates.length})
          </h2>

          {candidates.length === 0 ? (
            <div className="card p-10 text-center text-gray-400">
              <p>No candidates screened for this role yet.</p>
              <p className="text-sm mt-1">Upload a resume to get started.</p>
            </div>
          ) : (
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
                      Confidence
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[...candidates].reverse().map((result, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{result.candidate.name}</div>
                        <div className="text-gray-400 text-xs">{result.candidate.current_title}</div>
                      </td>
                      <td className="px-4 py-3">
                        <ScoreBadge score={result.fit_score} status={result.status} size="sm" />
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className={`text-xs font-medium ${
                          result.confidence === 'High'   ? 'text-green-600' :
                          result.confidence === 'Medium' ? 'text-yellow-600' :
                                                           'text-red-600'
                        }`}>
                          {result.confidence}
                        </span>
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
          )}

          {/* Role description */}
          <div className="card p-5 mt-6">
            <h3 className="font-semibold text-gray-800 mb-3">Job Description</h3>
            <pre className="text-sm text-gray-600 whitespace-pre-wrap font-sans leading-relaxed">
              {role.description}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
