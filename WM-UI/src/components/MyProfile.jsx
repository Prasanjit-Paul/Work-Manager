import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Avatar, Chip, Alert, Grid } from '@mui/material';
import { API_BASE_URL, INK, hard, fieldSx } from '../constants/boardConfig';

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
      setStatus({ type: 'success', msg: 'Profile saved successfully.' });
    } catch (err) {
      setStatus({ type: 'error', msg: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 760, mx: 'auto', p: { xs: 2, md: 3 } }}>
      <Box sx={{ bgcolor: '#fff', border: `3px solid ${INK}`, borderRadius: '14px', boxShadow: hard(6), p: { xs: 2.5, md: 4 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, mb: 3, flexWrap: 'wrap' }}>
          <Avatar
            src={user.avatarUrl}
            alt={user.name}
            sx={{ width: 72, height: 72, bgcolor: '#c9b6ff', color: INK, fontWeight: 800, fontSize: 28, border: `3px solid ${INK}` }}
          >
            {user.name?.[0]?.toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: INK }}>{user.name}</Typography>
            <Typography variant="body2" sx={{ color: INK, opacity: 0.8, mb: 0.5 }}>{user.email}</Typography>
            <Chip
              label={`Signed in via ${user.authProvider}`}
              size="small"
              sx={{ bgcolor: user.authProvider === 'GOOGLE' ? '#b7e9f3' : '#fff3b0', color: INK, fontWeight: 700, border: `2px solid ${INK}` }}
            />
          </Box>
        </Box>

        {status.msg && <Alert severity={status.type} sx={{ mb: 3, border: `2px solid ${INK}` }}>{status.msg}</Alert>}

        <Box component="form" onSubmit={handleSave}>
          <Grid container spacing={2.5}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Email (Login ID)" value={user.email} disabled sx={fieldSx} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Full Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} sx={fieldSx} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Job Role / Title (Optional)" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} sx={fieldSx} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Department / Team (Optional)" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} sx={fieldSx} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Phone Number (Optional)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} sx={fieldSx} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Location (Optional)" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} sx={fieldSx} />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth multiline rows={3} label="Bio / About (Optional)" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} sx={fieldSx} />
            </Grid>
          </Grid>

          <Button
            type="submit"
            disabled={saving}
            sx={{ mt: 3, px: 4, py: 1.2, bgcolor: '#d9f1d3', color: INK, fontWeight: 800, border: `3px solid ${INK}`, borderRadius: '10px', boxShadow: hard(4), '&:hover': { bgcolor: '#c2e8b8' } }}
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}