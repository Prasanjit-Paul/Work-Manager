import { Dialog, DialogTitle, DialogContent, List, ListItem, ListItemText, Typography } from '@mui/material';
import { INK, MUTED, FONT } from '../constants/boardConfig';

export default function HistoryDialog({ open, logs, onClose }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            bgcolor: '#fff',
            color: INK,
            minWidth: { xs: 280, sm: 440 },
            borderRadius: '28px',
            boxShadow: '0 16px 40px rgba(37, 41, 74, 0.18)',
          },
        },
      }}
    >
      <DialogTitle sx={{ fontFamily: FONT, fontWeight: 800, fontSize: 22, pt: 3 }}>Task history</DialogTitle>
      <DialogContent>
        {logs.length === 0 ? (
          <Typography sx={{ fontFamily: FONT, color: MUTED }}>This task hasn't moved between stages yet.</Typography>
        ) : (
          <List disablePadding>
            {logs.map((log) => (
              <ListItem key={log.id} divider sx={{ px: 0, borderColor: '#e6e9f4' }}>
                <ListItemText
                  primary={log.message}
                  secondary={new Date(log.timestamp).toLocaleString()}
                  slotProps={{
                    primary: { sx: { fontFamily: FONT, fontWeight: 700, color: INK } },
                    secondary: { sx: { fontFamily: FONT, color: MUTED } },
                  }}
                />
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
}