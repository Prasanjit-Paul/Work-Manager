import { useState } from 'react';
import Dashboard from './components/Dashboard';
import AuthPage from './components/AuthPage';

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('wm_user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLoginSuccess = (userData) => {
    localStorage.setItem('wm_user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleProfileUpdated = (updatedUser) => {
    localStorage.setItem('wm_user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('wm_user');
    setUser(null);
  };

  if (!user) {
    return <AuthPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <Dashboard
      user={user}
      onProfileUpdated={handleProfileUpdated}
      onLogout={handleLogout}
    />
  );
}