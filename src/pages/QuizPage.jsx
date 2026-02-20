  
  
  import {useLocation} from 'react-router-dom';
  
  
  function QuizPage (){
 
     const location = useLocation();
     const {state} = location;
     console.log("Quiz Config:", state);


const {subtopic,selectedDifficulty,count} = state || {};
         return (

        <div className="flex items-center justify-center h-screen bg-gray-100">
       <div className="bg-white p-6 rounded-xl shadow-lg">
         <h2 className="text-xl font-semibold text-gray-700 mb-2">Quiz Configuration</h2>
         <p className="text-gray-600">Subtopic: {subtopic?.name}</p>
         <p className="text-gray-600">Difficulty: {selectedDifficulty}</p>
         <p className="text-gray-600">Count: {count}</p>
       </div>
    
          </div>
     )
   }
   export default QuizPage;