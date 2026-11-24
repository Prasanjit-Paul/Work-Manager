import { Box, Typography, Button, IconButton, Drawer, Avatar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ViewKanbanIcon from '@mui/icons-material/ViewKanban';
import BarChartIcon from '@mui/icons-material/BarChart';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import { INK, hard } from '../constants/boardConfig';

const navItems = [
  { label: 'Board', icon: <ViewKanbanIcon /> },
  { label: 'Reports', icon: <BarChartIcon /> },
  { label: 'Team', icon: <GroupsIcon /> },
  { label: 'My Profile', icon: <PersonIcon /> },
];

export default function Sidebar({ open, onClose, activeTab, onSelectTab, user, onLogout }) {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: 260,
            bgcolor: '#ffd166',
            borderLeft: `3px solid ${INK}`,
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          },
        },
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Typography sx={{ fontSize: 24, fontWeight: 700, color: INK }}>
          Menu
        </Typography>
        <IconButton
          aria-label="Close menu"
          onClick={onClose}
          sx={{
            color: INK,
            bgcolor: '#fff',
            border: `2px solid ${INK}`,
            borderRadius: '8px',
            boxShadow: hard(2),
            p: 0.5,
            '&:hover': { bgcolor: '#fff3b0' },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Logged-in User Card */}
      {user && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            bgcolor: '#fff',
            border: `3px solid ${INK}`,
            borderRadius: '10px',
            boxShadow: hard(3),
            p: 1.2,
          }}
        >
          <Avatar
            src={user.avatarUrl}
            alt={user.name}
            sx={{
              width: 36,
              height: 36,
              bgcolor: '#c9b6ff',
              color: INK,
              fontWeight: 800,
              fontSize: 16,
              border: `2px solid ${INK}`,
            }}
          >
            {user.name?.[0]?.toUpperCase()}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 700, color: INK }} noWrap>
              {user.name}
            </Typography>
            <Typography sx={{ fontSize: 11, color: INK, opacity: 0.75 }} noWrap>
              {user.email}
            </Typography>
          </Box>
        </Box>
      )}

      {/* Navigation Tabs */}
      {navItems.map(({ label, icon }) => {
        const isActive = activeTab === label;
        return (
          <Button
            key={label}
            startIcon={icon}
            onClick={() => {
              onSelectTab(label);
              onClose();
            }}
            sx={{
              justifyContent: 'flex-start',
              color: INK,
              fontWeight: 600,
              fontSize: 15,
              textTransform: 'none',
              py: 1.4,
              px: 2,
              borderRadius: '10px',
              border: `3px solid ${INK}`,
              bgcolor: isActive ? '#ff5da2' : '#fff',
              boxShadow: isActive ? hard(4) : 'none',
              '&:hover': { bgcolor: isActive ? '#ff5da2' : '#fff3b0' },
            }}
          >
            {label}
          </Button>
        );
      })}

      {/* Logout Button Pinned to Bottom */}
      <Button
        startIcon={<LogoutIcon />}
        onClick={() => {
          onClose();
          onLogout();
        }}
        sx={{
          mt: 'auto',
          justifyContent: 'flex-start',
          color: INK,
          fontWeight: 700,
          fontSize: 15,
          textTransform: 'none',
          py: 1.4,
          px: 2,
          borderRadius: '10px',
          border: `3px solid ${INK}`,
          bgcolor: '#f1e3c0',
          boxShadow: hard(3),
          '&:hover': { bgcolor: '#ff5da2' },
        }}
      >
        Logout
      </Button>
    </Drawer>
  );
}