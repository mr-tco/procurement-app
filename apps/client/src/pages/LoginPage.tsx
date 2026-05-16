import { FormEvent, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

export function LoginPage(): JSX.Element {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');

    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('role', data.user.role);
      localStorage.setItem('fullName', data.user.fullName);
      navigate('/dashboard');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;
        setError(Array.isArray(message) ? message.join(', ') : message ?? 'Login failed');
        return;
      }
      setError('Login failed');
    }
  };

  return (
    <div style={{ maxWidth: 380, margin: '40px auto', fontFamily: 'Arial, sans-serif' }}>
      <h2>Login</h2>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 10 }}>
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p>
        No account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}
