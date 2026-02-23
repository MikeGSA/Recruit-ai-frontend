# Recruit-AI Frontend

A modern, AI-powered recruitment screening application built with Next.js, React, and Tailwind CSS.

## 📦 Project Structure

This is the **Frontend Repository** for IIT PMRecruit AI.

- **Frontend**: [Recruit-ai-frontend](https://github.com/MikeGSA/Recruit-ai-frontend) (this repo)
- **Backend**: [IIT-PMRecruit-AI](https://github.com/MikeGSA/IIT-PMRecruit-AI) (n8n workflow documentation)

## 🎯 Overview

Recruit-AI is a fully integrated candidate screening system that leverages AI agents to:
- **Parse** candidate resumes and extract structured data (Agent 1)
- **Score** candidates against job requirements (Agent 2)
- **Schedule** interviews automatically for qualified candidates (Agent 3)
- **Handle** rejection emails for unsuitable candidates (Agent 2b)

### Backend Workflow
**n8n Workflow**: [View the complete AI pipeline](https://iitprecruitaiproject.app.n8n.cloud/workflow/aGjvgYERjR0zUbD9)

**Backend Repository**: [IIT-PMRecruit-AI Backend](https://github.com/MikeGSA/IIT-PMRecruit-AI)

This workflow orchestrates all AI agents in sequence and handles the entire recruitment screening flow.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ or later
- npm or yarn
- Backend webhook URLs from [IIT-PMRecruit-AI](https://github.com/MikeGSA/IIT-PMRecruit-AI)

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your n8n webhook URLs from the backend repo
```

### Development

```bash
# Start development server
npm run dev

# Open in browser
# http://localhost:3000
```

### Build & Production

```bash
# Build for production
npm run build

# Start production server
npm run start

# Run linter
npm run lint
```

## 📁 Project Structure

```
src/
├── components/          # Reusable React components
│   ├── Layout.tsx       # Main layout wrapper
│   ├── Navbar.tsx       # Top navigation bar with role dropdown
│   ├── ResumeUploader.tsx    # File upload component
│   └── ScoreBadge.tsx   # Visual score display badge
├── lib/
│   ├── n8n.ts          # API client for n8n webhooks
│   ├── store.ts        # Zustand state management store
│   └── utils.ts        # Utility functions and helpers
├── pages/              # Next.js pages (routes)
│   ├── _app.tsx        # App wrapper and global layout
│   ├── index.tsx       # Dashboard (main landing page)
│   ├── candidates/[id].tsx        # Candidate detail view
│   ├── roles/[id].tsx           # Role detail with screening form
│   └── schedule/[id].tsx        # Interview scheduling page
├── styles/
│   └── globals.css     # Tailwind CSS + custom components
└── types/
    └── index.ts        # TypeScript type definitions
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# n8n Webhook URLs (required)
NEXT_PUBLIC_N8N_PIPELINE_WEBHOOK=https://your-n8n-instance.cloud/webhook/screening-pipeline
NEXT_PUBLIC_N8N_SCHEDULING_WEBHOOK=https://your-n8n-instance.cloud/webhook/schedule-interview

# Optional: Application configuration
NEXT_PUBLIC_APP_NAME=Recruit AI
NEXT_PUBLIC_APP_ENV=development
```

## 📊 Core Features

### Dashboard
- Overview of all screening results across roles
- Statistics: Total screened, Advancing, Borderline, Rejected
- Quick access to open roles and recent candidates
- Interactive candidate table with filtering

### Role Screening
- Upload resumes (TXT, PDF)
- Real-time candidate scoring via AI pipeline
- Instant feedback on fit score and status
- View all candidates for a specific role

### Candidate Profiles
- Comprehensive candidate information
- Detailed score breakdown with weighted components
- Strengths and gaps analysis
- Work history and skills mapping
- Links to GitHub, LinkedIn, portfolio
- Action buttons for scheduling or rejection status

### Interview Scheduling
- Automatic slot availability detection
- Calendar integration
- Confirmation flow with email notifications

## 🏗️ Architecture

### State Management (Zustand)
The application uses [Zustand](https://github.com/pmndrs/zustand) for global state with localStorage persistence:

```typescript
// Store hooks available
useRecruitStore() provides:
- roles: Role[]
- screeningResults: Record<string, ScreeningResult[]>
- addScreeningResult(roleId, result)
- getRoleById(id)
- getCandidatesByRoleId(roleId)
- getCandidateById(email)
- getAllCandidates()
- getQualifiedCandidates()
- getBorderlineCandidates()
- getRejectedCandidates()
```

### API Integration (n8n)

**Backend Repository**: https://github.com/MikeGSA/IIT-PMRecruit-AI

**Workflow**: https://iitprecruitaiproject.app.n8n.cloud/workflow/aGjvgYERjR0zUbD9

Two main webhooks:

1. **Screening Pipeline**
   - Endpoint: `NEXT_PUBLIC_N8N_PIPELINE_WEBHOOK`
   - Webhook path: `/webhook/screening-pipeline`
   - Payload: `{ resume_text, job_description, job_id }`
   - Returns: `ScreeningResult` with full candidate data and scores
   - Runs: Agent 1 (Parse) → Agent 2 (Score) → Agent 2b/3 (Rejection/Scheduling)

2. **Scheduling Webhook**
   - Endpoint: `NEXT_PUBLIC_N8N_SCHEDULING_WEBHOOK`
   - Webhook path: `/webhook/schedule-interview`
   - Payload: `{ candidate_email, candidate_name, job_title, job_id }`
   - Returns: `SchedulingResult` with available time slots
   - Runs: Agent 3 (Interview Scheduling)

For complete backend documentation, see: [IIT-PMRecruit-AI Backend Repository](https://github.com/MikeGSA/IIT-PMRecruit-AI)

## 🎨 Styling

The application uses:
- **Tailwind CSS** for utility-first styling
- **Custom CSS components** in `globals.css`
- **Responsive design** with mobile-first approach

### Available CSS Classes

```css
/* Buttons */
.btn-primary      /* Blue primary button */
.btn-secondary    /* White outlined button */
.btn-danger       /* Red danger button */
.btn-success      /* Green success button */

/* Components */
.card             /* White card with border and shadow */
.input-field      /* Styled form input */

/* Badges */
.badge            /* Base badge component */
.badge-green      /* Green badge */
.badge-blue       /* Blue badge */
.badge-yellow     /* Yellow badge */
.badge-red        /* Red badge */
```

## 📦 Dependencies

### Main
- **next** - React framework with SSR
- **react** - UI library
- **zustand** - State management
- **react-dropzone** - File upload handling
- **date-fns** - Date formatting utilities

### Development
- **typescript** - Type safety
- **tailwindcss** - CSS framework
- **eslint** - Code linting
- **autoprefixer** - CSS prefixing

## 🔄 Workflow

### Resume Screening Flow

1. **User uploads resume** on `/roles/[id]` page
2. **Frontend validates** file size (max 5MB) and type
3. **Frontend sends** resume text + job description to n8n
4. **Agent 1 parses** resume into structured candidate data
5. **Agent 2 scores** candidate against job requirements
6. **Decision logic**:
   - **Qualified** → Send to Agent 3 for scheduling
   - **Borderline** → Store for manual review
   - **Rejected** → Send to Agent 2b for rejection email

### Interview Scheduling Flow

1. **User clicks** "Schedule Interview" on candidate profile
2. **Frontend calls** scheduling webhook
3. **Agent 3 queries** Google Calendar for available slots
4. **Frontend displays** available time slots
5. **User selects** a time slot
6. **Confirmation email** sent to candidate

## 🛠️ Development Tips

### Adding a New Page
1. Create file in `src/pages/`
2. Use `useRecruitStore()` for state
3. Use `useRouter()` for navigation
4. Wrap with `Layout` component

### Adding a New Component
1. Create file in `src/components/`
2. Use TypeScript for type safety
3. Pass props as interface
4. Use Tailwind for styling

### Adding Utilities
Add reusable functions to `src/lib/utils.ts` and export from there.

## 📝 Type Definitions

All TypeScript types are defined in `src/types/index.ts`:
- `Candidate` - Parsed resume data
- `JobRequirements` - Parsed job description
- `ScreeningResult` - Complete scoring result
- `Role` - Job opening
- `TimeSlot` - Interview time slot

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Connect GitHub repository to Vercel
# Set environment variables in Vercel dashboard
# Auto-deploys on git push
```

### Docker

```dockerfile
# Build
docker build -t recruit-ai-frontend .

# Run
docker run -p 3000:3000 -e NEXT_PUBLIC_N8N_PIPELINE_WEBHOOK=... recruit-ai-frontend
```

## 📖 Learn More

### Related Repositories
- **Backend (n8n Workflow)**: https://github.com/MikeGSA/IIT-PMRecruit-AI
  - Complete backend documentation
  - API specifications
  - Configuration guide
  
### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Zustand](https://github.com/pmndrs/zustand)

### Backend Documentation
- [Backend README](https://github.com/MikeGSA/IIT-PMRecruit-AI)
- [API Reference](https://github.com/MikeGSA/IIT-PMRecruit-AI/blob/main/API.md)
- [Setup Guide](https://github.com/MikeGSA/IIT-PMRecruit-AI/blob/main/SETUP.md)

## 📄 License

© 2026 Recruit-AI. All rights reserved.

## 🤝 Support

For issues or questions, please reach out to the development team.
