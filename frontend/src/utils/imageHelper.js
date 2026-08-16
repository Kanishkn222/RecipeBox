const FALLBACK_MAP = [
  { keywords: ['risotto', 'mushroom'], url: 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?w=800' },
  { keywords: ['shakshuka', 'egg'], url: 'https://images.unsplash.com/photo-1590412200988-a436970781fa?w=800' },
  { keywords: ['jollof', 'rice'], url: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800' },
  { keywords: ['cacio', 'pepe', 'pasta'], url: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281292?w=800' },
  { keywords: ['chana', 'masala', 'curry'], url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800' },
  { keywords: ['taco', 'bean', 'mexican'], url: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800' },
  { keywords: ['salmon', 'miso'], url: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800' },
  { keywords: ['soup', 'onion'], url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800' },
  { keywords: ['skewer', 'chicken', 'grilled'], url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800' },
  { keywords: ['shrimp', 'scampi'], url: 'https://images.unsplash.com/photo-1551248429-40975aa4de74?w=800' },
  { keywords: ['pork', 'bbq', 'pulled'], url: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=800' },
  { keywords: ['lasagna'], url: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=800' },
  { keywords: ['burger'], url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800' },
  { keywords: ['salad'], url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800' },
  { keywords: ['cookie', 'baking'], url: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800' },
];

export const DEFAULT_FOOD_IMAGE = 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800';

export const getFallbackImage = (title = '') => {
  if (!title) return DEFAULT_FOOD_IMAGE;
  const lower = title.toLowerCase();
  const match = FALLBACK_MAP.find(item => item.keywords.some(k => lower.includes(k)));
  return match ? match.url : DEFAULT_FOOD_IMAGE;
};

export const handleImageError = (e, title = '') => {
  e.target.onerror = null;
  e.target.src = getFallbackImage(title);
};
