/**
 * store.ts — Zustand global store with localStorage persistence.
 * This is the client-side source of truth for the MVP (no backend DB).
 * Candidates and results persist across page refreshes.
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Role, ScreeningResult } from '@/types';

// ─── Seed Roles ───────────────────────────────────────────────────────────────
// Replace with API/database calls in production

const SEED_ROLES: Role[] = [
  {
    id: 'role-001',
    title: 'Senior Frontend Engineer',
    department: 'Engineering',
    description: `We are looking for a Senior Frontend Engineer with 5+ years of experience building production-grade React applications.

Required:
- 5+ years React/TypeScript experience
- Strong CSS and responsive design skills
- Experience with state management (Redux, Zustand, or similar)
- Familiarity with REST APIs and GraphQL
- Experience with testing frameworks (Jest, Cypress)

Nice to have:
- Next.js experience
- Design system experience
- Performance optimization background

Culture: Fast-paced, collaborative, user-obsessed team. We ship weekly.`,
    status: 'Open',
    created_at: '2026-02-01T00:00:00Z',
    candidate_count: 0,
  },
  {
    id: 'role-002',
    title: 'Product Manager — Core Platform',
    department: 'Product',
    description: `Seeking an experienced Product Manager to lead our core platform roadmap.

Required:
- 4+ years of product management at a SaaS company
- Experience with B2B enterprise products
- Strong data analysis skills (SQL a plus)
- Proven track record shipping features at scale
- Excellent stakeholder communication

Nice to have:
- Technical background or engineering experience
- Experience with AI/ML products
- Background in HR Tech or Recruiting tools

Culture: Outcome-driven, direct communication, no ego.`,
    status: 'Open',
    created_at: '2026-02-10T00:00:00Z',
    candidate_count: 0,
  },
  {
    id: 'role-003',
    title: 'DevOps Engineer',
    department: 'Infrastructure',
    description: `Looking for a DevOps Engineer to own our cloud infrastructure and CI/CD pipelines.

Required:
- 3+ years DevOps/SRE experience
- AWS or GCP expertise (AWS preferred)
- Kubernetes and Docker proficiency
- CI/CD pipeline design (GitHub Actions, CircleCI)
- Infrastructure as Code (Terraform or Pulumi)

Nice to have:
- Security/compliance background
- Experience with observability tools (Datadog, Grafana)
- On-call experience

Culture: Reliability first. We treat incidents as learning opportunities.`,
    status: 'Open',
    created_at: '2026-02-15T00:00:00Z',
    candidate_count: 0,
  },
];

// ─── Store Interface ──────────────────────────────────────────────────────────

interface RecruitStore {
  roles: Role[];
  // Keyed by role_id → array of screening results for that role
  screeningResults: Record<string, ScreeningResult[]>;

  addScreeningResult: (roleId: string, result: ScreeningResult) => void;
  getRoleById: (id: string) => Role | undefined;
  getCandidatesByRoleId: (roleId: string) => ScreeningResult[];
  // candidateId is the candidate's email address (URL-encoded in routes)
  getCandidateById: (candidateEmail: string) => ScreeningResult | undefined;
  getAllCandidates: () => ScreeningResult[];
  getCandidatesByStatus: (status: string) => ScreeningResult[];
  getQualifiedCandidates: () => ScreeningResult[];
  getBorderlineCandidates: () => ScreeningResult[];
  getRejectedCandidates: () => ScreeningResult[];
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useRecruitStore = create<RecruitStore>()(
  persist(
    (set, get) => ({
      roles: SEED_ROLES,
      screeningResults: {},

      addScreeningResult: (roleId, result) =>
        set((state) => ({
          screeningResults: {
            ...state.screeningResults,
            [roleId]: [...(state.screeningResults[roleId] ?? []), result],
          },
          roles: state.roles.map((r) =>
            r.id === roleId
              ? { ...r, candidate_count: (state.screeningResults[roleId]?.length ?? 0) + 1 }
              : r
          ),
        })),

      getRoleById: (id) => get().roles.find((r) => r.id === id),

      getCandidatesByRoleId: (roleId) => get().screeningResults[roleId] ?? [],

      getCandidateById: (candidateEmail) =>
        Object.values(get().screeningResults)
          .flat()
          .find((r) => r.candidate.email === candidateEmail),

      getAllCandidates: () => Object.values(get().screeningResults).flat(),

      getCandidatesByStatus: (status) =>
        Object.values(get().screeningResults)
          .flat()
          .filter((r) => r.status === status),

      getQualifiedCandidates: () =>
        Object.values(get().screeningResults)
          .flat()
          .filter((r) => r.status === 'Qualified/High' || r.status === 'Qualified/Medium'),

      getBorderlineCandidates: () =>
        Object.values(get().screeningResults)
          .flat()
          .filter((r) => r.status === 'Borderline'),

      getRejectedCandidates: () =>
        Object.values(get().screeningResults)
          .flat()
          .filter((r) => r.status === 'Rejected'),
    }),
    {
      name: 'recruit-ai-store',
      // Only persist roles and results — not derived state
      partialize: (state) => ({
        roles: state.roles,
        screeningResults: state.screeningResults,
      }),
    }
  )
);
