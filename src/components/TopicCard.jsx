import React from 'react'
import { Link } from 'react-router-dom'
import Button from './ui/Button';
import BookIcon from '../icons/BookIcon';
import QuestionCountIcon from '../icons/QuestionCountIcon';

export default function TopicCard({ topic }) {
  
  const { title, details, numberOfQuestions, description, slug } = topic;
 const handleStartLearning = () => {
  
    console.log(`Navigating to /practice/${slug}`);
  };
  return (

   


    <div id="topics-section" className="bg-color-bg shadow-lg rounded-xl p-6 border border-green-100 transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-[1.02]">
    
      <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-500 mb-4">{description}</p>
  
      <div className="flex justify-between items-center text-gray-600 mb-6">
     
        <div className="flex items-center space-x-2">
          <BookIcon className="text-amber-500" />
          <span className="font-semibold">{details}</span>
        </div>


        <div className="flex items-center space-x-2">
          <QuestionCountIcon className="text-amber-500" />
          <span className="font-semibold">{numberOfQuestions}</span>
        </div>
      </div>
       <div >


        
       </div>



 
      <Link to={`/practice/${slug}`}>
       
        <Button />
      </Link>
    </div>
  );
}