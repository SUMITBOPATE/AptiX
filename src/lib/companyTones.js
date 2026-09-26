/**
 * Per-company monogram colours.
 *
 * Kept in one place because the company card and the company practice header
 * both render a monogram chip, and they were previously using two different
 * colour maps (and the practice header was hardcoded to blue regardless of the
 * company).
 *
 * Card surfaces are deliberately NOT tinted. They are plain white, matching
 * TopicCard, so the two adjacent card grids read as one system. The monogram
 * is the only per-company colour, which keeps the companies distinguishable
 * without six competing pastel backgrounds.
 *
 * The dark-mode counterparts of these utilities live in index.css, under the
 * legacy remap block. `purple`, `indigo` and `cyan` had no remap at all, which
 * left three of the six monograms on a light pastel surface in dark mode.
 */
export const COMPANY_TONES = {
  blue: { monogram: 'bg-blue-100 text-blue-800' },
  red: { monogram: 'bg-red-100 text-red-800' },
  purple: { monogram: 'bg-purple-100 text-purple-800' },
  indigo: { monogram: 'bg-indigo-100 text-indigo-800' },
  green: { monogram: 'bg-green-100 text-green-800' },
  cyan: { monogram: 'bg-cyan-100 text-cyan-800' },
};

export const NEUTRAL_TONE = {
  monogram: 'bg-gray-100 text-gray-700',
};

export const getCompanyTone = (color) => COMPANY_TONES[color] ?? NEUTRAL_TONE;
