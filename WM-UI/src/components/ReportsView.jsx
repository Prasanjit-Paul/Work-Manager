import { Box, Typography, Chip } from '@mui/material';
import { INK, hard, stages, importanceColor } from '../constants/boardConfig';

const cardSx = {
  bgcolor: '#fff',
  border: `3px solid ${INK}`,
  borderRadius: '16px',
  boxShadow: hard(6),
  p: 3,
};

export default function ReportsView({ tasks, activityLogs = [] }) {
  const total = tasks.length;
  const doneCount = tasks.filter((t) => t.stage === 'DONE').length;
  const inProgressCount = tasks.filter((t) => t.stage === 'IN PROGRESS').length;
  const draftCount = tasks.filter((t) => t.stage === 'DRAFT').length;
  const completionRate = total > 0 ? Math.round((doneCount / total) * 100) : 0;

  const taskTitleMap = Object.fromEntries(tasks.map((t) => [t.id, t.title]));

  const summaryCards = [
    { label: 'Total Tasks', value: total, bg: '#fff' },
    { label: 'Draft', value: draftCount, bg: '#ffd166' },
    { label: 'In Progress', value: inProgressCount, bg: '#7bdff2' },
    { label: 'Completed', value: `${doneCount} (${completionRate}%)`, bg: '#b8f2a8' },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {/* Top KPI Cards */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
          gap: 3,
        }}
      >
        {summaryCards.map((item) => (
          <Box key={item.label} sx={{ ...cardSx, bgcolor: item.bg }}>
            <Typography sx={{ fontSize: 14, fontWeight: 700, opacity: 0.8 }}>
              {item.label}
            </Typography>
            <Typography sx={{ fontSize: 34, fontWeight: 700, mt: 1 }}>
              {item.value}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Visual Breakdown Bars */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
          gap: 3,
        }}
      >
        {/* By Stage */}
        <Box sx={cardSx}>
          <Typography sx={{ fontSize: 20, fontWeight: 700, mb: 2.5 }}>
            Tasks by Stage
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.2 }}>
            {stages.map(({ key, label, color }) => {
              const count = tasks.filter((t) => t.stage === key).length;
              const pct = total > 0 ? Math.round((count / total) * 100) : 0;
              return (
                <Box key={key}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.7 }}>
                    <Typography sx={{ fontWeight: 600 }}>{label}</Typography>
                    <Typography sx={{ fontWeight: 700 }}>
                      {count} ({pct}%)
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      height: 22,
                      bgcolor: '#f3eeff',
                      border: `2px solid ${INK}`,
                      borderRadius: '8px',
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      sx={{
                        width: `${pct}%`,
                        height: '100%',
                        bgcolor: color,
                        transition: 'width 0.3s ease',
                      }}
                    />
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* By Importance */}
        <Box sx={cardSx}>
          <Typography sx={{ fontSize: 20, fontWeight: 700, mb: 2.5 }}>
            Tasks by Importance
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.2 }}>
            {Object.entries(importanceColor).map(([level, color]) => {
              const count = tasks.filter((t) => t.importance === level).length;
              const pct = total > 0 ? Math.round((count / total) * 100) : 0;
              return (
                <Box key={level}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.7 }}>
                    <Typography sx={{ fontWeight: 600 }}>{level}</Typography>
                    <Typography sx={{ fontWeight: 700 }}>
                      {count} ({pct}%)
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      height: 22,
                      bgcolor: '#f3eeff',
                      border: `2px solid ${INK}`,
                      borderRadius: '8px',
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      sx={{
                        width: `${pct}%`,
                        height: '100%',
                        bgcolor: color,
                        transition: 'width 0.3s ease',
                      }}
                    />
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>

      {/* All Tasks Summary List */}
      <Box sx={cardSx}>
        <Typography sx={{ fontSize: 20, fontWeight: 700, mb: 2 }}>
          Task Overview
        </Typography>
        {tasks.length === 0 ? (
          <Typography sx={{ opacity: 0.75 }}>No tasks available to report.</Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {tasks.map((task) => {
              const stageObj = stages.find((s) => s.key === task.stage);
              return (
                <Box
                  key={task.id}
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 1.5,
                    p: 1.5,
                    border: `2px solid ${INK}`,
                    borderRadius: '10px',
                    bgcolor: '#faf7ff',
                  }}
                >
                  <Box>
                    <Typography sx={{ fontWeight: 700 }}>{task.title}</Typography>
                    <Typography sx={{ fontSize: 13, color: '#4a3b73' }}>
                      {task.description}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip
                      label={task.importance}
                      size="small"
                      sx={{
                        fontWeight: 600,
                        color: INK,
                        bgcolor: importanceColor[task.importance] || '#fff3b0',
                        border: `2px solid ${INK}`,
                      }}
                    />
                    <Chip
                      label={stageObj ? stageObj.label : task.stage}
                      size="small"
                      sx={{
                        fontWeight: 700,
                        color: INK,
                        bgcolor: stageObj ? stageObj.color : '#fff',
                        border: `2px solid ${INK}`,
                      }}
                    />
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}
      </Box>

      {/* Global Activity Logs from /tasks/logs */}
      <Box sx={cardSx}>
        <Typography sx={{ fontSize: 20, fontWeight: 700, mb: 2 }}>
          Recent Activity
        </Typography>
        {activityLogs.length === 0 ? (
          <Typography sx={{ opacity: 0.75 }}>
            No stage movements recorded yet. Drag a task on the Board to see activity here.
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {activityLogs.map((log) => (
              <Box
                key={log.id}
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 1,
                  p: 1.5,
                  border: `2px solid ${INK}`,
                  borderRadius: '10px',
                  bgcolor: '#fffdf2',
                }}
              >
                <Box>
                  <Typography sx={{ fontWeight: 700 }}>
                    {taskTitleMap[log.taskId] || `Task #${log.taskId}`}
                  </Typography>
                  <Typography sx={{ fontSize: 14, color: '#4a3b73' }}>
                    {log.message}
                  </Typography>
                </Box>
                <Typography sx={{ fontSize: 13, fontWeight: 600, opacity: 0.75 }}>
                  {new Date(log.timestamp).toLocaleString()}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}