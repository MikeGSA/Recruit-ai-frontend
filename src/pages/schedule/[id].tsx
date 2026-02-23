import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useRecruitStore } from '@/lib/store';
import { scheduleInterview } from '@/lib/n8n';
import type { TimeSlot } from '@/types';

export default function SchedulePage() {
  const router = useRouter();
  const { id } = router.query as { id: string };
  const { getCandidateById } = useRecruitStore();

  const candidateEmail = id ? decodeURIComponent(id) : '';
  const result = getCandidateById(candidateEmail);

  const [isLoading,    setIsLoading]    = useState(false);
  const [slots,        setSlots]        = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [confirmed,    setConfirmed]    = useState(false);
  const [error,        setError]        = useState<string | null>(null);
  const [step,         setStep]         = useState<'idle' | 'loading' | 'picking' | 'confirmed'>('idle');

  if (!result) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center text-gray-400">
        <p>Candidate not found.</p>
        <Link href="/" className="text-blue-600 hover:underline mt-2 inline-block">
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  const { candidate, job_requirements, job_id } = result;

  const handleFindSlots = async () => {
    setIsLoading(true);
    setError(null);
    setStep('loading');

    try {
      const response = await scheduleInterview({
        candidate_email:          candidate.email,
        candidate_name:           candidate.name,
        job_title:                job_requirements?.job_title ?? '',
        job_id:                   job_id,
        interviewer_calendar_id:  'primary',
      });
      setSlots(response.available_slots ?? []);
      setStep('picking');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to fetch available slots. Check your n8n scheduling webhook URL.'
      );
      setStep('idle');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = () => {
    if (!selectedSlot) return;
    // In production: call an n8n webhook to create the confirmed calendar event
    // and send a confirmation email with the accepted slot
    setConfirmed(true);
    setStep('confirmed');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6">
      {/* Breadcrumb */}
      <Link
        href={`/candidates/${encodeURIComponent(candidateEmail)}`}
        className="text-sm text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 mb-6"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Candidate Profile
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Schedule Interview</h1>
        <p className="text-gray-500 mt-1">
          {candidate.name} · {job_requirements?.job_title ?? 'Role'}
        </p>
      </div>

      {/* Main content */}
      <div className="card p-6">
        {step === 'confirmed' ? (
          /* ── Confirmation screen ─────────────────────────────────────── */
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Interview Scheduled</h2>
            <p className="text-gray-600 font-medium">{selectedSlot?.display}</p>
            <p className="text-gray-400 text-sm mt-2">
              Calendar invite sent to {candidate.email}
            </p>
            <div className="mt-6 flex gap-3 justify-center">
              <Link href={`/candidates/${encodeURIComponent(candidateEmail)}`}
                className="btn-secondary">
                Back to Profile
              </Link>
              <Link href="/" className="btn-primary">
                Dashboard
              </Link>
            </div>
          </div>
        ) : step === 'picking' ? (
          /* ── Slot picker ─────────────────────────────────────────────── */
          <div>
            <h2 className="font-semibold text-gray-900 mb-1">
              Select a 45-minute interview slot
            </h2>
            <p className="text-sm text-gray-400 mb-5">
              All times shown in Eastern Time. Agent 3 found these based on interviewer calendar availability.
            </p>

            <div className="space-y-2 mb-6">
              {slots.map((slot, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedSlot(slot)}
                  className={`
                    w-full text-left px-4 py-3.5 rounded-lg border-2 transition-all
                    ${selectedSlot?.start === slot.start
                      ? 'border-blue-500 bg-blue-50 text-blue-900'
                      : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                      selectedSlot?.start === slot.start
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {selectedSlot?.start === slot.start && (
                        <div className="w-1.5 h-1.5 bg-white rounded-full mx-auto mt-0.5" />
                      )}
                    </div>
                    <span className="font-medium text-sm">{slot.display}</span>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={handleConfirm}
              disabled={!selectedSlot}
              className="w-full btn-primary"
            >
              Confirm &amp; Send Invite
            </button>
          </div>
        ) : (
          /* ── Idle / Find slots button ─────────────────────────────────── */
          <div className="text-center py-6">
            <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="font-semibold text-gray-900 mb-1">Find Available Slots</h2>
            <p className="text-sm text-gray-400 mb-6">
              Agent 3 will check the interviewer's Google Calendar and suggest
              3–5 optimal 45-minute slots in the next 2 weeks.
            </p>

            <button
              onClick={handleFindSlots}
              disabled={isLoading}
              className="btn-primary"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Checking Calendar…
                </span>
              ) : (
                'Find Available Slots'
              )}
            </button>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 text-left">
                {error}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Info footer */}
      <div className="mt-4 text-xs text-gray-400 space-y-1">
        <p>• 45-minute slots, 15-minute buffer between interviews</p>
        <p>• Prefers mid-morning (9am–12pm ET)</p>
        <p>• Weekdays only, next 14 days</p>
      </div>
    </div>
  );
}
