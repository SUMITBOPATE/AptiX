import React from 'react'
import TopicCard from '../components/TopicCard'
import { topicsData } from '../data/topicData';

function Topics() {
  return (
  <>
   
    <div id='topics-section' className="min-h-screen bg--color-bg p-16 text-gray-800">
      <div  className="max-w-7xl mx-auto py-2 ">
        <h1 className='text-4xl mb-6 text-gray-700'>
          The Best Platform to <span className='font-semibold text-lime-500'>Crack Aptitude</span>
        </h1>
        <h2 className="text-3xl font-bold leading-1.2 tracking-tight text-gray-900">
          Topics
        </h2>
        <p className="text-xl text-gray-600 mb-4 max-w-3xl">
          Explore various topics to enhance your aptitude skills and ace your exams.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {topicsData.map((topic, index) => {
          return (
            <TopicCard
              key={topic.slug}
              // This is the best way to pass the data: pass the entire 'topic' object
              topic={topic}
            />
          );
        })}

      


      </div>
    </div>
    </>
  );
}

export default Topics;
