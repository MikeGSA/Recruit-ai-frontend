import type { CandidateStatus } from '@/types';

interface Props {
  score: number;
  status: CandidateStatus;
  size?: 'sm' | 'md';
}

const STATUS_STYLES: Record<CandidateStatus, string> = {
  'Qualified/High':   'bg-green-100 text-green-800 border-green-300',
  'Qualified/Medium': 'bg-blue-100  text-blue-800  border-blue-300',
  'Borderline':       'bg-yellow-100 text-yellow-800 border-yellow-300',
  'Rejected':         'bg-red-100   text-red-800   border-red-300',
};

const STATUS_LABELS: Record<CandidateStatus, string> = {
  'Qualified/High':   'Qualified · High',
  'Qualified/Medium': 'Qualified · Medium',
  'Borderline':       'Borderline',
  'Rejected':         'Rejected',
};

export default function ScoreBadge({ score, status, size = 'md' }: Props) {
  const colorClass = STATUS_STYLES[status] ?? 'bg-gray-100 text-gray-800 border-gray-300';
  const label = STATUS_LABELS[status] ?? status;

  return (
    <span
      className={`
        inline-flex items-center gap-2 border rounded-full font-medium
        ${size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'}
        ${colorClass}
      `}
    >
      <span className={size === 'sm' ? 'font-bold' : 'font-bold text-base'}>{score}</span>
      <span>{label}</span>
    </span>
  );
}
