import { Box, Typography, Chip } from '@mui/material';
import { INK, MUTED, TINT, FONT, cardSx, chipSx, stages, importanceColor, importanceBar } from '../constants/boardConfig';

const sectionTitle = { fontFamily: FONT, fontSize: 20, fontWeight: 800, mb: 2.5 };

function BarRow({ label, count, pct, color }) {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
        <Typography sx={{ fontFamily: FONT, fontWeight: 700 }}>{label}</Typography>
        <Typography sx={{ fontFamily: FONT, fontWeight: 800 }}>
          {count} ({pct}%)
        </Typography>
      </Box>
      <Box sx={{ height: 14, bgcolor: TINT, borderRadius: 99, overflow: 'hidden' }}>
        <Box sx={{ width: `${pct}%`, height: '100%', bgcolor: color, borderRadius: 99, transition: 'width 0.3s ease' }} />
      </Box>
    </Box>
  );
}

export default function ReportsView({ tasks, activityLogs = [] }) {
  const total = tasks.length;
  const count = (key) => tasks.filter((t) => t.stage === key).length;
  const pctOf = (n) => (total > 0 ? Math.round((n / total) * 100) : 0);
  const doneCount = count('DONE');
  const taskTitleMap = Object.fromEntries(tasks.map((t) => [t.id, t.title]));

  const summaryCards = [
    { label: 'Total tasks', value: total, bg: '#fff' },
    { label: 'Draft', value: count('DRAFT'), bg: '#ffe3ec' },
    { label: 'In progress', value: count('IN PROGRESS'), bg: '#dfe9ff' },
    { label: 'Completed', value: `${doneCount} (${pctOf(doneCount)}%)`, bg: '#dcf5e7' },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3 }}>
        {summaryCards.map((item) => (
          <Box key={item.label} sx={{ ...cardSx, bgcolor: item.bg, boxShadow: item.bg === '#fff' ? cardSx.boxShadow : 'none' }}>
            <Typography sx={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, color: MUTED }}>{item.label}</Typography>
            <Typography sx={{ fontFamily: FONT, fontSize: 36, fontWeight: 800, mt: 0.5 }}>{item.value}</Typography>
          </Box>
        ))}
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
        <Box sx={cardSx}>
          <Typography sx={sectionTitle}>Tasks by stage</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.4 }}>
            {stages.map(({ key, label, bar }) => (
              <BarRow key={key} label={label} count={count(key)} pct={pctOf(count(key))} color={bar} />
            ))}
          </Box>
        </Box>

        <Box sx={cardSx}>
          <Typography sx={sectionTitle}>Tasks by importance</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.4 }}>
            {Object.keys(importanceColor).map((level) => {
              const n = tasks.filter((t) => t.importance === level).length;
              return <BarRow key={level} label={level} count={n} pct={pctOf(n)} color={importanceBar[level]} />;
            })}
          </Box>
        </Box>
      </Box>

      <Box sx={cardSx}>
        <Typography sx={sectionTitle}>Task overview</Typography>
        {tasks.length === 0 ? (
          <Typography sx={{ fontFamily: FONT, color: MUTED }}>No tasks available to report.</Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {tasks.map((task) => {
              const stageObj = stages.find((s) => s.key === task.stage);
              return (
                <Box
                  key={task.id}
                  sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 1.5, p: 2, bgcolor: TINT, borderRadius: '20px' }}
                >
                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontFamily: FONT, fontWeight: 800 }}>{task.title}</Typography>
                    <Typography sx={{ fontFamily: FONT, fontSize: 13, color: MUTED }}>{task.description}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip label={task.importance} size="small" sx={chipSx(importanceColor[task.importance] || '#fff0b8')} />
                    <Chip label={stageObj ? stageObj.label : task.stage} size="small" sx={chipSx(stageObj ? stageObj.color : '#fff')} />
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}
      </Box>

      <Box sx={cardSx}>
        <Typography sx={sectionTitle}>Recent activity</Typography>
        {activityLogs.length === 0 ? (
          <Typography sx={{ fontFamily: FONT, color: MUTED }}>
            No stage movements recorded yet. Drag a task on the Board to see activity here.
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {activityLogs.map((log) => (
              <Box
                key={log.id}
                sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 1, p: 2, bgcolor: TINT, borderRadius: '20px' }}
              >
                <Box>
                  <Typography sx={{ fontFamily: FONT, fontWeight: 800 }}>
                    {taskTitleMap[log.taskId] || `Task #${log.taskId}`}
                  </Typography>
                  <Typography sx={{ fontFamily: FONT, fontSize: 14, color: MUTED }}>{log.message}</Typography>
                </Box>
                <Typography sx={{ fontFamily: FONT, fontSize: 13, fontWeight: 700, color: MUTED }}>
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