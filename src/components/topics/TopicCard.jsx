import React from 'react'
import { Link } from 'react-router-dom'
import Button from '../ui/Button';
import { HugeiconsIcon } from '@hugeicons/react'
import {Book04Icon,HelpCircleIcon} from '@hugeicons/core-free-icons';

export default function TopicCard({ topic, questionCount = null }) {
  const { title, details, description, slug } = topic;

  return (
    <div className="motion-card group h-full bg-white dark:bg-surface rounded-xl p-8 border border-[#EAEAEA] dark:border-border">
      {/* Title */}
      <h2 className="text-2xl font-semibold text-text-strong mb-3 leading-tight">
        {title}
      </h2>

      {/* Description */}
      <p className="text-base text-text mb-6 leading-relaxed">
        {description}
      </p>

      {/* Stats */}
      <div className="flex items-center gap-6 mb-8">
        <div className="flex items-center gap-2">
          <HugeiconsIcon
            icon={Book04Icon}
            className="w-5 h-5 text-primary"
          />
          <span className="text-sm font-medium text-text-strong">{details}</span>
        </div>

        <div className="flex items-center gap-2">
          <HugeiconsIcon
            icon={HelpCircleIcon}
            className="w-5 h-5 text-primary"
          />
          <span className="text-sm font-medium text-text-strong">
            {questionCount === null ? 'Loading…' : `${questionCount} Questions`}
          </span>
        </div>
      </div>

      {/* CTA Button */}
      <Link to={`/practice/${slug}`}>
        <Button />
      </Link>
    </div>
  );
}
