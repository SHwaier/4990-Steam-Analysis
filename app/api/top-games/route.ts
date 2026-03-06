import { NextRequest, NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';
import {
  getTop100Games,
  filterByPriceRange,
  filterByGenre,
  sortGames,
} from '@/lib/steamspy-api';

const getCachedTopGames = unstable_cache(
  async (
    page: number,
    perPage: number,
    priceRange: 'free' | 'under10' | '10to30' | 'over30' | null,
    genre: string | null,
    sortBy: 'players' | 'rating' | 'name' | 'price' | null,
    sortOrder: 'asc' | 'desc'
  ) => {
    // Fetch top 100 games
    let games = await getTop100Games();

    // Apply filters
    if (priceRange) {
      games = filterByPriceRange(games, priceRange);
    }

    if (genre) {
      games = filterByGenre(games, genre);
    }

    // Sort games
    if (sortBy) {
      games = sortGames(games, sortBy, sortOrder);
    }

    // Pagination
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedGames = games.slice(startIndex, endIndex);

    return {
      games: paginatedGames,
      total: games.length,
      page,
      perPage,
      totalPages: Math.ceil(games.length / perPage),
    };
  },
  ['top-games-api'],
  { revalidate: 3600 } // Cache for 1 hour
);

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const priceRange = searchParams.get('priceRange') as
      | 'free'
      | 'under10'
      | '10to30'
      | 'over30'
      | null;
    const genre = searchParams.get('genre');
    const sortBy = searchParams.get('sortBy') as
      | 'players'
      | 'rating'
      | 'name'
      | 'price'
      | null;
    const sortOrder =
      (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc';
    const page = parseInt(searchParams.get('page') || '1', 10);
    const perPage = parseInt(searchParams.get('perPage') || '20', 10);

    const data = await getCachedTopGames(
      page,
      perPage,
      priceRange,
      genre,
      sortBy,
      sortOrder
    );

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in top-games API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch top games' },
      { status: 500 }
    );
  }
}
