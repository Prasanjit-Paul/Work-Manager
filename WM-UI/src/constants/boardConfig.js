export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080').replace(/\/$/, '');
export const API = `${API_BASE_URL}/tasks`;

export const INK = '#1b1033';
export const hard = (n = 4) => `${n}px ${n}px 0 ${INK}`;

export const stages = [
  { key: 'DRAFT', label: 'Draft', color: '#f1e3c0' },
  { key: 'IN PROGRESS', label: 'In progress', color: '#b7e9f3' },
  { key: 'DONE', label: 'Done', color: '#d9f1d3' },
];

export const importanceColor = {
  'Main Task': '#ff5da2',
  'Secondary Task': '#c9b6ff',
  'Tertiary Task': '#fff3b0',
};

export const fieldSx = {
  bgcolor: '#fff',
  borderRadius: '10px',
  boxShadow: hard(4),
  minWidth: { xs: '100%', md: 200 },
  '& input': { color: INK, fontWeight: 500 },
  '& .MuiSelect-select': { color: INK, fontWeight: 600 },
  '& .MuiOutlinedInput-notchedOutline': { border: `3px solid ${INK}`, borderRadius: '10px' },
  '&:hover .MuiOutlinedInput-notchedOutline, &.Mui-focused .MuiOutlinedInput-notchedOutline': {
    border: `3px solid ${INK}`,
  },
};