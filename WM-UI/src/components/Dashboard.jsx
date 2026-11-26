import { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Button } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import { API, INK, hard, stages } from '../constants/boardConfig';
import Sidebar from './Sidebar';
import AddTaskForm from './AddTaskForm';
import StageColumn from './StageColumn';
import HistoryDialog from './HistoryDialog';
import ReportsView from './ReportsView';

const pageTitles = {
  Board: 'Management',
  Reports: 'Task Reports',
  Team: 'Team',
};

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [overStage, setOverStage] = useState(null);
  const [logsOpen, setLogsOpen] = useState(false);
  const [logs, setLogs] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Board');

  const loadTasks = () => {
    if (!user?.id) return;
    axios.get(API, { params: { userId: user.id } }).then((res) => setTasks(res.data));
  };

  const loadAllLogs = () => {
    if (!user?.id) return;
    axios
      .get(`${API}/logs`, { params: { userId: user.id } })
      .then((res) => setActivityLogs(res.data))
      .catch((err) => console.error('Error fetching activity logs', err));
  };

  useEffect(() => {
    loadTasks();
    if (activeTab === 'Reports') {
      loadAllLogs();
    }
  }, [activeTab, user?.id]);

  const handleAddTask = (newTask) => {
    axios.post(API, { ...newTask, userId: user.id }).then((res) => {
      setTasks((prev) => [...prev, res.data]);
    });
  };

  const handleDrop = (e, targetStage) => {
    e.preventDefault();
    setOverStage(null);
    const id = Number(e.dataTransfer.getData('taskId'));
    const task = tasks.find((t) => t.id === id);
    if (!task || task.stage === targetStage) return;

    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, stage: targetStage } : t)));
    axios
      .put(`${API}/${id}`, { ...task, userId: user.id, stage: targetStage })
      .catch(loadTasks);
  };

  const handleDelete = (id) => {
    const previousTasks = tasks;
    setTasks((prev) => prev.filter((t) => t.id !== id));
    axios.delete(`${API}/${id}`, { params: { userId: user.id } }).catch(() => {
      setTasks(previousTasks);
    });
  };

  const showLogs = (id) => {
    axios
      .get(`${API}/${id}/logs`, { params: { userId: user.id } })
      .then((res) => {
        setLogs(res.data);
        setLogsOpen(true);
      })
      .catch((err) => console.error('Error fetching logs', err));
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#e6dcff', color: INK }}>
      <Box component="main" sx={{ width: '100%', p: { xs: 2, md: 5 } }}>
        {/* Header Row */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography component="h1" sx={{ fontSize: { xs: 30, md: 44 }, fontWeight: 700 }}>
            {pageTitles[activeTab]}
          </Typography>

          <Button
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              bgcolor: '#fff',
              color: INK,
              border: `3px solid ${INK}`,
              borderRadius: '12px',
              boxShadow: hard(4),
              px: 1.5,
              py: 0.8,
              minWidth: 'auto',
              '&:hover': { bgcolor: '#ffd166' },
              '&:active': { boxShadow: 'none', transform: 'translate(3px, 3px)' },
            }}
          >
            <AccountCircleIcon sx={{ fontSize: 28 }} />
            <MenuIcon sx={{ fontSize: 24 }} />
          </Button>
        </Box>

        {/* Active View */}
        {activeTab === 'Board' && (
          <>
            <AddTaskForm onAddTask={handleAddTask} />
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
              {stages.map((stage) => (
                <StageColumn
                  key={stage.key}
                  stage={stage}
                  tasks={tasks.filter((t) => t.stage === stage.key)}
                  isOver={overStage === stage.key}
                  onDragOver={setOverStage}
                  onDragLeave={() => setOverStage(null)}
                  onDrop={handleDrop}
                  onShowLogs={showLogs}
                  onDelete={handleDelete}
                />
              ))}
            </Box>
          </>
        )}

        {activeTab === 'Reports' && (
          <ReportsView tasks={tasks} activityLogs={activityLogs} />
        )}

        {activeTab === 'Team' && (
          <Box
            sx={{
              bgcolor: '#fff',
              border: `3px solid ${INK}`,
              borderRadius: '16px',
              boxShadow: hard(6),
              p: 4,
            }}
          >
            <Typography sx={{ fontSize: 20, fontWeight: 700 }}>Team view coming soon.</Typography>
          </Box>
        )}
      </Box>

      <Sidebar
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />
      <HistoryDialog open={logsOpen} logs={logs} onClose={() => setLogsOpen(false)} />
    </Box>
  );
}