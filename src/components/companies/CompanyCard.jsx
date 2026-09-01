import React from 'react'
import { Link } from 'react-router-dom'
import { HugeiconsIcon } from '@hugeicons/react'
import { Book04Icon, TargetIcon } from '@hugeicons/core-free-icons'

export default function CompanyCard({ company, questionCount = null }) {
  const { name, fullName, description, difficulty, slug } = company;

  // Company color mapping
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-100',
    red: 'bg-red-50 border-red-100',
    purple: 'bg-purple-50 border-purple-100',
    indigo: 'bg-indigo-50 border-indigo-100',
  };

  const logoColorClasses = {
    blue: 'bg-blue-100 text-blue-700',
    red: 'bg-red-100 text-red-700',
    purple: 'bg-purple-100 text-purple-700',
    indigo: 'bg-indigo-100 text-indigo-700',
  };

  const companyColor = company.color || 'blue';

  return (
    <div className={`group bg-white dark:bg-surface rounded-xl p-6 border border-gray-100 dark:border-border shadow-sm hover:shadow-md transition-all duration-300 ${colorClasses[companyColor]}`}>
      {/* Company Logo / Badge */}
      <div className={`inline-flex items-center justify-center w-14 h-14 rounded-lg ${logoColorClasses[companyColor]} mb-4 font-bold text-xl`}>
        {name}
      </div>

      {/* Company Name */}
      <h3 className="text-xl font-bold text-gray-900 mb-1">
        {name}
      </h3>

      {/* Full Name */}
      <p className="text-sm text-gray-600 mb-3">
        {fullName}
      </p>

      {/* Description */}
      <p className="text-base text-gray-700 mb-6 leading-relaxed h-16 overflow-hidden line-clamp-3">
        {description}
      </p>

      {/* Stats */}
      <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <HugeiconsIcon
            icon={Book04Icon}
            className="w-4 h-4 text-lime-500"
          />
          <span className="text-xs font-medium text-gray-600">
            {questionCount === null ? 'Loading…' : `${questionCount} Questions`}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <HugeiconsIcon
            icon={TargetIcon}
            className="w-4 h-4 text-lime-500"
          />
          <span className="text-xs font-medium text-gray-600">{difficulty}</span>
        </div>
      </div>

      {/* CTA Button */}
      <Link to={`/practice/company/${slug}`} className="w-full">
        <button className="w-full px-6 py-3 bg-lime-400 text-white dark:text-[#17210a] font-bold rounded-lg shadow-md shadow-lime-500/20 hover:bg-lime-500 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
          Start Practice
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </Link>
    </div>
  );
}
