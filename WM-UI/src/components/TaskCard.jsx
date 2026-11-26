import { useEffect, useRef } from 'react';
import { Box, Typography, IconButton, Chip } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import DeleteIcon from '@mui/icons-material/Delete';
import { INK, MUTED, FONT, SHADOW, importanceColor, chipSx } from '../constants/boardConfig';

// 1x1 transparent image, preloaded, used to hide the browser's own drag ghost
// (Chrome fades that ghost and it cannot be made opaque).
const BLANK = new Image();
BLANK.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

export default function TaskCard({ task, onShowLogs, onDelete }) {
  const cleanupRef = useRef(null);

  // make sure the floating copy never outlives the card (e.g. it unmounts after a drop)
  useEffect(() => () => cleanupRef.current?.(), []);

  const handleDragStart = (e) => {
    e.dataTransfer.setData('taskId', String(task.id));
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setDragImage(BLANK, 0, 0);

    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const offX = e.clientX - rect.left;
    const offY = e.clientY - rect.top;

    // our own fully opaque floating copy that follows the cursor
    const ghost = card.cloneNode(true);
    Object.assign(ghost.style, {
      position: 'fixed',
      left: '0',
      top: '0',
      width: `${rect.width}px`,
      margin: '0',
      opacity: '1',
      pointerEvents: 'none',
      zIndex: '2147483647',
      boxShadow: '0 18px 36px rgba(37, 41, 74, 0.25)',
      transform: `translate(${rect.left}px, ${rect.top}px)`,
    });
    document.body.appendChild(ghost);

    const move = (ev) => {
      if (ev.clientX === 0 && ev.clientY === 0) return;
      ghost.style.transform = `translate(${ev.clientX - offX}px, ${ev.clientY - offY}px)`;
    };
    const cleanup = () => {
      document.removeEventListener('dragover', move);
      document.removeEventListener('drop', cleanup, true);
      document.removeEventListener('dragend', cleanup, true);
      ghost.remove();
      cleanupRef.current = null;
    };
    document.addEventListener('dragover', move);
    document.addEventListener('drop', cleanup, true);
    document.addEventListener('dragend', cleanup, true);
    cleanupRef.current = cleanup;
  };

  return (
    <Box
      draggable
      onDragStart={handleDragStart}
      sx={{
        position: 'relative',
        bgcolor: '#fff',
        borderRadius: '22px',
        boxShadow: SHADOW,
        p: 2.5,
        cursor: 'grab',
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        '&:active': { cursor: 'grabbing' },
      }}
    >
      <Box sx={{ position: 'absolute', top: 10, right: 10, display: 'flex' }}>
        <IconButton aria-label="View history" size="small" onClick={() => onShowLogs(task.id)} sx={{ color: INK, '&:hover': { bgcolor: '#eef1f8' } }}>
          <HistoryIcon fontSize="small" />
        </IconButton>
        <IconButton aria-label="Delete task" size="small" onClick={() => onDelete(task.id)} sx={{ color: INK, '&:hover': { bgcolor: '#ffe3ec' } }}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>

      <Chip
        label={task.importance}
        size="small"
        sx={{ alignSelf: 'flex-start', ...chipSx(importanceColor[task.importance] || '#eef1f8') }}
      />
      <Typography sx={{ fontFamily: FONT, fontSize: 17, fontWeight: 800, pr: 9, wordBreak: 'break-word' }}>
        {task.title}
      </Typography>
      <Typography sx={{ fontFamily: FONT, fontSize: 14, lineHeight: 1.5, color: MUTED, wordBreak: 'break-word' }}>
        {task.description}
      </Typography>
    </Box>
  );
}