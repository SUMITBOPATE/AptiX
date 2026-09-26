/**
 * Decorative quiz-card row for the hero.
 *
 * Strictly presentational. The whole row is `aria-hidden` and
 * `pointer-events-none`: no buttons, no links, no hover states, no selected
 * state, and no "tap an answer" affordance — it has to read as a floating UI
 * mockup, not as something you can touch.
 *
 * There is deliberately no animation. The hero renders on every landing-page
 * visit, which puts it in the high-frequency tier where motion should be
 * reduced to nothing; the depth here comes from static composition
 * (scale, rotation, offset, overlap, surface ramp) instead.
 */

// Real categories and subtopics from data/topicData.js, with questions whose
// stated answers are actually correct.
const CARDS = [
  {
    category: 'Quantitative',
    topic: 'Percentages',
    difficulty: 'Easy',
    question: 'A shirt is marked at 1,200 and discounted by 25%. What is the selling price?',
    options: ['850', '900', '950', '1,100'],
  },
  {
    category: 'Reasoning',
    topic: 'Series',
    difficulty: 'Medium',
    question: 'Complete the series: 3, 6, 12, 24, ... ?',
    options: ['30', '36', '42', '48'],
  },
  {
    category: 'Quantitative',
    topic: 'Time & Work',
    difficulty: 'Medium',
    question: 'A finishes a job in 12 days, B in 18. Working together, how long do they take?',
    options: ['6 days', '7.2 days', '8 days', '9 days'],
  },
  {
    category: 'Verbal',
    topic: 'Synonyms',
    difficulty: 'Medium',
    question: "Choose the word most nearly opposite in meaning to 'candid'.",
    options: ['frank', 'guarded', 'honest', 'blunt'],
  },
  {
    category: 'Reasoning',
    topic: 'Blood Relations',
    difficulty: 'Easy',
    question: "Meera said of a photo, 'His mother is the only daughter of my mother.' How is he related to her?",
    options: ['Brother', 'Cousin', 'Father', 'Uncle'],
  },
];

/**
 * Composition only — a straight horizontal run, never an arc. The three tiers
 * recede by surface value, content opacity and scale together; the surfaces
 * stay fully opaque so overlapping cards never bleed through each other.
 *
 * `wideOnly` cards only render at xl and up. The decorative rails in App.jsx
 * are `w-10` (40px) fixed at each edge, and five cards at a width that can
 * still hold a question plus a 2x2 option grid need ~1132px. That does not fit
 * between the rails until 1280px, so below xl the row shows the symmetric
 * three-card set and the outer pair joins at xl.
 */
const LAYOUT = [
  // outermost — reads first as a deck edge, not as a card you would read
  { surface: 'outer', offsetY: 36, rotate: -6.5, scale: 0.82, content: 0.62, z: 1, wideOnly: true },
  { surface: 'mid', offsetY: 14, rotate: -2.4, scale: 0.93, content: 0.86, z: 3, wideOnly: false },
  // the one main card
  { surface: 'center', offsetY: 0, rotate: 0, scale: 1, content: 1, z: 5, wideOnly: false },
  { surface: 'mid', offsetY: 18, rotate: 2.6, scale: 0.92, content: 0.82, z: 3, wideOnly: false },
  { surface: 'outer', offsetY: 40, rotate: 6.5, scale: 0.81, content: 0.58, z: 1, wideOnly: true },
];

const SURFACES = {
  /* These three are deliberately NOT theme tokens. They are a fixed charcoal
     set so the row reads as a set of floating UI mockups against any page
     background, and they sit at ~1.1:1 against --color-bg on purpose — the
     border, the drop shadow and the centre card's lime glow do the separating,
     which is how the reference image reads. Tokenising them would make the
     cards change colour with the theme and lose that read. */
  outer: 'bg-[#3f443f] dark:bg-[#1b1f18] border-white/[0.05]',
  mid: 'bg-[#20241f] dark:bg-[#1e221c] border-white/[0.07]',
  center: 'bg-[#171a18] border-white/[0.10]',
};

export default function FloatingQuizCards() {
  return (
    /* Sizing to the container rather than 100vw. The previous
       `relative left-1/2 -translate-x-1/2` full-bleed trick double-counted the
       centring: `left` on a relatively positioned element is an offset from the
       static position, which the parent's `items-center` had already centred —
       so the row landed 48px off the left edge on a 1280px viewport, leaving a
       bare gap on the right. The container is already viewport-centred
       (mx-auto plus symmetric padding), so w-full is centred at every width,
       and the cards have to clear the rails anyway. */
    <div
      aria-hidden="true"
      className="pointer-events-none relative z-0 mt-6 w-full select-none sm:mt-8"
    >
      <div className="quiz-row-mask overflow-hidden">
        {/* The container's own edge already sits inside the 40px rails (main
            has px-12, rails are w-10), so px-4 is just breathing room. */}
        <div className="flex w-full items-start justify-center px-4">
          {CARDS.map((card, i) => {
            const layout = LAYOUT[i];
            const isCenter = layout.surface === 'center';

            return (
              <div
                key={card.topic}
                style={{
                  translate: `0 ${layout.offsetY}px`,
                  rotate: `${layout.rotate}deg`,
                  scale: layout.scale,
                  zIndex: layout.z,
                }}
                /* The overlap must only ever sit BETWEEN two cards that are both
                   rendered. A negative marginLeft on the first *visible* item
                   shrinks its outer box but drags its border box left of the flex
                   line, so justify-center lands the row 26px left of true centre.
                   Card 1 is the first visible card below xl (card 0 is
                   `hidden xl:block`), so only it needs the margin deferred. */
                className={`relative shrink-0 w-[230px] md:w-[236px] lg:w-[250px] xl:w-[264px] 2xl:w-[286px] ${
                  i === 0 ? '' : i === 1 ? 'xl:-ml-[52px]' : '-ml-[52px]'
                } ${layout.wideOnly ? 'hidden xl:block' : ''}`}
              >
                <div
                  className={`relative overflow-hidden rounded-2xl border shadow-[0_18px_40px_-18px_rgb(0_0_0/0.55)] ${
                    isCenter
                      ? 'shadow-[0_28px_60px_-22px_rgb(0_0_0/0.7),0_0_0_1px_rgb(163_230_53/0.16),0_0_64px_-28px_rgb(163_230_53/0.4)]'
                      : ''
                  } ${SURFACES[layout.surface]}`}
                  style={{ opacity: layout.content }}
                >
                  {/* bookmark tab — decorative chrome, matching the reference */}
                  <span className="absolute left-1/2 top-0 h-3 w-5 -translate-x-1/2 rounded-b-md bg-lime-400/80" />

                  <div className="px-4 pt-5 pb-4">
                    <div className="mb-2.5 flex items-center justify-between gap-2">
                      <span className="rounded-full bg-lime-400/15 px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-wide text-lime-300">
                        {card.category}
                      </span>
                      <span className="text-[0.625rem] font-medium text-white/50">
                        {card.difficulty}
                      </span>
                    </div>

                    <p className="mb-3 truncate text-[0.6875rem] text-white/55">
                      {card.topic}
                    </p>

                    <p className="mb-4 line-clamp-3 min-h-[3.75rem] text-[0.8125rem] font-medium leading-snug text-white/90">
                      {card.question}
                    </p>

                    {/* Uniform options: no hover, no selected state, nothing
                        that implies the card is live. */}
                    <div className="grid grid-cols-2 gap-2">
                      {card.options.map((option, index) => (
                        <div
                          key={option}
                          className="flex items-center gap-1.5 rounded-lg border border-white/[0.07] bg-white/[0.03] px-2 py-1.5"
                        >
                          <span className="text-[0.5625rem] font-bold text-lime-400/80">
                            {String.fromCharCode(65 + index)}
                          </span>
                          <span className="truncate text-[0.6875rem] text-white/65">
                            {option}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
