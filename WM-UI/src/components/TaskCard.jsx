import { Box, Typography, IconButton, Chip } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import DeleteIcon from '@mui/icons-material/Delete';
import { INK, importanceColor } from '../constants/boardConfig';

export default function TaskCard({ task, onShowLogs, onDelete }) {
  return (
    <Box
      draggable
      onDragStart={(e) => e.dataTransfer.setData('taskId', task.id)}
      sx={{
        position: 'relative',
        bgcolor: '#fff',
        border: `3px solid ${INK}`,
        borderRadius: '12px',
        p: 2,
        cursor: 'grab',
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        '&:active': { cursor: 'grabbing' },
      }}
    >
      <Box sx={{ position: 'absolute', top: 6, right: 6, display: 'flex' }}>
        <IconButton aria-label="View history" onClick={() => onShowLogs(task.id)} sx={{ color: INK }}>
          <HistoryIcon fontSize="small" />
        </IconButton>
        <IconButton aria-label="Delete task" onClick={() => onDelete(task.id)} sx={{ color: INK }}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>

      <Chip
        label={task.importance}
        size="small"
        sx={{
          alignSelf: 'flex-start',
          fontWeight: 600,
          color: INK,
          bgcolor: importanceColor[task.importance] || '#fff3b0',
          border: `2px solid ${INK}`,
        }}
      />
      <Typography sx={{ fontSize: 17, fontWeight: 700, pr: 9 }}>{task.title}</Typography>
      <Typography sx={{ fontSize: 14, lineHeight: 1.45, color: '#4a3b73' }}>
        {task.description}
      </Typography>
    </Box>
  );
}