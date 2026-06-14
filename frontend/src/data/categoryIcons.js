// categoryIcons.js
// Category -> icon mapping for consistent UI across dropdown + chips.

export const categoryIconMap = {
  All: '🌐',
  Jewelry: '💍',
  Pottery: '🏺',
  Textiles: '🧵',
  Woodwork: '🪵',
  Handicrafts: '🎨',
  Glasswork: '🧪',
};

export function getCategoryIcon(category) {
  return categoryIconMap[category] || '✨';
}

