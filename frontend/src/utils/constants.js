export const TOPICS = {
  ai: { label: 'Artificial Intelligence', keywords: ['ai', 'artificial intelligence', 'machine learning', 'chatgpt', 'openai', 'llm', 'deepmind', 'gemini'] },
  tech: { label: 'Technology', keywords: ['tech', 'apple', 'google', 'microsoft', 'meta', 'amazon', 'silicon valley', 'startup'] },
  economy: { label: 'Global Economy', keywords: ['economy', 'market', 'stocks', 'inflation', 'gdp', 'recession', 'federal reserve', 'interest rate', 'finance', 'trading'] },
  climate: { label: 'Climate & Environment', keywords: ['climate', 'environment', 'carbon', 'renewable', 'solar', 'ev', 'electric vehicle', 'emission', 'green'] },
  geopolitics: { label: 'Geopolitics', keywords: ['war', 'conflict', 'ukraine', 'china', 'russia', 'nato', 'sanctions', 'diplomacy', 'geopolit'] },
  health: { label: 'Health & Medicine', keywords: ['health', 'covid', 'vaccine', 'cancer', 'fda', 'who', 'disease', 'hospital', 'drug', 'medicine'] },
  space: { label: 'Space & Science', keywords: ['space', 'nasa', 'spacex', 'mars', 'moon', 'satellite', 'rocket', 'astronomy', 'science'] },
  crypto: { label: 'Cryptocurrency', keywords: ['crypto', 'bitcoin', 'ethereum', 'blockchain', 'defi', 'nft', 'web3', 'solana'] },
  business: { label: 'Business', keywords: ['business', 'ceo', 'merger', 'acquisition', 'ipo', 'earnings', 'revenue', 'profit', 'company'] },
};

export const INTROS = {
  ai: "Here's what I'm seeing across AI and technology news right now:",
  economy: "Here's the latest from global financial markets and economic indicators:",
  tech: "Here's what's making headlines in the technology sector:",
  climate: "Here's the latest on climate, energy, and environmental news:",
  space: "Here's what's happening in space exploration and science:",
  crypto: "Here's the current state of the cryptocurrency market:",
  health: "Here's what's trending in health, medicine, and life sciences:",
  geopolitics: "Here's an overview of current geopolitical developments:",
  business: "Here's the latest in corporate news and business intelligence:",
  default: "I've analysed recent coverage across multiple sources. Here's what I found:",
};

export const TRENDING_DATA = [
  { key: 'ai', emoji: '◎', count: '12.4K articles', volume: '+34%', accent: 'var(--sage)' },
  { key: 'tech', emoji: '◈', count: '9.8K articles', volume: '+18%', accent: 'var(--dust)' },
  { key: 'economy', emoji: '◇', count: '8.2K articles', volume: '+12%', accent: 'var(--gold)' },
  { key: 'geopolitics', emoji: '◉', count: '7.6K articles', volume: '+9%', accent: 'var(--rust)' },
  { key: 'climate', emoji: '◌', count: '6.1K articles', volume: '+22%', accent: 'var(--sage-light)' },
  { key: 'health', emoji: '◍', count: '5.9K articles', volume: '+15%', accent: 'var(--stone-2)' },
  { key: 'space', emoji: '◎', count: '4.3K articles', volume: '+41%', accent: 'var(--dust)' },
  { key: 'crypto', emoji: '◐', count: '5.5K articles', volume: '+27%', accent: 'var(--gold)' },
  { key: 'business', emoji: '◑', count: '10.1K articles', volume: '+8%', accent: 'var(--sage)' },
];
