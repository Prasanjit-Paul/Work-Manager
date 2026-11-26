import { Box, Typography, TextField } from '@mui/material';
import { INK, MUTED, TINT, FONT, controlSx } from '../constants/boardConfig';

/* Labelled input for forms that sit on a white card (auth, profile). */
export default function Field({ label, multiline = false, rows = 3, sx, ...props }) {
  const root = multiline
    ? { height: 'auto', py: 1.2, alignItems: 'flex-start' }
    : {};
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8, minWidth: 0, ...sx }}>
      <Typography sx={{ fontFamily: FONT, fontSize: 13, fontWeight: 800, color: INK, ml: 0.5 }}>
        {label}
      </Typography>
      <TextField
        fullWidth
        multiline={multiline}
        rows={multiline ? rows : undefined}
        {...props}
        sx={{
          ...controlSx,
          bgcolor: TINT,
          boxShadow: 'none',
          height: multiline ? 'auto' : 52,
          '& .MuiOutlinedInput-root': { ...controlSx['& .MuiOutlinedInput-root'], ...root, height: multiline ? 'auto' : 52 },
          '& .Mui-disabled': { WebkitTextFillColor: MUTED },
        }}
        slotProps={{ htmlInput: { 'aria-label': label } }}
      />
    </Box>
  );
}