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

const PIPELINE_WEBHOOK   = process.env.NEXT_PUBLIC_N8N_PIPELINE_WEBHOOK;
const SCHEDULING_WEBHOOK = process.env.NEXT_PUBLIC_N8N_SCHEDULING_WEBHOOK;

// ─── Validation ───────────────────────────────────────────────────────────────

export function validateWebhookUrls(): { valid: boolean; error?: string } {
  if (!PIPELINE_WEBHOOK) {
    return { valid: false, error: 'NEXT_PUBLIC_N8N_PIPELINE_WEBHOOK not configured' };
  }
  if (!SCHEDULING_WEBHOOK) {
    return { valid: false, error: 'NEXT_PUBLIC_N8N_SCHEDULING_WEBHOOK not configured' };
  }
  return { valid: true };
}

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
  const validation = validateWebhookUrls();
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  if (!payload.resume_text?.trim()) {
    throw new Error('Resume text is required');
  }
  if (!payload.job_description?.trim()) {
    throw new Error('Job description is required');
  }

  try {
    const res = await fetch(PIPELINE_WEBHOOK!, {
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

    const data = await res.json();
    return data;
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error('Pipeline request failed');
  }
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
  const validation = validateWebhookUrls();
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  if (!payload.candidate_email?.trim()) {
    throw new Error('Candidate email is required');
  }
  if (!payload.candidate_name?.trim()) {
    throw new Error('Candidate name is required');
  }

  try {
    const res = await fetch(SCHEDULING_WEBHOOK!, {
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

    const data = await res.json();
    return data;
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error('Scheduling request failed');
  }
}
