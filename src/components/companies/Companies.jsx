import CompanyCard from './CompanyCard'
import { companiesData } from '../../../data/companies'
import { HugeiconsIcon } from '@hugeicons/react'
import { Briefcase01Icon } from '@hugeicons/core-free-icons'


export default function Companies({ questionCounts = null, isStatsLoading = false }) {
  return (
    <section id="companies-section" className="theme-content-background scroll-mt-20 py-24">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-[2px] w-6 bg-lime-500"></div>
            <span className="font-semibold text-sm uppercase tracking-[0.2em] text-accent-ink">Placement Partners</span>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
            Company Specific Tests
          </h2>
          <p className="text-gray-600 text-lg">
            Practice company-specific aptitude tests and prepare for your dream job
          </p>
        </div>

        {/* No <Reveal> here either — same reasoning as the topics grid. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {companiesData.map((company) => (
            <CompanyCard key={company.id} company={company} questionCount={questionCounts?.[company.name] ?? null} isStatsLoading={isStatsLoading} />
          ))}
        </div>

        {/* Info Box — plain, to match the cards above it. */}
        <div className="mt-8 flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-6 dark:border-border dark:bg-surface">
          <div className="flex-shrink-0">
            <HugeiconsIcon
              icon={Briefcase01Icon}
              className="w-6 h-6 text-accent-ink mt-1"
              aria-hidden="true"
            />
          </div>
          <div>
            <p className="text-sm text-gray-700 dark:text-text">
              <span className="font-semibold text-gray-900 dark:text-text-strong">More companies coming soon!</span> We're constantly adding new companies to help you practice for your dream role. Each test is designed to match the actual recruitment patterns used by these organizations.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
