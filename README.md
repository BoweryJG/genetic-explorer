# Genetic Heritage Explorer

An interactive web application for exploring your 23andMe ancestry data with deep research capabilities powered by Brave Search and data storage in Supabase.

## Features

- **Interactive Visualizations**
  - Ancestry composition pie chart
  - Chromosome-by-chromosome ancestry visualization
  - Click-through exploration of each ancestry segment

- **Deep Ancestry Research**
  - Integrated Brave Search for real-time research
  - Pre-loaded insights for major ancestries
  - Historical context and migration patterns
  - Genetic traits and health considerations

- **Data Management**
  - Supabase integration for secure data storage
  - CSV import from 23andMe
  - User authentication ready

## Setup

1. Clone the repository and install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_BRAVE_API_KEY=your_brave_search_api_key
```

3. Set up your Supabase database:
   - Create a new Supabase project
   - Run the migration in `supabase/migrations/001_initial_schema.sql`
   - Copy your project URL and anon key to `.env`

4. Get a Brave Search API key:
   - Sign up at https://brave.com/search/api/
   - Copy your API key to `.env`

5. Run the development server:
```bash
npm run dev
```

## Usage

1. Upload your 23andMe ancestry composition CSV file
2. Explore your ancestry breakdown in the pie chart
3. Click on any ancestry to see detailed insights
4. Browse chromosome visualizations to see where each ancestry appears
5. Use the search feature to research specific aspects of your heritage

## Technologies

- React + TypeScript
- Vite
- Tailwind CSS
- Supabase (PostgreSQL + Auth)
- Brave Search API
- Recharts for visualizations

## Data Privacy

Your genetic data is sensitive. This app:
- Processes data locally in your browser
- Only stores data in your own Supabase instance
- Uses row-level security for data protection
- Never shares data with third parties (except search queries to Brave)

## Development

To extend the app:
- Add new ancestry insights in `AncestryExplorer.tsx`
- Customize visualizations in `ChromosomeVisualization.tsx`
- Add new search capabilities in `braveSearch.ts`
- Extend the database schema in `supabase/migrations/`