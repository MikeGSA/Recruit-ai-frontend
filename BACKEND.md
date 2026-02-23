# Recruit-AI Backend (n8n Workflow)

## 🔗 Backend Workflow URL
**https://iitprecruitaiproject.app.n8n.cloud/workflow/aGjvgYERjR0zUbD9**

## 📊 Workflow Overview

The n8n workflow orchestrates a multi-agent AI pipeline that processes candidate resumes through multiple screening agents:

```
Resume Upload (Frontend)
    ↓
[Screening Pipeline Webhook]
    ↓
Agent 1: Resume Parser
    ├─ Extracts candidate information
    ├─ Parses skills, experience, education
    └─ Creates structured candidate profile
    ↓
Agent 2: Candidate Scorer
    ├─ Compares against job requirements
    ├─ Calculates fit score (0-100)
    ├─ Evaluates must-haves, experience, adjacency, culture fit
    └─ Determines status: Qualified/Borderline/Rejected
    ↓
Status Decision:
    ├─ Qualified (score ≥ threshold)
    │   └─ Agent 3: Schedule Interview
    │       ├─ Query Google Calendar
    │       ├─ Suggest available time slots
    │       └─ Send interview invitation email
    │
    ├─ Borderline (manual review needed)
    │   └─ Store for HR review
    │
    └─ Rejected (score < threshold)
        └─ Agent 2b: Send Rejection Email
            └─ Personalized rejection message
```

## 🔌 Webhooks

### 1. Screening Pipeline Webhook
**Path**: `/webhook/screening-pipeline`

**Trigger**: Frontend uploads resume

**Input Payload**:
```json
{
  "resume_text": "John Doe\nSoftware Engineer...",
  "job_description": "We are looking for a Senior Frontend Engineer...",
  "job_id": "role-001",
  "interviewer_calendar_id": "primary" (optional)
}
```

**Process**:
1. Agent 1 parses resume into structured data
2. Agent 2 scores candidate
3. Decision routing based on score

**Output Response**:
```json
{
  "candidate": {
    "name": "John Doe",
    "email": "john@example.com",
    "skills": ["React", "TypeScript", "Node.js"],
    "years_experience": 5,
    "education": {...},
    "work_history": [...],
    ...
  },
  "job_requirements": {...},
  "fit_score": 85,
  "status": "Qualified/High",
  "confidence": "High",
  "score_breakdown": {
    "must_haves": 90,
    "experience": 80,
    "adjacency": 75,
    "culture": 85
  },
  "strengths": ["Expert React developer", "Strong TypeScript skills"],
  "gaps": ["Limited DevOps experience"],
  "proceed_to_scheduling": true,
  "scheduled_time": "2026-02-25T10:00:00Z" (if scheduled)
}
```

### 2. Scheduling Webhook
**Path**: `/webhook/schedule-interview`

**Trigger**: Frontend "Schedule Interview" button (for Borderline candidates approved by HR)

**Input Payload**:
```json
{
  "candidate_email": "john@example.com",
  "candidate_name": "John Doe",
  "job_title": "Senior Frontend Engineer",
  "job_id": "role-001",
  "interviewer_calendar_id": "primary" (optional)
}
```

**Process**:
1. Query Google Calendar for availability
2. Generate list of available time slots
3. Send interview invitation email to candidate

**Output Response**:
```json
{
  "available_slots": [
    {
      "start": "2026-02-25T10:00:00Z",
      "end": "2026-02-25T11:00:00Z",
      "display": "Tuesday, February 25 at 10:00 AM ET"
    },
    {
      "start": "2026-02-25T14:00:00Z",
      "end": "2026-02-25T15:00:00Z",
      "display": "Tuesday, February 25 at 2:00 PM ET"
    }
  ],
  "candidate_name": "John Doe",
  "candidate_email": "john@example.com",
  "job_title": "Senior Frontend Engineer"
}
```

## 🤖 AI Agents

### Agent 1: Resume Parser
- **Purpose**: Extract structured data from unformatted resume text
- **Inputs**: Raw resume text
- **Outputs**: Candidate object with:
  - Personal information
  - Skills and expertise
  - Work history
  - Education
  - Certifications
  - Language proficiency
  - Contact links (GitHub, LinkedIn, portfolio)

### Agent 2: Candidate Scorer
- **Purpose**: Evaluate candidate fit against job requirements
- **Scoring Dimensions**:
  - **Must-Haves** (40% weight): Required skills match
  - **Experience** (25% weight): Years and depth of relevant experience
  - **Adjacency** (20% weight): Related skills that transfer well
  - **Culture Fit** (15% weight): Soft skills and company alignment
- **Output**: Fit score (0-100) and status determination

### Agent 2b: Rejection Handler
- **Purpose**: Send personalized rejection emails
- **Triggers**: When candidate score < rejection threshold
- **Action**: Sends professional, encouraging rejection email

### Agent 3: Interview Scheduler
- **Purpose**: Automatically schedule qualified candidates
- **Triggers**: When candidate score meets qualification threshold
- **Actions**:
  - Queries Google Calendar for interviewer availability
  - Identifies optimal meeting times
  - Sends interview invitation with available slots
  - Creates calendar event upon confirmation

## 🔐 Environment Requirements

The workflow uses these environment variables and integrations:

### Required
- **n8n instance**: `iitprecruitaiproject.app.n8n.cloud`
- **OpenAI API key**: For Agent 1 & 2 (resume parsing and scoring)

### Optional
- **Google Calendar API**: For Agent 3 (interview scheduling)
- **Email service**: For sending interview invitations and rejections

## 🚀 Deployment

### Frontend Integration
```typescript
// In src/lib/n8n.ts
const PIPELINE_WEBHOOK = "https://iitprecruitaiproject.app.n8n.cloud/webhook/screening-pipeline";
const SCHEDULING_WEBHOOK = "https://iitprecruitaiproject.app.n8n.cloud/webhook/schedule-interview";

export async function runPipeline(payload) {
  const res = await fetch(PIPELINE_WEBHOOK, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}
```

### Testing Webhooks
```bash
# Test screening pipeline
curl -X POST https://iitprecruitaiproject.app.n8n.cloud/webhook/screening-pipeline \
  -H "Content-Type: application/json" \
  -d '{
    "resume_text": "John Doe\nSoftware Engineer with 5 years experience",
    "job_description": "Senior Frontend Engineer needed",
    "job_id": "role-001"
  }'

# Test scheduling
curl -X POST https://iitprecruitaiproject.app.n8n.cloud/webhook/schedule-interview \
  -H "Content-Type: application/json" \
  -d '{
    "candidate_email": "john@example.com",
    "candidate_name": "John Doe",
    "job_title": "Senior Frontend Engineer",
    "job_id": "role-001"
  }'
```

## 📈 Workflow Status & Monitoring

Monitor workflow execution in n8n:
- **Dashboard**: https://iitprecruitaiproject.app.n8n.cloud
- **Workflow**: https://iitprecruitaiproject.app.n8n.cloud/workflow/aGjvgYERjR0zUbD9
- **Executions**: View all webhook calls and results
- **Logs**: Debug any pipeline issues

## 🔄 Error Handling

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| 404 Not Found | Webhook URL incorrect | Verify webhook path in .env.local |
| 400 Bad Request | Invalid payload format | Check required fields in payload |
| Timeout | Slow API response | Increase timeout, check OpenAI quota |
| Missing slots | Calendar not integrated | Configure Google Calendar in n8n |
| Email not sent | SMTP not configured | Setup email credentials in n8n |

## 📝 Workflow Export

To export or backup the workflow:
1. Go to workflow settings in n8n
2. Click "Export workflow"
3. Save the JSON file locally
4. Version control in repository

## 🔗 Related Documentation
- [Frontend Documentation](README.md)
- [API Integration](README.md#api-integration-n8n)
- [Environment Configuration](.env.example)

## 📞 Support
For workflow issues or modifications, access the n8n workflow editor at:
https://iitprecruitaiproject.app.n8n.cloud/workflow/aGjvgYERjR0zUbD9
