'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Search, BrainCircuit, Gamepad2, ArrowRight } from 'lucide-react';
import { HeroBanner } from '@/components/hero-banner';
import { SearchBar } from '@/components/search-bar';

const features = [
  {
    icon: <Search className="h-8 w-8 text-blue-400" />,
    title: 'Find Any Game',
    description:
      'Instantly access data from millions of Steam titles using our high-speed search and curated lists.',
  },
  {
    icon: <BrainCircuit className="h-8 w-8 text-purple-400" />,
    title: 'AI Sentiment Analysis',
    description:
      'Our custom VADER NLP heuristics read through thousands of reviews to give you the true community consensus.',
  },
  {
    icon: <Gamepad2 className="h-8 w-8 text-green-400" />,
    title: 'Make Informed Decisions',
    description:
      'Stop guessing if a game is worth your time. See comprehensive sentiment timelines before you buy.',
  },
];

const categories = [
  {
    name: 'Action',
    href: '/browse/genre/Action',
    color: 'from-orange-500/20 to-red-500/20',
  },
  {
    name: 'RPG',
    href: '/browse/genre/RPG',
    color: 'from-blue-500/20 to-indigo-500/20',
  },
  {
    name: 'Strategy',
    href: '/browse/genre/Strategy',
    color: 'from-green-500/20 to-emerald-500/20',
  },
  {
    name: 'Adventure',
    href: '/browse/genre/Adventure',
    color: 'from-purple-500/20 to-pink-500/20',
  },
];

export default function Home() {
  return (
    <main className="relative min-h-screen bg-black overflow-hidden">
      {/* Aesthetic Background Elements */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-blue-900/20 via-blue-900/5 to-transparent pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4 py-16 md:py-24 space-y-24">
        {/* Header content with staggered entrance */}
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="mb-6 text-5xl md:text-7xl font-extrabold tracking-tight bg-gradient-to-br from-white via-white to-gray-400 bg-clip-text text-transparent drop-shadow-sm"
          >
            Steam Sentiment Analyzer
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
            className="mx-auto max-w-2xl text-lg md:text-xl text-gray-400 font-medium"
          >
            Harness the power of AI to analyze millions of Steam reviews
            instantly. Find your next favorite game with confidence.
          </motion.p>
        </div>

        {/* Search Bar with fade in */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: 'easeOut' }}
        >
          <SearchBar />
        </motion.div>

        {/* Hero Banner with scale up fade */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
        >
          <HeroBanner />
        </motion.div>

        {/* Features Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
          className="border-t border-white/5 pt-24"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-4">
              How It Works
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Our platform takes the guesswork out of buying games by
              aggregating the real opinions behind the reviews.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors"
              >
                <div className="mb-6 inline-block p-4 rounded-xl bg-white/5 border border-white/10">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Categories Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
          className="py-12"
        >
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Explore Genres
              </h2>
              <p className="text-gray-400">
                Jump right into the most popular categories.
              </p>
            </div>
            <Link
              href="/browse"
              className="group flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
            >
              Browse All Categories
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categories.map((cat, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.95, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link
                  href={cat.href}
                  className={`block p-6 md:p-8 rounded-2xl bg-gradient-to-br ${cat.color} border border-white/10 hover:border-white/20 hover:-translate-y-1 transition-all duration-300 text-center group`}
                >
                  <h3 className="text-lg md:text-xl font-bold text-white group-hover:scale-105 transition-transform">
                    {cat.name}
                  </h3>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-white/10 px-8 py-20 text-center"
        >
          <div className="absolute inset-0 bg-[url('https://store.cloudflare.steamstatic.com/public/images/v6/home/background_spotlight.jpg')] opacity-20 mix-blend-overlay" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to find your next adventure?
            </h2>
            <p className="text-xl text-blue-100/80 mb-10">
              Join thousands of gamers discovering hidden gems and avoiding bad
              ports.
            </p>
            <Link
              href="/top-games"
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-bold text-black transition-all hover:scale-105 hover:bg-gray-100"
            >
              Browse Top Games
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.section>
      </div>
    </main>
  );
}
