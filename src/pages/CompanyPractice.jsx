import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { companiesData } from '../../data/companies';
import SubtopicCard from '../components/topics/SubtopicCard';
import Dialog from '../components/quiz/Dailog';
import { HugeiconsIcon } from '@hugeicons/react'
import BackButton from '../components/ui/BackButton';

export default function CompanyPractice() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [questionCounts, setQuestionCounts] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const company = companiesData.find(c => c.slug === slug);

  // Fetch question counts for each category
  useEffect(() => {
    const fetchCounts = async () => {
      if (!company) return;

      const { data } = await supabase
        .from('questions')
        .select('category')
        .eq('company', company.name);

      if (data) {
        const counts = {
          all: data.length,
          quantitative: data.filter(q => {
            const cat = q.category?.toLowerCase().trim();
            return cat === 'quantitative' || cat === 'quant';
          }).length,
          reasoning: data.filter(q => {
            const cat = q.category?.toLowerCase().trim();
            return cat === 'reasoning' || cat === 'logical reasoning';
          }).length,
          verbal: data.filter(q => {
            const cat = q.category?.toLowerCase().trim();
            return cat === 'verbal' || cat === 'verbal reasoning';
          }).length,
        };
        setQuestionCounts(counts);
      }
    };

    fetchCounts();
  }, [company]);

  if (!company) {
    return (
      <div className="min-h-screen flex-1 w-full p-4 text-gray-800">
        <div className="max-w-5xl mx-auto">
          <BackButton onClick={() => navigate(-1)} />
          <p className="mt-4 text-gray-600">Company not found</p>
        </div>
      </div>
    );
  }

  const categories = [
    {
      name: 'All Questions',
      slug: 'all',
      description: 'Practice all questions from ' + company.name,
      icon: 'ALl',
    },
    {
      name: 'Quantitative',
      slug: 'quantitative',
      description: 'Master mathematical problems and calculations',
      icon: 'Q',
    },
    {
      name: 'Reasoning',
      slug: 'reasoning',
      description: 'Improve logical and analytical thinking',
      icon: 'R',
    },
    {
      name: 'Verbal',
      slug: 'verbal',
      description: 'Enhance language and reading comprehension skills',
      icon: 'V',
    },
  ];

  const handleSelectCategory = (categorySlug) => {
    const category = categories.find(c => c.slug === categorySlug);
    setSelectedCategory(category);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedCategory(null);
  };

  const handleStartQuiz = (config) => {
    setIsDialogOpen(false);
    navigate(`/practice/company/${slug}/${selectedCategory.slug}/quiz`, { state: config });
  };

  return (
    <div className="min-h-screen flex-1 w-full p-4 pt-3 text-gray-800">
      <div className="max-w-5xl mx-auto mt-2 mb-4">
        <BackButton onClick={() => navigate('/')} />

        <h2 className="mt-3.5 text-2xl font-semibold text-gray-700">Practice</h2>
      </div>

      <div className="max-w-5xl flex-1 mx-auto py-2 flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-lg font-bold text-blue-700">
          {company.name}
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-gray-700">
            {company.fullName}
          </h2>
          <p className="text-sm text-gray-600">Choose a category to practice</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-3.5 gap-6">
          {categories.map((category) => (
            <SubtopicCard
              key={category.slug}
              subtopic={{
                name: category.name,
                slug: category.slug,
                description: category.description,
                icon: category.icon,
              }}
              onClick={() => handleSelectCategory(category.slug)}
              questionCount={questionCounts[category.slug] ?? null}
            />
          ))}
        </div>
      </div>

      {/* Dialog */}
      {isDialogOpen && selectedCategory && (
        <Dialog
          onClose={handleCloseDialog}
          selectedSubtopic={{
            name: selectedCategory.name,
            slug: selectedCategory.slug,
            description: selectedCategory.description,
            icon: selectedCategory.icon,
          }}
          onStart={handleStartQuiz}
          hideDifficulty={true}
          totalQuestions={questionCounts[selectedCategory.slug] || 50}
        />
      )}
    </div>
  );
}
