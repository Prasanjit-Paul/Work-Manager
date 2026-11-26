import { useState } from 'react';
import { Box, Button, Typography, Divider, Alert, Tabs, Tab } from '@mui/material';
import { GoogleLogin } from '@react-oauth/google';
import { API_BASE_URL, INK, MUTED, TINT, PAGE_BG, FONT, cardSx, primaryBtnSx } from '../constants/boardConfig';
import Field from './Field';

export default function AuthPage({ onLoginSuccess }) {
  const [mode, setMode] = useState(0);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const post = async (endpoint, payload, fallback) => {
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || fallback);
      onLoginSuccess(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 0) post('/api/auth/login', { email: form.email, password: form.password }, 'Authentication failed');
    else post('/api/auth/signup', { name: form.name, email: form.email, password: form.password }, 'Authentication failed');
  };

  const handleGoogleSuccess = (cred) =>
    post('/api/auth/google', { credential: cred.credential }, 'Google login failed');

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: PAGE_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
      <Box sx={{ ...cardSx, width: '100%', maxWidth: 440, p: { xs: 3, sm: 4 } }}>
        <Typography sx={{ fontFamily: FONT, fontSize: 32, fontWeight: 800, color: INK, mb: 0.5 }}>Work Manager</Typography>
        <Typography sx={{ fontFamily: FONT, color: MUTED, mb: 3 }}>
          {mode === 0 ? 'Sign in to continue to your workspace.' : 'Create your account to get started.'}
        </Typography>

        <Tabs
          value={mode}
          onChange={(_, v) => {
            setMode(v);
            setError('');
          }}
          variant="fullWidth"
          sx={{
            mb: 3,
            minHeight: 48,
            p: 0.5,
            bgcolor: TINT,
            borderRadius: '18px',
            '& .MuiTabs-indicator': { display: 'none' },
            '& .MuiTab-root': { minHeight: 40, borderRadius: '14px', fontFamily: FONT, fontWeight: 800, textTransform: 'none', color: MUTED },
            '& .Mui-selected': { bgcolor: INK, color: '#fff !important' },
          }}
        >
          <Tab label="Login" />
          <Tab label="Sign up" />
        </Tabs>

        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: '18px', fontFamily: FONT, fontWeight: 600 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.2 }}>
          {mode === 1 && <Field label="Full name" required value={form.name} onChange={set('name')} placeholder="Your name" />}
          <Field label="Email" type="email" required value={form.email} onChange={set('email')} placeholder="you@example.com" />
          <Field label="Password" type="password" required value={form.password} onChange={set('password')} placeholder="Password" />

          <Button type="submit" disabled={loading} sx={{ ...primaryBtnSx, mt: 1 }}>
            {loading ? 'Please wait...' : mode === 0 ? 'Login' : 'Create account'}
          </Button>
        </Box>

        <Divider sx={{ my: 3, color: MUTED, fontFamily: FONT, fontWeight: 700, '&::before, &::after': { borderColor: '#e6e9f4' } }}>or</Divider>

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => setError('Google sign-in was cancelled or failed.')} width="340" />
        </Box>
      </Box>
    </Box>
  );
}