import { useState } from 'react';
import { Box, Typography, Button, Avatar, Chip, Alert } from '@mui/material';
import { API_BASE_URL, INK, MUTED, FONT, cardSx, chipSx, primaryBtnSx } from '../constants/boardConfig';
import Field from './Field';

export default function MyProfile({ user, onProfileUpdated }) {
  const [form, setForm] = useState({
    name: user.name || '',
    role: user.role || '',
    department: user.department || '',
    phone: user.phone || '',
    location: user.location || '',
    bio: user.bio || '',
  });
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [saving, setSaving] = useState(false);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus({ type: '', msg: '' });
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const updated = await res.json();
      if (!res.ok) throw new Error(updated.error || 'Failed to update profile');
      onProfileUpdated(updated);
      setStatus({ type: 'success', msg: 'Profile saved.' });
    } catch (err) {
      setStatus({ type: 'error', msg: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 760, mx: 'auto' }}>
      <Box sx={{ ...cardSx, p: { xs: 2.5, md: 4 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, mb: 3.5, flexWrap: 'wrap' }}>
          <Avatar src={user.avatarUrl} alt={user.name} sx={{ width: 72, height: 72, bgcolor: '#e4defa', color: INK, fontWeight: 800, fontSize: 28 }}>
            {user.name?.[0]?.toUpperCase()}
          </Avatar>
          <Box>
            <Typography sx={{ fontFamily: FONT, fontSize: 24, fontWeight: 800 }}>{user.name}</Typography>
            <Typography sx={{ fontFamily: FONT, fontSize: 14, color: MUTED, mb: 0.8 }}>{user.email}</Typography>
            <Chip
              label={`Signed in with ${user.authProvider === 'GOOGLE' ? 'Google' : 'email'}`}
              size="small"
              sx={chipSx(user.authProvider === 'GOOGLE' ? '#dfe9ff' : '#fff0b8')}
            />
          </Box>
        </Box>

        {status.msg && (
          <Alert severity={status.type} sx={{ mb: 3, borderRadius: '18px', fontFamily: FONT, fontWeight: 600 }}>
            {status.msg}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSave}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2.5 }}>
            <Field label="Email (login ID)" value={user.email} disabled />
            <Field label="Full name" required value={form.name} onChange={set('name')} placeholder="Your name" />
            <Field label="Job role / title" value={form.role} onChange={set('role')} placeholder="Optional" />
            <Field label="Department / team" value={form.department} onChange={set('department')} placeholder="Optional" />
            <Field label="Phone number" value={form.phone} onChange={set('phone')} placeholder="Optional" />
            <Field label="Location" value={form.location} onChange={set('location')} placeholder="Optional" />
            <Field label="Bio / about" multiline rows={3} value={form.bio} onChange={set('bio')} placeholder="Optional" sx={{ gridColumn: '1 / -1' }} />
          </Box>

          <Button type="submit" disabled={saving} sx={{ ...primaryBtnSx, mt: 3.5 }}>
            {saving ? 'Saving...' : 'Save profile'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}