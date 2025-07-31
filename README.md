# SLPC & SPC Consultants Web App

A collaborative content management system for Speech-Language Pathology and School Psychology consultants across Ohio's Educational Service Centers.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd SLPCWebApp

Install dependencies
bashnpm install

Environment Configuration
Create .env.local with:
bash# Sanity Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=h3prmcr9
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2023-12-01
NEXT_PUBLIC_SANITY_STUDIO_URL=http://localhost:3333


🖥 Running the App
Terminal 1 - Next.js Web App:
bashnpm run dev
→ Opens at http://localhost:3000
Terminal 2 - Sanity CMS:
bashnpx sanity dev --port 3333
→ Opens at http://localhost:3333
🔧 Troubleshooting
"Configuration must contain projectId" Error
Update sanity.config.ts with hardcoded project ID:
typescriptprojectId: 'h3prmcr9',
Next.js Build Errors
Clear the build cache:
bashrm -rf .next
npm run dev
📝 Adding Content

Regions: Go to Sanity Studio → Regions → Create New Document
Posts: Go to Sanity Studio → Posts → Select type (job/event/announcement)
Consultants: Go to Sanity Studio → Consultants → Add profile info

🌐 Deployment
Vercel (Next.js)

Connect GitHub repo to Vercel
Add environment variables
Deploy automatically

Sanity Studio
bashnpx sanity deploy
🛠 Common Commands
bash# Development
npm run dev                    # Start Next.js
npx sanity dev --port 3333    # Start Sanity Studio

# Production
npm run build                  # Build for production
npm start                      # Start production server

# Sanity
npx sanity deploy             # Deploy Studio
npx sanity projects list      # List projects

Access URLs:

Web App: http://localhost:3000
Sanity CMS: http://localhost:3333
