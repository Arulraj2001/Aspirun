interface KeywordLink {
  keyword: string;
  route: string;
}

const DEFAULT_MAPS: KeywordLink[] = [
  { keyword: 'mock test', route: '/mock-tests' },
  { keyword: 'mock tests', route: '/mock-tests' },
  { keyword: 'study material', route: '/materials' },
  { keyword: 'study materials', route: '/materials' },
  { keyword: 'current affairs', route: '/current-affairs' },
  { keyword: 'timetables', route: '/study-planner' },
  { keyword: 'study plans', route: '/study-planner' },
  { keyword: 'daily quiz', route: '/daily-quiz' },
];

export function injectInternalLinks(text: string, customMaps: KeywordLink[] = []): string {
  const maps = [...DEFAULT_MAPS, ...customMaps];
  let processed = text;

  // Sort keywords by length descending to prevent shorter matches inside longer matches (e.g., 'mock test' inside 'mock tests')
  const sortedMaps = [...maps].sort((a, b) => b.keyword.length - a.keyword.length);

  sortedMaps.forEach(({ keyword, route }) => {
    // Matches the keyword only if not already wrapped in standard Markdown brackets/parentheses [Anchor](URL)
    const regex = new RegExp(`(?<!\\[)\\b${keyword}\\b(?!\\]|\\([^)]*\\))`, 'gi');
    processed = processed.replace(regex, (match) => {
      return `[${match}](${route})`;
    });
  });

  return processed;
}
