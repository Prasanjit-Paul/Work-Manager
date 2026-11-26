import { Box, Typography } from '@mui/material';
import { INK, FONT } from '../constants/boardConfig';
import TaskCard from './TaskCard';

export default function StageColumn({ stage, tasks, isOver, onDragOver, onDragLeave, onDrop, onShowLogs, onDelete }) {
  return (
    <Box
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver(stage.key);
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) onDragLeave();
      }}
      onDrop={(e) => onDrop(e, stage.key)}
      sx={{
        bgcolor: stage.color,
        borderRadius: '32px',
        p: '24px',
        minHeight: 520,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        outline: isOver ? `2px dashed ${INK}` : '2px dashed transparent',
        outlineOffset: -8,
        transition: 'outline-color .15s',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography sx={{ fontFamily: FONT, fontSize: 18, fontWeight: 700 }}>{stage.label}</Typography>
        <Box
          aria-label={`${tasks.length} tasks`}
          sx={{
            minWidth: 32,
            height: 28,
            px: 1.5,
            display: 'grid',
            placeItems: 'center',
            bgcolor: '#fff',
            color: INK,
            borderRadius: 99,
            fontFamily: FONT,
            fontSize: 14,
            fontWeight: 800,
          }}
        >
          {tasks.length}
        </Box>
      </Box>

      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} onShowLogs={onShowLogs} onDelete={onDelete} />
      ))}

      {tasks.length === 0 && (
        <Typography sx={{ fontFamily: FONT, fontSize: 14, color: INK, opacity: 0.6 }}>
          Drop a task here to move it to {stage.label.toLowerCase()}.
        </Typography>
      )}
    </Box>
  );
}