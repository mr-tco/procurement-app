import { useEffect, useState } from 'react';
import api from '../api';

interface UserRow {
  id: string;
  email: string;
  fullName: string;
  role: 'ADMIN' | 'USER';
  isActive: boolean;
}

export function AdminUsersPage(): JSX.Element {
  const [users, setUsers] = useState<UserRow[]>([]);

  const load = () => {
    api.get('/users').then((res) => setUsers(res.data));
  };

  useEffect(() => {
    load();
  }, []);

  const toggleStatus = async (user: UserRow) => {
    await api.patch(`/users/${user.id}/status`, { isActive: !user.isActive });
    load();
  };

  const toggleRole = async (user: UserRow) => {
    const role = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
    await api.patch(`/users/${user.id}/role`, { role });
    load();
  };

  return (
    <div>
      <h2>User Management</h2>
      {users.map((user) => (
        <div key={user.id} style={{ borderBottom: '1px solid #ccc', padding: 8 }}>
          <strong>{user.fullName}</strong> ({user.email}) - {user.role} - {user.isActive ? 'Active' : 'Inactive'}
          <div style={{ marginTop: 6 }}>
            <button onClick={() => toggleStatus(user)} style={{ marginRight: 8 }}>
              {user.isActive ? 'Deactivate' : 'Activate'}
            </button>
            <button onClick={() => toggleRole(user)}>
              Set {user.role === 'ADMIN' ? 'USER' : 'ADMIN'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
