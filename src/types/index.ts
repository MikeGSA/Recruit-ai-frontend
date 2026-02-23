// ─── Candidate Data (Agent 1 output) ─────────────────────────────────────────

export interface Education {
  degree: string;
  institution: string;
  graduation_year: number;
}

export interface WorkHistory {
  company: string;
  title: string;
  duration: string;
}

export interface Candidate {
  name: string;
  email: string;
  phone: string;
  location: string;
  current_title: string;
  years_experience: number;
  skills: string[];
  years_experience_per_skill: Record<string, number>;
  education: Education;
  certifications: string[];
  work_history: WorkHistory[];
  languages: string[];
  links: {
    github?: string;
    linkedin?: string;
    portfolio?: string;
  };
  visa_status: string;
  soft_skills: string[];
}

export interface JobRequirements {
  must_haves: string[];
  nice_to_haves: string[];
  experience_years_required: number;
  culture_keywords: string[];
  job_title: string;
  department: string;
  salary_range: { min: number; max: number };
}

// ─── Scoring Data (Agent 2 output) ───────────────────────────────────────────

export type CandidateStatus = 'Qualified/High' | 'Qualified/Medium' | 'Borderline' | 'Rejected';
export type Confidence = 'High' | 'Medium' | 'Low';

export interface ScoreBreakdown {
  must_haves: number;
  experience: number;
  adjacency: number;
  culture: number;
}

export interface ScreeningResult {
  // From Agent 1
  candidate: Candidate;
  job_requirements: JobRequirements;
  job_id: string;
  // From Agent 2
  fit_score: number;
  status: CandidateStatus;
  confidence: Confidence;
  score_breakdown: ScoreBreakdown;
  strengths: string[];
  gaps: string[];
  proceed_to_scheduling: boolean;
}

// ─── Roles (local state) ──────────────────────────────────────────────────────

export type RoleStatus = 'Open' | 'Closed' | 'Paused';

export interface Role {
  id: string;
  title: string;
  department: string;
  description: string;
  status: RoleStatus;
  created_at: string;
  candidate_count: number;
}

// ─── Scheduling (Agent 3) ─────────────────────────────────────────────────────

export interface TimeSlot {
  start: string;   // ISO 8601
  end: string;     // ISO 8601
  display: string; // Human-readable, e.g. "Tuesday, March 4 at 10:00 AM ET"
}

export interface SchedulingResult {
  available_slots: TimeSlot[];
  candidate_name: string;
  candidate_email: string;
  job_title: string;
  job_id: string;
}
