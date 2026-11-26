import { Box, Typography, Button, IconButton, Drawer, Avatar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ViewKanbanIcon from '@mui/icons-material/ViewKanban';
import BarChartIcon from '@mui/icons-material/BarChart';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import { INK, MUTED, TINT, FONT } from '../constants/boardConfig';

const navItems = [
  { label: 'Board', icon: <ViewKanbanIcon /> },
  { label: 'Reports', icon: <BarChartIcon /> },
  { label: 'Team', icon: <GroupsIcon /> },
  { label: 'My Profile', icon: <PersonIcon /> },
];

const navBtn = {
  justifyContent: 'flex-start',
  fontFamily: FONT,
  fontWeight: 700,
  fontSize: 15,
  textTransform: 'none',
  py: 1.4,
  px: 2,
  borderRadius: '18px',
  boxShadow: 'none',
};

export default function Sidebar({ open, onClose, activeTab, onSelectTab, user, onLogout }) {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: 280,
            bgcolor: '#fff',
            borderRadius: '32px 0 0 32px',
            boxShadow: '0 16px 40px rgba(37, 41, 74, 0.18)',
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
          },
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Typography sx={{ fontFamily: FONT, fontSize: 24, fontWeight: 800, color: INK }}>Menu</Typography>
        <IconButton aria-label="Close menu" onClick={onClose} sx={{ color: INK, bgcolor: TINT, '&:hover': { bgcolor: '#e4e9f5' } }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {user && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, bgcolor: '#dfe9ff', borderRadius: '22px', p: 1.5, mb: 1 }}>
          <Avatar src={user.avatarUrl} alt={user.name} sx={{ width: 40, height: 40, bgcolor: '#fff', color: INK, fontWeight: 800 }}>
            {user.name?.[0]?.toUpperCase()}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontFamily: FONT, fontSize: 14, fontWeight: 800, color: INK }} noWrap>
              {user.name}
            </Typography>
            <Typography sx={{ fontFamily: FONT, fontSize: 12, color: MUTED }} noWrap>
              {user.email}
            </Typography>
          </Box>
        </Box>
      )}

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
              ...navBtn,
              color: isActive ? '#fff' : INK,
              bgcolor: isActive ? INK : TINT,
              '&:hover': { bgcolor: isActive ? '#3a3f6b' : '#e4e9f5' },
            }}
          >
            {label}
          </Button>
        );
      })}

      <Button
        startIcon={<LogoutIcon />}
        onClick={() => {
          onClose();
          onLogout();
        }}
        sx={{ ...navBtn, mt: 'auto', color: INK, bgcolor: '#ffe3ec', '&:hover': { bgcolor: '#ffc2d4' } }}
      >
        Logout
      </Button>
    </Drawer>
  );
}