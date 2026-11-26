import { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Button, Avatar } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import { API, API_BASE_URL, INK, SHADOW, PAGE_BG, FONT, stages } from '../constants/boardConfig';
import Sidebar from './Sidebar';
import AddTaskForm from './AddTaskForm';
import StageColumn from './StageColumn';
import HistoryDialog from './HistoryDialog';
import ReportsView from './ReportsView';
import MyProfile from './MyProfile';
import TeamView from './TeamView';

const pageTitles = {
  Board: 'Task Management',
  Reports: 'Task Reports',
  Team: 'Team',
  'My Profile': 'My Profile',
};

export default function Dashboard({ user, onProfileUpdated, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [overStage, setOverStage] = useState(null);
  const [logsOpen, setLogsOpen] = useState(false);
  const [logs, setLogs] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Board');
  const [teamMembers, setTeamMembers] = useState([]);
  const [teamLoading, setTeamLoading] = useState(false);

  const loadTasks = () => {
    if (!user?.id) return;
    axios
      .get(API, { params: { userId: user.id } })
      .then((res) => setTasks(res.data))
      .catch((err) => console.error('Error fetching tasks', err));
  };

  const loadAllLogs = () => {
    if (!user?.id) return;
    axios
      .get(`${API}/logs`, { params: { userId: user.id } })
      .then((res) => setActivityLogs(res.data))
      .catch((err) => console.error('Error fetching activity logs', err));
  };

  const loadTeam = () => {
    setTeamLoading(true);
    axios
      .get(`${API_BASE_URL}/api/users`)
      .then((res) => setTeamMembers(res.data))
      .catch((err) => console.error('Error fetching team members', err))
      .finally(() => setTeamLoading(false));
  };

  useEffect(() => {
    loadTasks();
    if (activeTab === 'Reports') loadAllLogs();
    if (activeTab === 'Team') loadTeam();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, user?.id]);

  const handleAddTask = (newTask) => {
    axios
      .post(API, { ...newTask, userId: user.id })
      .then((res) => setTasks((prev) => [...prev, res.data]))
      .catch((err) => console.error('Error adding task', err));
  };

  const handleDrop = (e, targetStage) => {
    e.preventDefault();
    setOverStage(null);
    const id = Number(e.dataTransfer.getData('taskId'));
    const task = tasks.find((t) => t.id === id);
    if (!task || task.stage === targetStage) return;

    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, stage: targetStage } : t)));
    axios.put(`${API}/${id}`, { ...task, userId: user.id, stage: targetStage }).catch(loadTasks);
  };

  const handleDelete = (id) => {
    const previousTasks = tasks;
    setTasks((prev) => prev.filter((t) => t.id !== id));
    axios.delete(`${API}/${id}`, { params: { userId: user.id } }).catch(() => setTasks(previousTasks));
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
    <Box sx={{ minHeight: '100vh', bgcolor: PAGE_BG, color: INK, fontFamily: FONT }}>
      <Box component="main" sx={{ width: '100%', p: { xs: '24px 20px', md: '36px 48px' }, textAlign: 'left' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, gap: 2 }}>
          <Typography component="h1" sx={{ fontFamily: FONT, fontSize: { xs: 30, md: 42 }, fontWeight: 800, lineHeight: 1.1 }}>
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
              borderRadius: '18px',
              boxShadow: SHADOW,
              height: 52,
              px: 1.8,
              minWidth: 'auto',
              '&:hover': { bgcolor: '#f6f8fc' },
              '&.Mui-focusVisible': { outline: `2px solid ${INK}` },
            }}
          >
            {user?.avatarUrl ? (
              <Avatar src={user.avatarUrl} alt={user.name} sx={{ width: 30, height: 30 }} />
            ) : (
              <AccountCircleIcon sx={{ fontSize: 30 }} />
            )}
            <MenuIcon sx={{ fontSize: 24 }} />
          </Button>
        </Box>

        {activeTab === 'Board' && (
          <>
            <AddTaskForm onAddTask={handleAddTask} />
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
                gap: '24px',
                alignItems: 'start',
              }}
            >
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

        {activeTab === 'Reports' && <ReportsView tasks={tasks} activityLogs={activityLogs} />}
        {activeTab === 'Team' && <TeamView members={teamMembers} currentUser={user} loading={teamLoading} />}
        {activeTab === 'My Profile' && <MyProfile user={user} onProfileUpdated={onProfileUpdated} />}
      </Box>

      <Sidebar
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        user={user}
        onLogout={onLogout}
      />
      <HistoryDialog open={logsOpen} logs={logs} onClose={() => setLogsOpen(false)} />
    </Box>
  );
}