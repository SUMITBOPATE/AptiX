// src/data/topicData.js


// src/data/topicsData.js
export const topicsData = [
  {
    title: "Quantitative Aptitude",
    slug: "quantitative-aptitude",
    details: "5 core topics",
    numberOfQuestions: "500+ Questions",
    description: "Master numerical and mathematical reasoning skills",
    isFeatured: true,
    detailsClass: 'text-secondary-dark',
    icon: "📊",
    subcategories: {
      "percentages": {
        name: "Percentages",
        slug: "percentages",
        icon: "%",
        description: "Master percentage calculations and real-world applications",
        estimatedTime: {
          easy: "2-3 min",
          medium: "3-4 min", 
          hard: "4-6 min"
        },
        questionCount: {
          easy: 25,
          medium: 20,
          hard: 15
        },
        topics: ["Basic percentage", "Percentage increase/decrease", "Successive percentages", "Applications"]
      },
      "profit-loss": {
        name: "Profit & Loss",
        slug: "profit-loss",
        icon: "💰",
        description: "Business mathematics and trading profit/loss concepts",
        estimatedTime: {
          easy: "2-3 min",
          medium: "4-5 min",
          hard: "5-7 min"
        },
        questionCount: {
          easy: 22,
          medium: 18,
          hard: 12
        },
        topics: ["Cost price & selling price", "Profit/loss percentage", "Discount problems", "Marked price"]
      },
      "simple-interest": {
        name: "Simple Interest",
        slug: "simple-interest",
        icon: "🏦",
        description: "Interest calculations and basic financial mathematics",
        estimatedTime: {
          easy: "2-3 min",
          medium: "3-5 min",
          hard: "5-8 min"
        },
        questionCount: {
          easy: 20,
          medium: 16,
          hard: 10
        },
        topics: ["Basic SI formula", "Time calculation", "Rate problems", "Principal finding"]
      },
      "time-work": {
        name: "Time & Work",
        slug: "time-work",
        icon: "⏰",
        description: "Work efficiency and collaborative task completion",
        estimatedTime: {
          easy: "3-4 min",
          medium: "4-6 min",
          hard: "6-8 min"
        },
        questionCount: {
          easy: 20,
          medium: 17,
          hard: 11
        },
        topics: ["Work rate", "Combined work", "Pipes & cisterns", "Efficiency problems"]
      },
      "ratios-proportions": {
        name: "Ratios & Proportions",
        slug: "ratios-proportions",
        icon: "⚖️",
        description: "Ratio calculations and proportional relationships",
        estimatedTime: {
          easy: "2-3 min",
          medium: "3-4 min",
          hard: "4-6 min"
        },
        questionCount: {
          easy: 24,
          medium: 19,
          hard: 13
        },
        topics: ["Basic ratios", "Proportion problems", "Partnership", "Mixture problems"]
      }
    }
  },
  {
    title: "Logical Reasoning",
    slug: "logical-reasoning",
    details: "5 core topics",
    numberOfQuestions: "400+ Questions", 
    description: "Develop logical thinking and analytical problem-solving",
    isFeatured: false,
    detailsClass: 'text-orange-600',
    icon: "🧠",
    subcategories: {
      "series-completion": {
        name: "Series Completion",
        slug: "series-completion",
        icon: "🔢",
        description: "Identify patterns in number and letter sequences",
        estimatedTime: {
          easy: "2-3 min",
          medium: "3-4 min",
          hard: "4-6 min"
        },
        questionCount: {
          easy: 25,
          medium: 20,
          hard: 12
        },
        topics: ["Number series", "Letter series", "Mixed series", "Fibonacci patterns"]
      },
      "coding-decoding": {
        name: "Coding-Decoding",
        slug: "coding-decoding",
        icon: "🔐",
        description: "Crack codes and decode hidden patterns",
        estimatedTime: {
          easy: "2-3 min",
          medium: "3-5 min", 
          hard: "5-7 min"
        },
        questionCount: {
          easy: 22,
          medium: 18,
          hard: 10
        },
        topics: ["Letter coding", "Number coding", "Symbol coding", "Mixed coding"]
      },
      "blood-relations": {
        name: "Blood Relations",
        slug: "blood-relations",
        icon: "👨‍👩‍👧‍👦",
        description: "Solve family relationship and kinship problems",
        estimatedTime: {
          easy: "2-3 min",
          medium: "3-4 min",
          hard: "4-6 min"
        },
        questionCount: {
          easy: 20,
          medium: 16,
          hard: 9
        },
        topics: ["Basic relations", "Complex relations", "Generation problems", "Gender identification"]
      },
      "direction-sense": {
        name: "Direction Sense",
        slug: "direction-sense",
        icon: "🧭",
        description: "Master spatial reasoning and direction finding",
        estimatedTime: {
          easy: "2-3 min",
          medium: "3-5 min",
          hard: "4-6 min"
        },
        questionCount: {
          easy: 18,
          medium: 15,
          hard: 8
        },
        topics: ["Basic directions", "Turning problems", "Distance calculation", "Shadow problems"]
      },
      "logical-puzzles": {
        name: "Logical Puzzles",
        slug: "logical-puzzles",
        icon: "🧩",
        description: "Challenge yourself with brain teasers and logic puzzles",
        estimatedTime: {
          easy: "4-5 min",
          medium: "6-8 min",
          hard: "8-12 min"
        },
        questionCount: {
          easy: 15,
          medium: 12,
          hard: 6
        },
        topics: ["Arrangement puzzles", "Logic games", "Grid puzzles", "Inference problems"]
      }
    }
  },
  {
    title: "Verbal Ability",
    slug: "verbal-ability",
    details: "5 core topics",
    numberOfQuestions: "450+ Questions",
    description: "Enhance language skills and reading comprehension",
    isFeatured: false,
    detailsClass: 'text-green-600',
    icon: "📝",
    subcategories: {
      "synonyms-antonyms": {
        name: "Synonyms & Antonyms",
        slug: "synonyms-antonyms",
        icon: "📚",
        description: "Build vocabulary with word relationships and meanings",
        estimatedTime: {
          easy: "1-2 min",
          medium: "2-3 min",
          hard: "3-4 min"
        },
        questionCount: {
          easy: 30,
          medium: 25,
          hard: 20
        },
        topics: ["Basic vocabulary", "Advanced words", "Context-based", "Technical terms"]
      },
      "sentence-correction": {
        name: "Sentence Correction",
        slug: "sentence-correction",
        icon: "✏️",
        description: "Master grammar rules and sentence structure",
        estimatedTime: {
          easy: "2-3 min",
          medium: "3-4 min", 
          hard: "4-5 min"
        },
        questionCount: {
          easy: 24,
          medium: 20,
          hard: 15
        },
        topics: ["Subject-verb agreement", "Tenses", "Articles & prepositions", "Sentence formation"]
      },
      "reading-comprehension": {
        name: "Reading Comprehension",
        slug: "reading-comprehension",
        icon: "📖",
        description: "Improve text analysis and understanding skills",
        estimatedTime: {
          easy: "5-7 min",
          medium: "7-10 min",
          hard: "10-15 min"
        },
        questionCount: {
          easy: 12,
          medium: 10,
          hard: 6
        },
        topics: ["Main idea", "Supporting details", "Inference", "Author's tone & purpose"]
      },
      "fill-in-blanks": {
        name: "Fill in the Blanks",
        slug: "fill-in-blanks",
        icon: "📝",
        description: "Complete sentences with appropriate words or phrases",
        estimatedTime: {
          easy: "1-2 min",
          medium: "2-3 min",
          hard: "3-4 min"
        },
        questionCount: {
          easy: 28,
          medium: 22,
          hard: 18
        },
        topics: ["Single blank", "Double blanks", "Grammar-based", "Vocabulary-based"]
      },
      "para-jumbles": {
        name: "Para Jumbles",
        slug: "para-jumbles",
        icon: "🔀",
        description: "Arrange jumbled sentences in logical order",
        estimatedTime: {
          easy: "3-4 min",
          medium: "4-6 min",
          hard: "6-8 min"
        },
        questionCount: {
          easy: 16,
          medium: 14,
          hard: 10
        },
        topics: ["4-sentence jumbles", "5-sentence jumbles", "Story sequences", "Logical flow"]
      }
    }
  },
  {
    title: "Mock Tests",
    slug: "mock-tests",
    details: "Full-length practice tests",
    numberOfQuestions: "1000+ Questions",
    description: "Complete exam simulation with all topics combined",
    isFeatured: false,
    detailsClass: 'text-purple-600',
    icon: "🎯",
    subcategories: {
      "full-mock-tests": {
        name: "Full Mock Tests",
        slug: "full-mock-tests",
        icon: "📋",
        description: "Complete aptitude tests covering all subjects",
        estimatedTime: {
          easy: "60 min",
          medium: "90 min",
          hard: "120 min"
        },
        questionCount: {
          easy: 50,
          medium: 75,
          hard: 100
        },
        topics: ["Mixed aptitude", "Time-bound", "Real exam pattern", "Performance analysis"]
      }
    }
  }
];
















































// export const topicsData = [
//   {
//     title: "Quantitative Aptitude",
//     slug: "quantitative-aptitude", // Added slug
//     details: "20+ topics ",
//     numberOfQuestions: "1000+ Questions",
//     description: "Practice MCQs for banking sector exams.",
//     isFeatured: true,
//     detailsClass: 'text-secondary-dark'
//   },
//   {
//     title: "Logical Reasoning",
//     slug: "logical-reasoning", // Added slug
//     details: "20+ topics ",
//     numberOfQuestions: "1000+ Questions",
//     description: "Practice MCQs for banking sector exams.",
//     isFeatured: false,
//     detailsClass: 'text-orange-600'
//   },
//   {
//     title: "Verbal Ability",
//     slug: "verbal-ability", // Added slug
//     details: "15+ topics ",
//     numberOfQuestions: "1000+ Questions",
//     description: "Practice MCQs for banking sector exams.",
//   },
//   {
//     title: "Mock Tests",
//     slug: "mock-tests", // Added slug
//     details: "10+ topics ",
//     numberOfQuestions: "1000+ Questions",
//     description: "Practice MCQs for banking sector exams.",
//   }
// ];
