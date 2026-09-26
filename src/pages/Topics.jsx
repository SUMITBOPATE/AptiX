import { useEffect, useState } from 'react'
import TopicCard from '../components/topics/TopicCard'
import MockTest from '../components/topics/MockTest'
import Companies from '../components/companies/Companies'
import { topicsData } from '../../data/topicData';
import { companiesData } from '../../data/companies';
import { getQuestionStatistics } from '../lib/supabase';

function Topics() {
  const [questionStats, setQuestionStats] = useState(null);
  const [statsFailed, setStatsFailed] = useState(false);

  useEffect(() => {
    let active = true;

    const loadStatistics = async () => {
      const categorySlugs = topicsData.map(topic => topic.slug);
      const companyNames = companiesData.map(company => company.name);

      try {
        const stats = await getQuestionStatistics(categorySlugs, companyNames);
        if (!active) return;
        setQuestionStats(stats);
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
