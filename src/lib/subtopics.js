import { topicsData } from '../../data/topicData';

// The questions table stores subcategories in several styles ("percentage",
// "Percentages", "Profit And Loss", "fill-in-the-blanks"). Every value is
// reduced to one comparable slug so a topic keeps a single card and quiz.
export const canonicalSlug = (value) =>
  `${value ?? ''}`
    .toLowerCase()
    .trim()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

// Undeclared subcategories that only differ by a trailing "s" are the same
// topic, so they share one generated card.
const collapsePlural = (slug) => (slug.endsWith('s') ? slug.slice(0, -1) : slug);

// Database values that mean a declared topic but are named differently.
const SUBCATEGORY_ALIASES = {
  'percentage': 'percentages',
  'profit-and-loss': 'profit-loss',
  'time-and-work': 'time-work',
  'ratio-and-proportion': 'ratios-proportions',
  'ratio-proportion': 'ratios-proportions',
  'fill-in-the-blank': 'fill-in-blanks',
  'fill-in-the-blanks': 'fill-in-blanks',
  'number-series': 'series-completion',
  'letter-number-series': 'series-completion',
  'synonyms': 'synonyms-antonyms',
  'antonyms': 'synonyms-antonyms',
  'error-spotting': 'sentence-correction',
};

export const getTaxonomySubtopics = (categorySlug) =>
  Object.values(topicsData.find(topic => topic.slug === categorySlug)?.subcategories ?? {});

// Resolves a raw database subcategory to the card that must hold it. Declared
// topics win, either by name or through the alias table; anything else is keyed
// by its own slug and becomes a generated card, so no question stays hidden.
export const resolveSubcategoryKey = (categorySlug, rawValue) => {
  const canonical = canonicalSlug(rawValue);
  if (!canonical) return null;

  const subtopics = getTaxonomySubtopics(categorySlug);

  return (
    subtopics.find(subtopic => subtopic.slug === SUBCATEGORY_ALIASES[canonical])?.slug ??
    subtopics.find(subtopic => canonicalSlug(subtopic.slug) === canonical)?.slug ??
    collapsePlural(canonical)
  );
};

const toTitleCase = (value) => value.replace(/\b[a-z]/g, character => character.toUpperCase());

// Builds the card list for a category: declared topics first, then one generated
// card per remaining subcategory found in the questions table. `rows` are
// { subcategory, topic_slug } pairs already filtered to that category.
export const buildSubtopicCards = (categorySlug, rows = []) => {
  const valuesByKey = new Map();
  const topicSlugsByKey = new Map();
  const countsByKey = new Map();

  const track = (key, subcategory, topicSlug) => {
    if (!key) return;
    if (subcategory) {
      if (!valuesByKey.has(key)) valuesByKey.set(key, new Set());
      valuesByKey.get(key).add(subcategory);
    }
    if (topicSlug) {
      if (!topicSlugsByKey.has(key)) topicSlugsByKey.set(key, new Set());
      topicSlugsByKey.get(key).add(topicSlug);
    }
    countsByKey.set(key, (countsByKey.get(key) ?? 0) + 1);
  };

  rows.forEach(row => {
    // Rows imported without a subcategory fall back to their topic slug.
    const source = row.subcategory || row.topic_slug;
    track(
      resolveSubcategoryKey(categorySlug, source),
      row.subcategory,
      row.subcategory ? null : row.topic_slug
    );
  });

  const claimed = new Set();

  const cards = getTaxonomySubtopics(categorySlug).map(subtopic => {
    claimed.add(subtopic.slug);
    return {
      card: subtopic,
      count: countsByKey.get(subtopic.slug) ?? 0,
      values: [...(valuesByKey.get(subtopic.slug) ?? [])],
      topicSlugs: [...(topicSlugsByKey.get(subtopic.slug) ?? [])],
    };
  });

  const extraCards = [...countsByKey.entries()]
    .filter(([key]) => !claimed.has(key))
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([key, count]) => {
      const values = [...(valuesByKey.get(key) ?? [])];
      // Prefer a spaced value for the title: "Time Speed Distance" over
      // "time-speed-distance".
      const label = values.find(value => value.includes(' ')) ?? values[0] ?? key;
      const name = toTitleCase(label.replace(/-/g, ' '));

      return {
        card: {
          name,
          slug: key,
          icon: '🗂️',
          description: `All ${name} questions`,
        },
        count,
        values,
        topicSlugs: [...(topicSlugsByKey.get(key) ?? [])],
      };
    });

  return { cards, extraCards };
};
