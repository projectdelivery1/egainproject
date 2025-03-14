Thought for 1 second### eGain Visitor Analytics Dashboard





## Overview

eGain Visitor Analytics is a comprehensive dashboard application designed for sales representatives to track, analyze, and gain insights from website visitor data. The application helps identify potential leads, understand visitor behavior, and enrich visitor information with company data to support sales and marketing efforts.

## Features

### Dashboard & Analytics

- *Real-time Overview*: View key metrics including total visitors, unique companies, high-value leads, and average session duration
- *Visitor Traffic Analysis*: Interactive charts showing visitor trends over time (hourly, daily, monthly)
- *Top Companies*: Identify and analyze companies with the most visits
- *Recent Visitors*: Track the latest website visitors and their activities
- *Top Pages*: Monitor the most visited pages on your website


### Visitor Intelligence

- *IP Geolocation*: Map IP addresses to geographic locations
- *Company Enrichment*: Enhance visitor data with detailed company information
- *Lead Scoring*: AI-powered lead scoring based on visitor behavior
- *Visitor Journey Tracking*: Follow the path visitors take through your website
- *Technology Stack Detection*: Identify technologies used by visiting companies


### Sales & CRM Integration

- *Lead Assignment*: Assign leads to sales representatives
- *Sales Rep Management*: Manage your sales team and track performance
- *CRM Integration*: Connect with popular CRM systems like Salesforce and HubSpot
- *Account Management*: Track assigned leads, accounts, and active deals


### Reporting & Analysis

- *Custom Reports*: Create and schedule custom reports
- *Visitor Segmentation*: Segment visitors by industry, company size, engagement level, and geography
- *Page Analytics*: Analyze page performance, bounce rates, and conversion rates
- *Export Capabilities*: Export data to Excel for further analysis


### Data Management

- *Log Viewer*: View and analyze raw visitor logs
- *Import/Export*: Import visitor logs from Excel/CSV and export data
- *Filtering & Sorting*: Advanced filtering and sorting options for data analysis


## Technology Stack

- *Frontend*: React, Next.js (App Router)
- *UI Components*: shadcn/ui, Radix UI
- *Styling*: Tailwind CSS
- *State Management*: Zustand
- *Data Visualization*: Recharts
- *Icons*: Lucide React
- *Date Handling*: date-fns
- *File Processing*: xlsx (for Excel import/export)


## Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm or yarn


### Installation

1. Clone the repository


shellscript
git clone https://github.com/projectdelivery1/egainproject.git
cd egainproject


2. Install dependencies


shellscript
npm install
# or
yarn install


3. Run the development server


shellscript
npm run dev
# or
yarn dev


4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application


### Environment Variables

Create a .env.local file in the root directory with the following variables:

plaintext
NEXT_PUBLIC_APP_URL=http://localhost:3000
# Add any API keys for geolocation or company data enrichment services


## Project Structure

plaintext
├── app/                  # Next.js App Router pages
│   ├── accounts/         # Account management pages
│   ├── companies/        # Company analytics pages
│   ├── ip-mapping/       # IP geolocation pages
│   ├── logs/             # Log viewer pages
│   ├── reports/          # Report management pages
│   ├── tools/            # Integration tools pages
│   ├── visitor/          # Visitor detail pages
│   └── visitors/         # Visitor list pages
├── components/           # React components
│   ├── ui/               # UI components (shadcn/ui)
│   └── ...               # Feature components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and libraries
│   ├── log-store.ts      # Zustand store for log data
│   └── excel-parser.ts   # Excel import/export utilities
├── public/               # Static assets
└── types/                # TypeScript type definitions


## Key Components

- *Dashboard*: Main overview with key metrics and visualizations
- *Visitor List*: Table of all website visitors with filtering and sorting
- *Company List*: Table of companies visiting your website
- *IP Geolocation*: Map showing visitor locations
- *Lead Assignment*: Interface for assigning leads to sales reps
- *Report Creator*: Tool for creating custom reports
- *Log Viewer*: Interface for viewing and analyzing raw logs


## Data Flow

1. *Data Import*: Import visitor logs from Excel/CSV files
2. *Data Processing*: Process and enrich data with geolocation and company information
3. *Data Storage*: Store processed data in the client-side Zustand store
4. *Data Visualization*: Display data in charts, tables, and maps
5. *Data Export*: Export processed data for external analysis


## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (git checkout -b feature/amazing-feature)
3. Commit your changes (git commit -m 'Add some amazing feature')
4. Push to the branch (git push origin feature/amazing-feature)
5. Open a Pull Request





## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Recharts](https://recharts.org/)
- [Zustand](https://github.com/pmndrs/zustand)
- [Lucide Icons](https://lucide.dev/)


---

Built with ❤ for eGain sales teams
