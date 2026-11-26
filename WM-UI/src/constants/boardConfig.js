export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5134').replace(/\/$/, '');
export const API = `${API_BASE_URL}/tasks`;

/* ---------- Pastel Bento tokens ---------- */
export const INK = '#25294a';
export const MUTED = '#7a80a8';
export const PAGE_BG = '#eef1f8';
export const TINT = '#f1f4fb'; // field / row background when sitting on a white card
export const FONT = "'Nunito', system-ui, -apple-system, 'Segoe UI', sans-serif";
export const SHADOW = '0 6px 16px rgba(37, 41, 74, 0.08)';

export const stages = [
  { key: 'DRAFT', label: 'Draft', color: '#ffe3ec', bar: '#ff9db9' },
  { key: 'IN PROGRESS', label: 'In progress', color: '#dfe9ff', bar: '#8fb0ff' },
  { key: 'DONE', label: 'Done', color: '#dcf5e7', bar: '#6fd3a0' },
];

export const importanceColor = {
  'Main Task': '#ffc2d4',
  'Secondary Task': '#cfd9ff',
  'Tertiary Task': '#fff0b8',
};

export const importanceBar = {
  'Main Task': '#ff9db9',
  'Secondary Task': '#a9b9ff',
  'Tertiary Task': '#ffd966',
};

/* white tile used for reports, team, profile, auth */
export const cardSx = {
  bgcolor: '#fff',
  borderRadius: '32px',
  boxShadow: SHADOW,
  p: 3,
};

export const chipSx = (bg) => ({
  bgcolor: bg,
  color: INK,
  fontFamily: FONT,
  fontWeight: 700,
});

/* inputs + select: white, borderless, 52px, soft focus outline */
export const controlSx = {
  bgcolor: '#fff',
  borderRadius: '18px',
  boxShadow: SHADOW,
  height: 52,
  fontFamily: FONT,
  '& .MuiOutlinedInput-root': {
    height: 52,
    borderRadius: '18px',
    color: INK,
    fontFamily: FONT,
    fontWeight: 700,
  },
  '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
  '& input::placeholder, & textarea::placeholder': { color: MUTED, opacity: 1, fontWeight: 400 },
  '& .MuiSelect-select': { color: INK, fontWeight: 700 },
  '& .MuiSvgIcon-root': { color: INK },
  '&:focus-within': { outline: `2px solid ${INK}`, outlineOffset: 0 },
};

export const fieldSx = { ...controlSx, flex: '1 1 220px', maxWidth: 320 };

export const primaryBtnSx = {
  height: 52,
  px: 4,
  bgcolor: INK,
  color: '#fff',
  fontFamily: FONT,
  fontWeight: 800,
  fontSize: 15,
  textTransform: 'none',
  borderRadius: '18px',
  boxShadow: 'none',
  '&:hover': { bgcolor: '#3a3f6b', boxShadow: 'none' },
  '&.Mui-disabled': { bgcolor: '#a9adc7', color: '#fff' },
  '&.Mui-focusVisible': { outline: `2px solid ${INK}`, outlineOffset: 3 },
};