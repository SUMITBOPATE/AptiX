import {
  AbacusIcon,
  BalanceScaleIcon,
  BankIcon,
  BinaryCodeIcon,
  BirthdayCakeIcon,
  BoardMathIcon,
  BookOpen01Icon,
  Brain01Icon,
  Brain02Icon,
  Brain03Icon,
  CalculateIcon,
  CalculatorIcon,
  Calendar01Icon,
  CarTimeIcon,
  ChartAverageIcon,
  ChartBarLineIcon,
  ChartHistogramIcon,
  ChartLineData01Icon,
  Chat01Icon,
  ChatQuestionIcon,
  CheckListIcon,
  CodeIcon,
  CoinsSwapIcon,
  Compass01Icon,
  DiceFaces01Icon,
  DivideSignIcon,
  Flowchart01Icon,
  GridViewIcon,
  JarIcon,
  LanguageSkillIcon,
  LanguageSquareIcon,
  LayoutGridIcon,
  MathIcon,
  MoneyBag02Icon,
  NoteEditIcon,
  PathfinderDivideIcon,
  PercentCircleIcon,
  PuzzleIcon,
  QuillWrite01Icon,
  QuotesIcon,
  RulerIcon,
  SailboatCoastalIcon,
  ShapesIcon,
  ShuffleIcon,
  ShuffleSquareIcon,
  TextCheckIcon,
  Time01Icon,
  TimeScheduleIcon,
  Train01Icon,
  TranslateIcon,
  UserGroupIcon,
} from '@hugeicons/core-free-icons';
import { canonicalSlug } from '../../lib/subtopics';

// One icon per subcategory. Declared topics and generated subcategories share
// this map, keyed by the same canonical slug used to match questions.
const SUBCATEGORY_ICONS = {
  // Broad categories (company practice cards)
  'all': GridViewIcon,
  'quantitative': BoardMathIcon,
  'reasoning': Brain01Icon,
  'verbal': Chat01Icon,

  // Quantitative
  'percentages': PercentCircleIcon,
  'profit-loss': MoneyBag02Icon,
  'simple-interest': BankIcon,
  'compound-interest': CoinsSwapIcon,
  'time-work': Time01Icon,
  'time-speed-distance': CarTimeIcon,
  'ratios-proportions': BalanceScaleIcon,
  'ratio-and-proportion': BalanceScaleIcon,
  'average': ChartAverageIcon,
  'mensuration-geometry': ShapesIcon,
  'mensuration': RulerIcon,
  'number-system': BinaryCodeIcon,
  'number-series': ChartLineData01Icon,
  'quantitative-aptitude': CalculatorIcon,
  'simplification': AbacusIcon,
  'quant-other': MathIcon,
  'problems-on-ages': Calendar01Icon,
  'age': BirthdayCakeIcon,
  'elementary-statistics': ChartHistogramIcon,
  'mixture-alligation': JarIcon,
  'data-interpretation': ChartBarLineIcon,
  'permutation-and-combination': ShuffleSquareIcon,
  'probability': DiceFaces01Icon,
  'divisibility': PathfinderDivideIcon,
  'hcf-and-lcm': DivideSignIcon,
  'quadratic-equations': CalculateIcon,
  'train': Train01Icon,
  'boats-and-streams': SailboatCoastalIcon,
  'oops-concepts': ChatQuestionIcon,

  // Reasoning
  'series-completion': ChartLineData01Icon,
  'coding-decoding': CodeIcon,
  'blood-relations': UserGroupIcon,
  'direction-sense': Compass01Icon,
  'logical-puzzles': PuzzleIcon,
  'logical-reasoning': Brain02Icon,
  'reasoning-other': Brain03Icon,
  'data-sufficiency': CheckListIcon,
  'statement-assumption': ChatQuestionIcon,
  'syllogisms': Flowchart01Icon,
  'arrangement-scheduling': TimeScheduleIcon,

  // Verbal
  'synonyms-antonyms': LanguageSkillIcon,
  'sentence-correction': TextCheckIcon,
  'error-spotting': TextCheckIcon,
  'reading-comprehension': BookOpen01Icon,
  'fill-in-blanks': NoteEditIcon,
  'para-jumbles': ShuffleIcon,
  'verbal-other': Chat01Icon,
  'idioms-phrases': QuotesIcon,
  'grammar': LanguageSquareIcon,
  'one-word-substitution': TranslateIcon,
  'spelling': QuillWrite01Icon,
};

const DEFAULT_ICON = LayoutGridIcon;

// Generated subcategories drop a trailing "s" when they are grouped, so a key
// like "number-series" is stored as "number-serie". Try the plural back too.
export const getSubtopicIcon = (slug) => {
  const canonical = canonicalSlug(slug);

  return (
    SUBCATEGORY_ICONS[canonical] ??
    SUBCATEGORY_ICONS[`${canonical}s`] ??
    SUBCATEGORY_ICONS[`${canonical}es`] ??
    DEFAULT_ICON
  );
};
