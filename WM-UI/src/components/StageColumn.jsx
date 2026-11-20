import { Box, Typography } from '@mui/material';
import { INK, hard } from '../constants/boardConfig';
import TaskCard from './TaskCard';

export default function StageColumn({
  stage,
  tasks,
  isOver,
  onDragOver,
  onDragLeave,
  onDrop,
  onShowLogs,
  onDelete,
}) {
  return (
    <Box
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver(stage.key);
      }}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, stage.key)}
      sx={{
        bgcolor: stage.color,
        border: `3px solid ${INK}`,
        borderRadius: '18px',
        boxShadow: isOver ? hard(10) : hard(6),
        p: 2.5,
        minHeight: 520,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        transform: isOver ? 'translate(-3px, -3px)' : 'none',
        transition: 'transform .15s, box-shadow .15s',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography sx={{ fontSize: 20, fontWeight: 700 }}>{stage.label}</Typography>
        <Box
          sx={{
            minWidth: 30,
            height: 30,
            px: 1,
            display: 'grid',
            placeItems: 'center',
            bgcolor: INK,
            color: '#fff',
            borderRadius: 99,
            fontSize: 14,
            fontWeight: 700,
          }}
        >
          {tasks.length}
        </Box>
      </Box>

      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onShowLogs={onShowLogs}
          onDelete={onDelete}
        />
      ))}

      {tasks.length === 0 && (
        <Typography sx={{ fontSize: 14, fontWeight: 500, opacity: 0.75 }}>
          Drop a task here to move it to {stage.label.toLowerCase()}.
        </Typography>
      )}
    </Box>
  );
}