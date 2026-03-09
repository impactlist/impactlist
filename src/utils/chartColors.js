import { categoriesById } from '../data/generatedData';

export const CATEGORY_COLOR_PALETTE = [
  '#2563eb',
  '#059669',
  '#d97706',
  '#dc2626',
  '#7c3aed',
  '#0891b2',
  '#eab308',
  '#c2410c',
  '#db2777',
  '#1d4ed8',
  '#0f766e',
  '#ea580c',
  '#65a30d',
  '#be123c',
  '#7c2d12',
  '#5b3a29',
];

const SORTED_CATEGORY_IDS = Object.keys(categoriesById).sort();

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const hexToRgb = (hex) => {
  const normalized = hex.replace('#', '');
  const value = parseInt(normalized, 16);
  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
};

const rgbToHex = ({ r, g, b }) => {
  return `#${[r, g, b].map((channel) => clamp(Math.round(channel), 0, 255).toString(16).padStart(2, '0')).join('')}`;
};

const mixColors = (colorA, colorB, ratio) => {
  const a = hexToRgb(colorA);
  const b = hexToRgb(colorB);

  return rgbToHex({
    r: a.r + (b.r - a.r) * ratio,
    g: a.g + (b.g - a.g) * ratio,
    b: a.b + (b.b - a.b) * ratio,
  });
};

export const getCategoryColor = (categoryId) => {
  if (!categoryId) return CATEGORY_COLOR_PALETTE[0];

  const index = SORTED_CATEGORY_IDS.indexOf(categoryId);
  if (index >= 0) {
    return CATEGORY_COLOR_PALETTE[index % CATEGORY_COLOR_PALETTE.length];
  }

  const fallbackIndex = Array.from(categoryId).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return CATEGORY_COLOR_PALETTE[fallbackIndex % CATEGORY_COLOR_PALETTE.length];
};

export const getCategoryVariantColor = (categoryId, variantIndex = 0) => {
  const baseColor = getCategoryColor(categoryId);
  if (variantIndex <= 0) return baseColor;

  const variantCycle = [0.18, -0.14, 0.32, -0.26];
  const ratio = variantCycle[(variantIndex - 1) % variantCycle.length];

  return ratio > 0 ? mixColors(baseColor, '#ffffff', ratio) : mixColors(baseColor, '#111827', Math.abs(ratio));
};
