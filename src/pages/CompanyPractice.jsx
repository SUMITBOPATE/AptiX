import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getQuestionCounts } from '../lib/supabase';
import { companiesData } from '../../data/companies';
import SubtopicCard from '../components/topics/SubtopicCard';
import Dialog from '../components/quiz/Dailog';
import { HugeiconsIcon } from '@hugeicons/react'
import BackButton from '../components/ui/BackButton';
import { getCompanyTone } from '../lib/companyTones';
import LoadingState from '../components/ui/LoadingState';

export default function CompanyPractice() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [questionCounts, setQuestionCounts] = useState({});
  const [countsLoaded, setCountsLoaded] = useState(false);
  const [countsFailed, setCountsFailed] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const company = companiesData.find(c => c.slug === slug);

  // Fetch question counts for each category
  useEffect(() => {
    if (!company) return undefined;

    let active = true;

    const fetchCounts = async () => {
      setCountsFailed(false);
      try {
        // Four head requests instead of one download. Postgres does the counting
        // and the browser receives no question rows at all.
        //
        // Each category is passed as its canonical slug and expanded to every
        // spelling the database may hold. This is why a count can now be slightly
        // higher than before: the old JavaScript filter matched only two spellings
        // per category and silently ignored rows stored as 'quantitative-aptitude'
        // or 'logical-reasoning', so the cards understated what was available.
        const [all, quantitative, reasoning, verbal] = await getQuestionCounts([
          { company: company.name },
          { company: company.name, category: 'quantitative-aptitude' },
          { company: company.name, category: 'logical-reasoning' },
          { company: company.name, category: 'verbal-ability' },
        ]);

        if (!active) return;

        setQuestionCounts({
          all: all.count,
          quantitative: quantitative.count,
          reasoning: reasoning.count,
          verbal: verbal.count,
        });
      } catch (err) {
        console.error('Unable to load question counts:', err);
        if (active) setCountsFailed(true);
      } finally {
        if (active) setCountsLoaded(true);
      }
    };

    fetchCounts();
    return () => { active = false; };
  }, [company]);

  if (!company) {
    return (
      <div className="min-h-dvh flex-1 w-full p-4 text-gray-800">
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

  const hasQuestions = (questionCounts.all ?? 0) > 0;

  return (
    <div className="min-h-dvh flex-1 w-full p-4 pt-3 text-gray-800">
      <div className="max-w-5xl mx-auto mt-2 mb-4">
        <BackButton onClick={() => navigate('/')} />

        <h2 className="mt-3.5 text-2xl font-semibold text-gray-700">Practice</h2>
      </div>

      <div className="max-w-5xl flex-1 mx-auto py-2 flex items-center gap-3 mb-6">
        {/* Monogram, not the company name — and the company's own tone, which
            was hardcoded to blue here while the cards varied by company. */}
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-sm font-bold tracking-tight ${getCompanyTone(company.color).monogram}`}
          aria-hidden="true"
        >
          {company.monogram ?? company.name.slice(0, 3).toUpperCase()}
        </div>
        <div>
          {/* fullName is optional — it only exists where it expands an acronym. */}
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-text-strong">
            {company.fullName ?? company.name}
          </h2>
          <p className="text-sm text-gray-600 dark:text-text-muted">Choose a category to practice</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto">
        {!countsLoaded ? (
          <LoadingState label="Loading questions" className="py-16" />
        ) : countsFailed ? (
          /* Checked before hasQuestions: a failed fetch leaves every count at 0,
             which would otherwise render the "Coming Soon" panel and pass the
             outage off as "no questions yet". */
          <div className="rounded-xl border border-dashed border-red-300 dark:border-border bg-white dark:bg-surface p-8 text-center">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-text-strong">
              Could not load questions
            </h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-text-muted">
              Check your connection and try again.
            </p>
          </div>
        ) : !hasQuestions ? (
          <div className="rounded-xl border border-dashed border-gray-300 dark:border-border bg-white dark:bg-surface p-8 text-center">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-text-strong">Coming Soon</h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-text-muted">
              {company.name} questions are being added. Check back shortly.
            </p>
          </div>
        ) : (
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
        )}
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
