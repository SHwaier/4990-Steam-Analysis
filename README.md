# Steam Sentiment Analyzer

An AI-powered sentiment analysis tool for Steam game reviews built with Next.js, Tailwind CSS, Shadcn UI, and Framer Motion.

## Features

- **Real-time Sentiment Analysis**: Uses NLP to analyze Steam game reviews and provide sentiment scores
- **Beautiful UI**: Modern, sleek interface built with Tailwind CSS, Framer Motion, and Shadcn UI components
- **Hero Banner**: Rotating showcase of popular Steam games with sentiment indicators
- **Search Functionality**: Search for any Steam game
- **Detailed Game Pages**: View comprehensive sentiment statistics, review trends, and game metadata
- **No Login Required**: Simple and accessible for all users

## Architecture Overview

The Steam Sentiment Analyzer follows a modular architecture designed for efficiency and scalability:

- **User Interface**: Built with React and Next.js for a responsive, modern experience.
- **API Layer**: Utilizes Next.js API Routes to handle data fetching and processing.
- **Data Sources**: Integrates with the official Steam API and SteamSpy API for comprehensive game metadata, player counts, and reviews.
- **Analysis Engine**: Employs VADER (Valence Aware Dictionary and sEntiment Reasoner) combined with custom metadata scoring (hours played, helpfulness) to generate robust sentiment metrics.
- **Data Flow**: Frontend → Next.js API → Steam/SteamSpy APIs → Sentiment Analysis → UI.

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Fluid animations and transitions
- **Shadcn UI** - Accessible UI component primitives
- **Lucide React** - Beautiful, consistent iconography
- **VADER Sentiment** - Advanced NLP sentiment analysis heuristics
- **Steam API & SteamSpy API** - Game data, player counts, and reviews

## Getting Started

### Prerequisites

- Node.js 18+ installed

### Installation

1. Clone the repository:

```bash
git clone `https://github.com/SHwaier/4990-Steam-Analysis.git`
cd "4990-Steam-Analysis"
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/
│   ├── api/              # API routes
│   │   ├── games/        # Game-related endpoints
│   │   ├── reviews/      # Review endpoints
│   │   └── sentiment/    # Sentiment analysis endpoints
│   ├── game/[appid]/     # Game detail page
│   ├── top-games/        # Ranked games view
│   ├── browse/           # Category/Genre browsing
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   └── globals.css       # Global styles
├── components/
│   ├── ui/               # Shadcn UI primitives (badge, tooltip, etc.)
│   ├── hero-banner.tsx   # Rotating hero banner
│   ├── search-bar.tsx    # Debounced Search component
│   ├── game-card.tsx     # Reusable display card
│   ├── navbar.tsx        # Global navigation
│   └── footer.tsx        # Global footer
├── lib/
│   ├── config.ts         # Configuration
│   ├── steam-api.ts      # Steam API utilities
│   ├── sentiment-analysis.ts  # NLP sentiment logic
│   ├── types.ts          # TypeScript shared types
│   └── utils.ts          # Utility classes (cn)
└── README.md
```

## API Endpoints

### Games

#### `GET /api/games/random`
Get random popular games for the hero banner.
**Example Response:**
```json
[
  {
    "appid": 271590,
    "name": "Grand Theft Auto V Legacy",
    "details": {
      "success": true,
      "data": { ... }
    }
  }
]
```

#### `GET /api/games/search?q={query}`
Search for games by name. Returns up to 20 matches.
**Example Response:**
```json
[
  {
    "appid": 10,
    "name": "Counter-Strike"
  }
]
```

#### `GET /api/games/[appid]`
Get detailed game information.
**Example Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

### Reviews

#### `GET /api/reviews/[appid]`
Get reviews with sentiment analysis.
**Example Response:**
```json
{
  "success": 1,
  "query_summary": {
    "num_reviews": 20,
    "review_score": 8,
    "review_score_desc": "Very Positive",
    "total_positive": 8163954,
    "total_negative": 1296482,
    "total_reviews": 9460436
  },
  "reviews": [ ... ]
}
```

### Sentiment

#### `GET /api/sentiment/[appid]`
Get sentiment statistics and trends.
**Example Response:**
```json
{
  "overall": {
    "averageScore": 51.31,
    "positiveCount": 2160441,
    "negativeCount": 338605,
    "totalReviews": 2499046
  },
  "timeline": [ ... ],
  "steamStats": {
    "num_reviews": 100,
    "review_score": 8,
    "review_score_desc": "Very Positive",
    "total_positive": 2160441,
    "total_negative": 338605,
    "total_reviews": 2499046
  }
}
```

## Features Explained

### Sentiment Analysis

The app uses the `vader-sentiment` library to perform robust NLP analysis on Steam review text. Each review is scored on a 0-100 scale using a composite of factors:

- VADER compound sentiment score (-1 to +1 scaled appropriately)
- Review effort (character length)
- Player experience (hours played)
- Community helpfulness (upvotes)
- A sentiment label (positive, neutral, negative)

### Hero Banner

- Displays 5 random popular games
- Auto-rotates every 5 seconds
- Shows sentiment percentage for each game
- Links to detailed game page and Steam store

### Game Detail Page

- Game metadata (description, price, release date, etc.)
- Overall sentiment statistics
- Sentiment trend timeline
- Individual reviews with sentiment scores
- Direct link to Steam store page

## Visual Overview

The application features a modern dark-themed UI. Screenshots of the core pages can be found in the `Additional_Documentation.pdf` file, including:
- **Home Page**: Rotating hero banner with featured games.
- **Top Games**: Ranked list of games by player sentiment.
- **Browse**: Category and genre-based game discovery.
- **Game Detail**: Comprehensive analysis with sentiment charts and review breakdowns.

## Roadmap

Future enhancements planned for the Steam Sentiment Analyzer:
- **Multilingual Support**: Expand sentiment analysis to include non-English reviews.
- **Enhanced Visualizations**: More interactive and detailed sentiment trend charts.
- **Custom Filtering**: Allow users to sort sentiment by specific date ranges and time periods.
- **Niche Game Support**: Improve data gathering for games with smaller review pools.
- **Advanced Metrics**: Incorporate additional player analytics and engagement data.

## Customization

### Adding More Games to Hero Banner

Edit `lib/steam-api.ts` and modify the `getPopularGameIds()` function to include different game App IDs.

### Styling

All styling uses Tailwind CSS. Modify classes in components or extend the theme in `tailwind.config.ts`.

## Building for Production

```bash
npm run build
npm start
```

## Notes

- The app uses Steam's public APIs exclusively - no API key required
- Steam API has rate limits - the app handles errors gracefully
- Some Steam games may not have reviews available
- Sentiment analysis is performed server-side for better performance
- Workshop features are not available as they require authentication
- **Performance Caching**: To improve latency and avoid API rate limits, heavy API requests (like Top Games and Category Browsing) are cached on the server for 1 hour. Because of this, data such as concurrent player counts or newly released games may be delayed by up to 60 minutes. Client-side SWR caching is also implemented for instantaneous page transitions.

## License

MIT

## Acknowledgments

- Steam for providing the public API
- SteamSpy for providing trending and categorization metrics
- Shadcn UI & Radix UI for accessible component primitives
- VADER Sentiment for lexical NLP analysis
