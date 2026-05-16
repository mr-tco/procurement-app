import { FormEvent, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

export function RegisterPage(): JSX.Element {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage('');

    try {
      await api.post('/auth/register', { email, fullName, password });
      setMessage('Registration successful, please login');
      setTimeout(() => navigate('/login'), 1000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;
        setMessage(Array.isArray(message) ? message.join(', ') : message ?? 'Registration failed');
        return;
      }
      setMessage('Registration failed');
    }
  };

  return (
    <div style={{ maxWidth: 380, margin: '40px auto', fontFamily: 'Arial, sans-serif' }}>
      <h2>Register</h2>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 10 }}>
        <input placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Register</button>
      </form>
      {message && <p>{message}</p>}
      <p>
        Already registered? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
