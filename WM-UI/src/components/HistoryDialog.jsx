import { Dialog, DialogTitle, DialogContent, List, ListItem, ListItemText, Typography } from '@mui/material';
import { INK, hard } from '../constants/boardConfig';

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
            minWidth: { xs: 280, sm: 420 },
            border: `3px solid ${INK}`,
            borderRadius: '18px',
            boxShadow: hard(8),
          },
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 700, bgcolor: '#ffd166', borderBottom: `3px solid ${INK}` }}>
        Task history
      </DialogTitle>
      <DialogContent>
        {logs.length === 0 ? (
          <Typography sx={{ mt: 2 }}>This task hasn't moved between stages yet.</Typography>
        ) : (
          <List>
            {logs.map((log) => (
              <ListItem key={log.id} divider sx={{ borderColor: INK }}>
                <ListItemText
                  primary={log.message}
                  secondary={new Date(log.timestamp).toLocaleString()}
                  slotProps={{ primary: { sx: { fontWeight: 600 } } }}
                />
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
}