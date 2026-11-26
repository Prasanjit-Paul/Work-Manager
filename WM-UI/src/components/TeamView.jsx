import { Box, Typography, Avatar, Chip } from '@mui/material';
import { INK, MUTED, FONT, cardSx, chipSx } from '../constants/boardConfig';

export default function TeamView({ members, currentUser, loading }) {
  if (loading) {
    return (
      <Box sx={cardSx}>
        <Typography sx={{ fontFamily: FONT, fontSize: 18, fontWeight: 800 }}>Loading team members...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
          bgcolor: '#fff0b8',
          borderRadius: '28px',
          px: 3,
          py: 2.2,
        }}
      >
        <Typography sx={{ fontFamily: FONT, fontSize: 20, fontWeight: 800 }}>Registered users</Typography>
        <Chip
          label={`${members.length} ${members.length === 1 ? 'member' : 'members'}`}
          sx={{ ...chipSx('#fff'), fontWeight: 800, fontSize: 14 }}
        />
      </Box>

      {members.length === 0 ? (
        <Box sx={cardSx}>
          <Typography sx={{ fontFamily: FONT, fontSize: 18, fontWeight: 700 }}>No users found.</Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
          {members.map((member) => {
            const isCurrentUser = member.id === currentUser?.id;
            return (
              <Box
                key={member.id}
                sx={{
                  ...cardSx,
                  bgcolor: isCurrentUser ? '#dcf5e7' : '#fff',
                  boxShadow: isCurrentUser ? 'none' : cardSx.boxShadow,
                  borderRadius: '28px',
                  p: 2.5,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                  <Chip label={`User ID: #${member.id}`} size="small" sx={chipSx('#dfe9ff')} />
                  {isCurrentUser && (
                    <Chip label="You" size="small" sx={{ bgcolor: INK, color: '#fff', fontFamily: FONT, fontWeight: 800 }} />
                  )}
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 0 }}>
                  <Avatar src={member.avatarUrl} alt={member.name} sx={{ width: 48, height: 48, bgcolor: '#e4defa', color: INK, fontWeight: 800 }}>
                    {member.name?.[0]?.toUpperCase() || '?'}
                  </Avatar>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontFamily: FONT, fontSize: 17, fontWeight: 800 }} noWrap>
                      {member.name || 'Unnamed user'}
                    </Typography>
                    <Typography sx={{ fontFamily: FONT, fontSize: 13, color: MUTED }} noWrap>
                      {member.email}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
}