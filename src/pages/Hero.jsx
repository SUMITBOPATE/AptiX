import React from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import { HugeiconsIcon } from '@hugeicons/react'
import { AbsoluteIcon ,Activity02Icon ,AiBrain01Icon,AiInnovation02Icon} from '@hugeicons/core-free-icons';
import QuestionsIcon from '../icons/QuestionsIcon'
import AnalyticsIcon from '../icons/AnalyticsIcon'
import LearningIcon from '../icons/LearningIcon'

export default function Hero({onShowTopics}) {
  return (

   
    <div className="min-h-screen max-w-full justify-center text-gray-800 font-sans">

  {/* Content */}
  <div className="relative z-10 flex flex-col items-center  justify-center min-h-screen  sm:p-12">
    <div className="max-w-5xl text-center">
      <h1 className="sm:text-4xl text-3xl lg:text-6xl font-extrabold font-sans text-gray-900 mb-4 leading-tight">
        Level Up Your <span className=" text-lime-500 mt-2 ">Aptitude.</span><br/>
        Crack Your Dream Job.
      </h1>
      
      <p className="text-xl sm:text-2xl mb-8 text-gray-600 leading-relaxed">
        Learn smart. Practice right. Get hired.
      </p>
    
      <div className="w-full max-w-xs mx-auto">
  <a href="#topics-section" onClick={onShowTopics} className="block w-full">  
    <Button/>
  </a>
</div>
    
<div className="container mx-auto border-1  border-dashed border-gray-200 mt-0 sm:mt-12">
  <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-dashed divide-primary/20">
        <div className=" p-8    flex flex-col    items-center">
       <HugeiconsIcon icon={AbsoluteIcon} className="w-8 h-8 text-lime-500" />
           <h1 className="text-xl font-semibold text-gray-900 mb-2">Fundamentals</h1>
          <span className="text-sm text-gray-500 text-wrap-balance">Deep-dive into essential concepts with structured Q&As and crystal-clear logic..</span>
        </div>
        <div className=" p-8  flex  flex-col   items-center"> 
       <HugeiconsIcon icon={Activity02Icon} className="w-8 h-8 text-lime-500" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Analytics</h1>
          <span className="text-sm text-gray-500 text-wrap-balance">Real-time Analytics for Pinpoint your weaknesses before the exam does.</span>
        </div>
        <div className= " p-8 flex flex-col items-center">
        <HugeiconsIcon icon={AiBrain01Icon} className="w-8 h-8 text-lime-500" />
           <h1 className="text-xl font-semibold text-gray-900 mb-2"> Precision</h1>
          <span className="text-sm text-gray-500 text-wrap-balance"> Sharpen your mental agility with timed drills designed to boost speed and accuracy. </span>
        </div>
         <div className=" p-8 flex flex-col items-center">
          <HugeiconsIcon icon={AiInnovation02Icon} className="w-8 h-8 text-lime-500" />
           <h1 className="text-xl font-semibold text-gray-900 mb-2">AI Mode</h1>
          <span className="text-sm text-gray-500 text-wrap-balance" >Let our neural engine craft a custom curriculum that evolves as you improve.</span>
        </div>
      </div>
    </div>
  </div>
</div>
</div>
  )
}
