/**
 * n8n.ts — API layer for the unified multi-agent pipeline.
 *
 * One webhook handles the full flow:
 *   Pipeline Webhook → Agent 1 (Parse) → Agent 2 (Score) →
 *     ├─ Qualified  → Agent 3 (Schedule) → email sent → response
 *     ├─ Rejected   → Agent 2b (Rejection email) → response
 *     └─ Borderline → response (manual review)
 *
 * A second webhook handles standalone scheduling (Schedule Interview button
 * used for Borderline candidates that are manually approved).
 */

import type { ScreeningResult, SchedulingResult } from '@/types';

const PIPELINE_WEBHOOK   = process.env.NEXT_PUBLIC_N8N_PIPELINE_WEBHOOK!;
const SCHEDULING_WEBHOOK = process.env.NEXT_PUBLIC_N8N_SCHEDULING_WEBHOOK!;

// ─── Full Multi-Agent Pipeline ────────────────────────────────────────────────

export interface RunPipelinePayload {
  resume_text:              string;
  job_description:          string;
  job_id:                   string;
  interviewer_calendar_id?: string; // defaults to 'primary' inside n8n
}

/**
 * Calls the single unified webhook that runs all agents in sequence.
 * Returns the full ScreeningResult including scheduling data for qualified
 * candidates, or rejection status for rejected ones.
 */
export async function runPipeline(payload: RunPipelinePayload): Promise<ScreeningResult> {
  const res = await fetch(PIPELINE_WEBHOOK, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...payload,
      interviewer_calendar_id: payload.interviewer_calendar_id ?? 'primary',
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Pipeline failed (${res.status}): ${text}`);
  }

  return res.json();
}

// ─── Standalone Scheduling ────────────────────────────────────────────────────

export interface ScheduleInterviewPayload {
  candidate_email:          string;
  candidate_name:           string;
  job_title:                string;
  job_id:                   string;
  interviewer_calendar_id?: string;
}

/**
 * Standalone scheduling webhook (Agent 3 only).
 * Used for the "Schedule Interview" button when a Borderline candidate
 * has been manually approved after review.
 */
export async function scheduleInterview(
  payload: ScheduleInterviewPayload
): Promise<SchedulingResult> {
  const res = await fetch(SCHEDULING_WEBHOOK, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...payload,
      interviewer_calendar_id: payload.interviewer_calendar_id ?? 'primary',
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Scheduling failed (${res.status}): ${text}`);
  }

  return res.json();
}
