import { Box, Typography, Button, IconButton, Drawer } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ViewKanbanIcon from '@mui/icons-material/ViewKanban';
import BarChartIcon from '@mui/icons-material/BarChart';
import GroupsIcon from '@mui/icons-material/Groups';
import { INK, hard } from '../constants/boardConfig';

const navItems = [
  { label: 'Board', icon: <ViewKanbanIcon /> },
  { label: 'Reports', icon: <BarChartIcon /> },
  { label: 'Team', icon: <GroupsIcon /> },
];

export default function Sidebar({ open, onClose, activeTab, onSelectTab }) {
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
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Typography sx={{ fontSize: 24, fontWeight: 700, color: INK }}>
          Profile
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
    </Drawer>
  );
}