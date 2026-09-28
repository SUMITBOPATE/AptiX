import { useEffect, useState } from 'react'
import TopicCard from '../components/topics/TopicCard'
import MockTest from '../components/topics/MockTest'
import Companies from '../components/companies/Companies'
import { topicsData } from '../../data/topicData';
import { companiesData } from '../../data/companies';
import { getQuestionCounts, getSubcategoryIndexRows } from '../lib/supabase';
import { buildSubtopicCards } from '../lib/subtopics';

function Topics() {
  const [questionStats, setQuestionStats] = useState(null);
  const [statsFailed, setStatsFailed] = useState(false);
  const [subtopicCounts, setSubtopicCounts] = useState(null);

  // How many subtopic cards each topic actually leads to. This is not the
  // declared subcategory count: the subtopic pages also generate a card for
  // every remaining subcategory in the question bank, so a topic declaring five
  // subtopics can currently lead to twenty-nine. Counting them here keeps the
  // card honest about what the visitor will find.
  useEffect(() => {
    let active = true;

    const loadSubtopicCounts = async () => {
      try {
        // One index request per topic, in parallel. Each selects four columns
        // over that category only, so the payload is small.
        const rows = await Promise.all(topicsData.map((topic) => getSubcategoryIndexRows(topic.slug)));
        if (!active) return;

        setSubtopicCounts(
          Object.fromEntries(
            topicsData.map((topic, index) => {
              const { cards, extraCards } = buildSubtopicCards(topic.slug, rows[index]);
              return [topic.slug, cards.length + extraCards.length];
            })
          )
        );
      } catch (error) {
        // The cards fall back to the declared count, which is a real number
        // rather than a spinner that never resolves.
        console.error('Unable to load subtopic counts:', error);
      }
    };

    loadSubtopicCounts();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    let active = true;

    const loadStatistics = async () => {
      // One filter set per card. getQuestionCounts runs them all at once, and
      // each one is a head request: Postgres does the COUNT(*) and the browser
      // receives no rows at all. Previously every question row in the table was
      // downloaded just to be counted in JavaScript.
      const filterSets = [
        ...topicsData.map((topic) => ({ category: topic.slug })),
        ...companiesData.map((company) => ({ company: company.name })),
      ];

      try {
        const results = await getQuestionCounts(filterSets);
        if (!active) return;

        // Split the single result list back into the two shapes the cards read.
        const categoryResults = results.slice(0, topicsData.length);
        const companyResults = results.slice(topicsData.length);

        setQuestionStats({
          total: categoryResults.reduce((sum, entry) => sum + entry.count, 0),
          byCategory: Object.fromEntries(
            topicsData.map((topic, index) => [topic.slug, categoryResults[index].count])
          ),
          byCompany: Object.fromEntries(
            companiesData.map((company, index) => [company.name, companyResults[index].count])
          ),
        });
      } catch (error) {
        console.error('Unable to load question statistics:', error);
        // Previously this only logged, which left every card stuck on
        // "Loading…" forever. Flag it so the cards can drop the stat instead.
        if (active) setStatsFailed(true);
      }
    };

    loadStatistics();
    return () => { active = false; };
  }, []);

  const isStatsLoading = !statsFailed && questionStats === null;

  return (
    <div
      id="topics-section"
      className="theme-content-background scroll-mt-20 pt-12 md:pt-16 text-gray-800 dark:text-text"
    >
      <div className="max-w-6xl mx-auto mb-8">
        <h2 className="text-3xl font-semibold leading-[1.15] tracking-tight text-gray-900">
          Topics
        </h2>
        <p className="text-base leading-[1.6] text-gray-600 md:text-xl max-w-[62ch]">
          Explore various topics to enhance your aptitude skills and ace your exams.
        </p>
      </div>

      {/* No <Reveal> on this grid: these cards are the primary navigation of the
          site and are seen on every visit. Scrolling them in delays the content
          the visitor came for, and hides it entirely if the observer never
          fires. Entrance motion belongs on the marketing sections below. */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {topicsData.map((topic) => (
          <TopicCard
            key={topic.slug}
            topic={topic}
            questionCount={statsFailed ? null : questionStats?.byCategory?.[topic.slug] ?? null}
            isStatsLoading={isStatsLoading}
            subtopicCount={subtopicCounts?.[topic.slug] ?? null}
          />
        ))}
      </div>

      <MockTest
        questionCount={statsFailed ? null : questionStats?.total ?? null}
        isStatsLoading={isStatsLoading}
      />
      <Companies
        questionCounts={statsFailed ? null : questionStats?.byCompany ?? null}
        isStatsLoading={isStatsLoading}
      />
    </div>
  );
}

export default Topics;
