import React, { useEffect, useState } from 'react'
import TopicCard from '../components/topics/TopicCard'
import MockTest from '../components/topics/MockTest'
import Companies from '../components/companies/Companies'
import { topicsData } from '../../data/topicData';
import { companiesData } from '../../data/companies';
import { getQuestionStatistics } from '../lib/supabase';

function Topics() {
  const [questionStats, setQuestionStats] = useState(null);

  useEffect(() => {
    let active = true;
    const loadStatistics = async () => {
      const categorySlugs = topicsData.map(topic => topic.slug);
      const companyNames = companiesData.map(company => company.name);

      try {
        let stats;
        try {
          stats = await getQuestionStatistics(categorySlugs, companyNames);
        } catch {
          stats = await getQuestionStatistics(categorySlugs, companyNames);
        }
        if (active) setQuestionStats(stats);
      } catch (error) {
        console.error('Unable to load question statistics:', error);
      }
    };

    loadStatistics();
    return () => { active = false; };
  }, []);

  return (
  <>

    <div id='topics-section' className="min-h-screen bg-color-bg dark:bg-bg sm:p-2 md:p-12 text-gray-800 dark:text-text">
      <div  className="max-w-screen-2xl mx-auto py-2 ">
        {/* <h1 className='text-4xl mb-6 text-gray-700'>
          The Best Platform to <span className='font-semibold text-lime-700'>Crack Aptitude</span>
        </h1> */}
        <h2 className="text-3xl font-bold leading-1.2 tracking-tight text-gray-900">
          Topics
        </h2>
        <p className="text-xl text-gray-600 mb-4 max-w-3xl">
          Explore various topics to enhance your aptitude skills and ace your exams.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {topicsData.map((topic) => {
          return (
            <TopicCard
              key={topic.slug}
              topic={topic}
              questionCount={questionStats?.byCategory[topic.slug] ?? null}
            />
          );
        })}

      </div>

      <MockTest questionCount={questionStats?.total ?? null} />
      <Companies questionCounts={questionStats?.byCompany ?? null} />
    </div>
  </>
  );
}

export default Topics;
