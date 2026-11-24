import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Divider, Alert, Tabs, Tab } from '@mui/material';
import { GoogleLogin } from '@react-oauth/google';
import { API_BASE_URL, INK, hard, fieldSx } from '../constants/boardConfig';

export default function AuthPage({ onLoginSuccess }) {
  const [mode, setMode] = useState(0);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const endpoint = mode === 0 ? '/api/auth/login' : '/api/auth/signup';
    const payload = mode === 0
      ? { email: form.email, password: form.password }
      : { name: form.name, email: form.email, password: form.password };

    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Authentication failed');
      onLoginSuccess(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Google login failed');
      onLoginSuccess(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f1e3c0', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
      <Box sx={{ width: '100%', maxWidth: 420, bgcolor: '#fff', border: `3px solid ${INK}`, borderRadius: '14px', boxShadow: hard(6), p: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: INK, mb: 0.5, textAlign: 'center' }}>
          Work Manager
        </Typography>
        <Typography variant="body2" sx={{ color: INK, opacity: 0.75, mb: 3, textAlign: 'center' }}>
          {mode === 0 ? 'Sign in to continue to your workspace' : 'Create your account to get started'}
        </Typography>

        <Tabs
          value={mode}
          onChange={(_, v) => { setMode(v); setError(''); }}
          variant="fullWidth"
          sx={{
            mb: 3,
            border: `3px solid ${INK}`,
            borderRadius: '10px',
            bgcolor: '#fff3b0',
            '& .MuiTabs-indicator': { display: 'none' },
            '& .MuiTab-root': { fontWeight: 700, color: INK },
            '& .Mui-selected': { bgcolor: '#b7e9f3', color: `${INK} !important` },
          }}
        >
          <Tab label="Login" />
          <Tab label="Sign Up" />
        </Tabs>

        {error && <Alert severity="error" sx={{ mb: 2, border: `2px solid ${INK}` }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {mode === 1 && (
            <TextField label="Full Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} sx={fieldSx} />
          )}
          <TextField label="Email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} sx={fieldSx} />
          <TextField label="Password" type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} sx={fieldSx} />

          <Button
            type="submit"
            disabled={loading}
            sx={{ mt: 1, py: 1.2, bgcolor: '#ff5da2', color: INK, fontWeight: 800, border: `3px solid ${INK}`, borderRadius: '10px', boxShadow: hard(4), '&:hover': { bgcolor: '#ff4794' } }}
          >
            {loading ? 'Please wait...' : mode === 0 ? 'Login' : 'Create Account'}
          </Button>
        </Box>

        <Divider sx={{ my: 3, fontWeight: 700, color: INK }}>OR</Divider>

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => setError('Google Sign-In was cancelled or failed.')} width="340" />
        </Box>
      </Box>
    </Box>
  );
}