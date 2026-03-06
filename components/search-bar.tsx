'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useDebounce } from 'use-debounce';
import { cn } from '@/lib/utils';
import type { SteamGame } from '@/lib/types';

export function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [debouncedQuery] = useDebounce(query, 300);
  const [results, setResults] = useState<SteamGame[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const searchGames = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/games/search?q=${encodeURIComponent(searchQuery)}`
      );
      if (response.ok) {
        const data = await response.json();
        setResults(data);
        setIsOpen(true);
      }
    } catch (error) {
      console.error('Error searching games:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    searchGames(debouncedQuery);
  }, [debouncedQuery, searchGames]);

  const handleGameClick = (appid: number) => {
    setIsOpen(false);
    setQuery('');
    router.push(`/game/${appid}`);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <form
        role="search"
        className="relative"
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          type="search"
          role="combobox"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for Steam games..."
          aria-label="Search for Steam games"
          aria-autocomplete="list"
          aria-haspopup="listbox"
          aria-controls="search-results"
          aria-expanded={isOpen && results.length > 0}
          className={cn(
            'w-full rounded-full border border-white/20 bg-slate-900/50 px-6 py-4 text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-300 focus:border-blue-500/50 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:bg-slate-900/80'
          )}
        />
        {isLoading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div
              className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white"
              role="status"
              aria-label="Loading search results"
            ></div>
          </div>
        )}
      </form>

      {isOpen && results.length > 0 && (
        <ul
          id="search-results"
          className="max-h-96 overflow-y-auto"
          role="listbox"
        >
          {results.map((game) => (
            <li key={game.appid} role="option" aria-selected={false}>
              <button
                onClick={() => handleGameClick(game.appid)}
                className="w-full px-6 py-3 text-left text-white hover:bg-white/10 transition-colors border-b border-white/5 last:border-b-0"
              >
                <div className="font-medium">{game.name}</div>
                <div className="text-xs text-gray-400">
                  App ID: {game.appid}
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      {isOpen && results.length === 0 && query && !isLoading && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-900/95 backdrop-blur-md shadow-xl">
          <div className="px-6 py-4 text-center text-gray-400" role="status">
            No games found
          </div>
        </div>
      )}
    </div>
  );
}
