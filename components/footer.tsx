import Link from 'next/link';
import { Github, Twitter, ExternalLink } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:gap-12">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Steam Sentiment
              </div>
            </Link>
            <p className="mb-6 max-w-sm text-sm text-gray-400">
              An AI-powered sentiment analysis tool built to help you navigate
              Steam game reviews and find your next favorite title.
            </p>
            <div className="flex gap-4 text-gray-400">
              <a
                href="https://github.com/SHwaier/4990-Steam-Analysis.git"
                className="transition-colors hover:text-white"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Navigation
            </h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <Link href="/" className="transition-colors hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/top-games"
                  className="transition-colors hover:text-white"
                >
                  Top Games
                </Link>
              </li>
              <li>
                <Link
                  href="/browse"
                  className="transition-colors hover:text-white"
                >
                  Browse Categories
                </Link>
              </li>
              <li>
                <Link
                  href="/wishlist"
                  className="transition-colors hover:text-white"
                >
                  My Wishlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Resources
            </h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <a
                  href="https://steamcommunity.com/dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 transition-colors hover:text-white"
                >
                  Steam API <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a
                  href="https://steamspy.com/api.php"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 transition-colors hover:text-white"
                >
                  SteamSpy API <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/cjhutto/vaderSentiment"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 transition-colors hover:text-white"
                >
                  VADER Sentiment <ExternalLink size={12} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 flex flex-col items-center justify-between border-t border-white/10 pt-8 text-xs text-gray-500 md:flex-row">
          <p className="mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Steam Sentiment Analyzer. Not
            affiliated with Valve Corporation.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="transition-colors hover:text-white">
              Privacy Policy
            </Link>
            <Link href="#" className="transition-colors hover:text-white">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
