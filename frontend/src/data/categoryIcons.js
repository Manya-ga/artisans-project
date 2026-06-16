// categoryIcons.js
// Category -> icon mapping for consistent UI across dropdown + chips.

export const categoryIconMap = {
  'All': '🌐',
  'Madhubani Painting': '🎨',
  'Handloom Textiles': '🧵',
  'Blue Pottery': '🏺',
  'Terracotta Art': '🏺',
  'Wood Carving': '🪵',
  'Hand Embroidery': '🪡',
  'Bamboo Crafts': '🎋',
  'Metalwork': '⚒️',
};

export function getCategoryIcon(category) {
  return categoryIconMap[category] || '✨';
}
