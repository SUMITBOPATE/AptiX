import React from 'react'

export default function CategoryFilter({ questions, selectedCategory, onCategoryChange }) {
  // Calculate counts by category
  const calculateCategoryCounts = () => {
    const counts = {
      all: questions.length,
      quantitative: 0,
      reasoning: 0,
      verbal: 0,
    };

    questions.forEach((question) => {
      const category = question.category?.toLowerCase().trim();
      
      if (category === 'quantitative' || category === 'quant') {
        counts.quantitative += 1;
      } else if (category === 'reasoning' || category === 'logical reasoning') {
        counts.reasoning += 1;
      } else if (category === 'verbal' || category === 'verbal reasoning') {
        counts.verbal += 1;
      }
    });

    return counts;
  };

  const counts = calculateCategoryCounts();

  const categories = [
    { id: 'all', label: 'All', count: counts.all },
    { id: 'quantitative', label: 'Quantitative', count: counts.quantitative },
    { id: 'reasoning', label: 'Reasoning', count: counts.reasoning },
    { id: 'verbal', label: 'Verbal', count: counts.verbal },
  ];

  return (
    <div className="flex flex-wrap gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            selectedCategory === category.id
              ? 'bg-lime-400 text-white shadow-md shadow-lime-500/30'
              : 'bg-white text-gray-700 border border-gray-300 hover:border-lime-400'
          }`}
        >
          [{category.label} {category.count}]
        </button>
      ))}
    </div>
  );
}
