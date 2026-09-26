export const companiesData = [
  {
    id: 'tcs',
    name: 'TCS',
    // Shown under the name only where it actually expands an acronym the
    // visitor is likely to recognise by its short form.
    fullName: 'Tata Consultancy Services',
    monogram: 'TCS',
    description:
      'Quant, reasoning and verbal practice built around the TCS recruitment pattern, with timed sets for every section.',
    color: 'blue',
    slug: 'tcs',
  },
  {
    id: 'wipro',
    name: 'Wipro',
    monogram: 'WIP',
    description:
      'Work through quant, reasoning and verbal questions in the format this test uses, then check your speed and accuracy.',
    color: 'purple',
    slug: 'wipro',
  },
  {
    id: 'cognizant',
    name: 'Cognizant',
    monogram: 'COG',
    description:
      'Practice the sections that come up in this test at your own pace, then finish with a full-length simulation.',
    color: 'green',
    slug: 'cognizant',
  },
  {
    id: 'infosys',
    name: 'Infosys',
    monogram: 'INFY',
    description:
      'Section-by-section aptitude practice for this test, with your speed and accuracy tracked after every set.',
    color: 'cyan',
    slug: 'infosys',
  },
  {
    id: 'ltimindtree',
    name: 'LTIMindtree',
    monogram: 'LTM',
    description:
      'Quant, logical reasoning and verbal practice that follows the structure of this test, start to finish.',
    color: 'indigo',
    slug: 'ltimindtree',
  },
  {
    id: 'hcl',
    name: 'HCL',
    fullName: 'HCL Technologies',
    monogram: 'HCL',
    description:
      'Build familiarity with the format under timed conditions, then run a full-length mock to see where you stand.',
    color: 'red',
    slug: 'hcl',
  },
  // Add more companies here in future.
  // `difficulty` was removed: it read "Intermediate" on all six cards, so it
  // carried no information. Re-add it per company once real values exist.
];
