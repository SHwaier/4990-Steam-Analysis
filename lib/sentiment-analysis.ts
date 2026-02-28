import type { SteamReview, ReviewWithSentiment, SentimentScore, SentimentStats } from "./types";
// @ts-ignore - vader-sentiment might lack types
import vader from "vader-sentiment";

// ─── Main Sentiment Analysis Function ──────────────────────────────────
/**
 * Analyze the sentiment of a text string using VADER.
 * Returns a raw sentiment score. VADER maps text to a -1 to +1 compound scale.
 * We scale it to -15 to +15 to maintain compatibility with analyzeReview heuristics.
 */
export function analyzeSentiment(text: string): SentimentScore {
	if (!text || text.trim().length === 0) {
		return { score: 0, comparative: 0, tokens: [], positive: [], negative: [] };
	}

	const intensity = vader.SentimentIntensityAnalyzer.polarity_scores(text);

	// VADER compound score is -1 to 1.
	// The original heuristic raw score typically maxed around 15-25 for extreme reviews.
	// analyzeReview uses `(raw / 15)` to cap text magnitude.
	// We'll multiply VADER's compound by 15 so a perfectly positive VADER score (1.0)
	// results in a text magnitude of 1.0 (15 / 15).
	const rawScore = intensity.compound * 15;

	return {
		score: Math.round(rawScore * 10) / 10,
		comparative: Math.round(intensity.compound * 1000) / 1000,
		tokens: [],
		positive: [],
		negative: [],
	};
}

// ─── Review Analysis (0-100 scale) ─────────────────────────────────────
/**
 * Composite sentiment scoring on a 0–100 scale.
 *
 * Instead of anchoring on a single value and making small adjustments,
 * this combines FIVE independent continuous signals. Each signal varies
 * independently per review, so even reviews with identical text get
 * different scores based on playtime, length, and helpfulness.
 *
 * Signals (for voted_up, mirror for voted_down):
 *   1. Text sentiment  (0-22 pts) — powered by VADER sentiment
 *   2. Review effort    (0-10 pts) — character length (longer = more conviction)
 *   3. Playtime         (0-7 pts)  — hours played (more = more informed)
 *   4. Helpfulness      (0-5 pts)  — community upvotes
 *   5. Tone             (0-4 pts)  — caps, exclamation, emojis, structure
 *
 * voted_up base:  52  → range 52-100
 * voted_down base: 48 → range 0-48
 */
export function analyzeReview(review: SteamReview): ReviewWithSentiment {
	const text = review.review;
	const textSentiment = analyzeSentiment(text);
	const raw = textSentiment.score;

	// ── Signal 1: Text sentiment (biggest differentiator) ──
	// Linear mapping: raw/15 capped at 1.0
	const textMagnitude = Math.min(Math.abs(raw) / 15, 1);
	const textAligned = raw >= 0 === review.voted_up; // text agrees with vote?

	// ── Signal 2: Review effort (continuous, log-scaled) ──
	// 1 char → 0, 50 chars → 0.39, 200 chars → 0.59, 1000 chars → 0.82, 3000 → 1.0
	const effortSignal = Math.min(Math.log(1 + text.length) / Math.log(1 + 3000), 1);

	// ── Signal 3: Playtime (continuous, log-scaled) ──
	// 0 hrs → 0, 5 hrs → 0.25, 50 hrs → 0.57, 500 hrs → 0.90, 2000 → 1.0
	const hours = (review.author.playtime_forever || 0) / 60;
	const playtimeSignal = Math.min(Math.log(1 + hours) / Math.log(1 + 2000), 1);

	// ── Signal 4: Helpfulness (continuous, log-scaled) ──
	// 0 votes → 0, 3 → 0.21, 20 → 0.52, 100 → 0.80, 500 → 1.0
	const helpfulSignal = Math.min(Math.log(1 + (review.votes_up || 0)) / Math.log(1 + 500), 1);

	// ── Signal 5: Tone markers (additive, 0-1) ──
	const hasExclamation = /!/.test(text) ? 0.25 : 0;
	const hasCaps = /[A-Z]{3,}/.test(text) ? 0.25 : 0;
	const hasMultipleSentences = (text.match(/[.!?]+/g) || []).length >= 2 ? 0.25 : 0;
	const hasEmoji = /[\u{1F300}-\u{1FAFF}]|[\u{2600}-\u{27BF}]|[❤♥👍👎]/u.test(text) ? 0.25 : 0;
	const toneSignal = Math.min(hasExclamation + hasCaps + hasMultipleSentences + hasEmoji, 1);

	// ── Combine into final score ──
	let score: number;

	if (review.voted_up) {
		// Positive half: base 52, max ~100
		const textContrib = textAligned
			? textMagnitude * 22 // agreeing text → boost up to +22
			: textMagnitude * -10; // contradicting text → pull down up to -10
		const effortContrib = effortSignal * 10;
		const playtimeContrib = playtimeSignal * 7;
		const helpfulContrib = helpfulSignal * 5;
		const toneContrib = toneSignal * 4;

		score = 52 + textContrib + effortContrib + playtimeContrib + helpfulContrib + toneContrib;
	} else {
		// Negative half: base 48, min ~0
		const textContrib = textAligned
			? textMagnitude * 22 // agreeing negative text → push toward 0
			: textMagnitude * -10; // contradicting text → pull toward 50
		const effortContrib = effortSignal * 10;
		const playtimeContrib = playtimeSignal * 7;
		const helpfulContrib = helpfulSignal * 5;
		const toneContrib = toneSignal * 4;

		score = 48 - textContrib - effortContrib - playtimeContrib - helpfulContrib - toneContrib;
	}

	score = Math.max(0, Math.min(100, Math.round(score)));

	const sentimentScore: SentimentScore = {
		score,
		comparative: textSentiment.comparative,
		tokens: textSentiment.tokens,
		positive: textSentiment.positive,
		negative: textSentiment.negative,
	};

	return {
		...review,
		sentiment: sentimentScore,
		sentimentLabel: getSentimentLabel(score),
	};
}

// ─── Label Thresholds (0-100 scale) ────────────────────────────────────
export function getSentimentLabel(score: number): "positive" | "neutral" | "negative" {
	if (score >= 55) return "positive";
	if (score <= 45) return "negative";
	return "neutral";
}

// ─── Batch Analysis ────────────────────────────────────────────────────
export function analyzeReviews(reviews: SteamReview[]): ReviewWithSentiment[] {
	return reviews.map((review) => analyzeReview(review));
}

// ─── Statistics ────────────────────────────────────────────────────────
export function calculateSentimentStats(reviews: ReviewWithSentiment[]): SentimentStats {
	const totalReviews = reviews.length;

	const positiveCount = reviews.filter((r) => r.sentimentLabel === "positive").length;
	const neutralCount = reviews.filter((r) => r.sentimentLabel === "neutral").length;
	const negativeCount = reviews.filter((r) => r.sentimentLabel === "negative").length;

	const averageScore = totalReviews > 0 ? reviews.reduce((sum, r) => sum + r.sentiment.score, 0) / totalReviews : 0;

	// Group reviews by date for timeline
	const reviewsByDate = new Map<string, ReviewWithSentiment[]>();
	reviews.forEach((review) => {
		const date = new Date(review.timestamp_created * 1000).toISOString().split("T")[0];
		if (!reviewsByDate.has(date)) {
			reviewsByDate.set(date, []);
		}
		reviewsByDate.get(date)!.push(review);
	});

	const timeline = Array.from(reviewsByDate.entries())
		.map(([date, dateReviews]) => ({
			date,
			averageScore: dateReviews.reduce((sum, r) => sum + r.sentiment.score, 0) / dateReviews.length,
			count: dateReviews.length,
		}))
		.sort((a, b) => a.date.localeCompare(b.date));

	return {
		overall: {
			averageScore,
			positiveCount,
			neutralCount,
			negativeCount,
			totalReviews,
		},
		timeline,
	};
}

// ─── UI Helpers ────────────────────────────────────────────────────────
export function getSentimentColor(label: "positive" | "neutral" | "negative"): string {
	switch (label) {
		case "positive":
			return "text-green-500";
		case "negative":
			return "text-red-500";
		case "neutral":
			return "text-yellow-500";
	}
}

export function getSentimentBgColor(label: "positive" | "neutral" | "negative"): string {
	switch (label) {
		case "positive":
			return "bg-green-500/20";
		case "negative":
			return "bg-red-500/20";
		case "neutral":
			return "bg-yellow-500/20";
	}
}

export function getSentimentEmoji(label: "positive" | "neutral" | "negative"): string {
	switch (label) {
		case "positive":
			return "😊";
		case "negative":
			return "😞";
		case "neutral":
			return "😐";
	}
}
