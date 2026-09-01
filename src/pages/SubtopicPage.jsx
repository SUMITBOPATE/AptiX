import { useNavigate, useParams } from 'react-router-dom';
import { topicsData } from '../../data/topicData';
import SubtopicCard from '../components/topics/SubtopicCard';
import { HugeiconsIcon } from '@hugeicons/react'
import {ArrowLeft02Icon,ArrowRight01Icon} from '@hugeicons/core-free-icons';
import Dialog from '../components/quiz/Dailog';

import Checklist from '../icons/Checklist';
import {useState, useEffect} from 'react';
import { getAllQuestionCounts } from '../lib/supabase';

function SubtopicPage() {



 const [selectedSubtopic , setSelectedSubtopic] = useState(null);
 const [isDialogOpen , setIsDialogOpen] = useState(false);
 const [questionCounts, setQuestionCounts] = useState({});

  const navigate = useNavigate();
  const { topicSlug } = useParams();

  // Fetch question counts for each subtopic
  useEffect(() => {
    const fetchCounts = async () => {
      const counts = await getAllQuestionCounts();
      setQuestionCounts(counts);
    };
    fetchCounts();
  }, [topicSlug]);

const handleSelectedSubtopic = (subtopic)=>{

  setSelectedSubtopic(subtopic);
  setIsDialogOpen(true);
}
 const handleCloseDialog = () => {
 setIsDialogOpen(false);

 }
 const handleStartQuiz=( config)=>{
  // Logic to start the quiz based on selectedSubtopic
  setIsDialogOpen(false);
  setSelectedSubtopic(config.subtopic);
  navigate(`/practice/${topicSlug}/quiz`, { state: config })

}
  const handleBack = () => {
    navigate('/#topics-section');
  };

  const currentTopic = topicsData.find(topic => topic.slug === topicSlug);
  const subcategories = currentTopic?.subcategories || {};
  const subtopicsArray = Object.values(subcategories);

  return (
    <div className="min-h-screen flex-1 w-full p-4 pt-3 text-gray-800">
      <div className="max-w-5xl mx-auto mt-2 mb-4">
        <button
          onClick={handleBack}
          className="inline-flex text-sm items-center text-gray-600 hover:text-green-600 transition-colors duration-200 mr-4"
        >
         <HugeiconsIcon icon={ArrowLeft02Icon} />back
        </button>

        <h2 className="mt-3.5 text-2xl font-semibold text-gray-700">Practice</h2>

        <div className="bg-white dark:bg-[#1B2014] mt-3.5 rounded-xl shadow-sm border font-family:[Geist] border-gray-200 dark:border-[#343B29] p-4 flex items-center hover:bg-gray-50 dark:hover:bg-[#22291A] dark:hover:border-lime-400/20 justify-between cursor-pointer relative overflow-hidden transition-colors duration-200">
          <div className="w-12 h-12 bg-gradient-to-br from-lime-50 to-lime-100 dark:from-lime-400/10 dark:to-lime-400/10 dark:border dark:border-lime-400/10 rounded-4xl flex items-center justify-center flex-shrink-0">
            <Checklist className="w-6 h-6 text-lime-500" />
          </div>

          <div className="flex-1 min-w-0 ml-4 relative">
            <div className="text-base text-gray-900 font-medium pr-16">
              Mock test
              <span className="relative ml-2.5 px-1.5 py-0.5 rounded-4xl bg-lime-200 dark:bg-lime-400/15 dark:text-lime-300 dark:border dark:border-lime-400/10 text-xs font-medium text-gray-600">
                0 Attempted
              </span>
              <p className="text-sm text-gray-600 font-light mt-0.5">
                Practice with Multiple sample questions in Real test Environment
              </p>
            </div>
          </div>

          <div className="w-8 h-8 rounded-full bg-lime-50 flex items-center justify-center">
           <HugeiconsIcon icon={ArrowRight01Icon} className="w-4 h-4 text-lime-500" />
          </div>
        </div>
      </div>

      <div className="max-w-5xl flex-1 mx-auto py-2 flex items-center">
        <h2 className="text-2xl font-semibold text-gray-700">
          {currentTopic?.title}
        </h2>
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-3.5 gap-6">
      {subtopicsArray.map((subtopic) => (
            <SubtopicCard
              key={subtopic.slug}
              subtopic={subtopic}
              topicSlug={topicSlug}
              questionCount={questionCounts[subtopic.slug] || 0}
              onClick={() => handleSelectedSubtopic(subtopic)}

            />

          ))}

        </div>
      </div>
{
  isDialogOpen && selectedSubtopic && (  <Dialog
    selectedSubtopic={selectedSubtopic}
    onClose={handleCloseDialog}
    onStart={handleStartQuiz}
  />
)}


    </div>
  );
}

export default SubtopicPage;
