import { useNavigate } from 'react-router-dom';

export function DashboardPage(): JSX.Element {
  const navigate = useNavigate();
  const fullName = localStorage.getItem('fullName') ?? 'User';
  const role = localStorage.getItem('role');

  return (
    <div>
      <h2>Welcome, {fullName}</h2>
      <p>Role: {role}</p>
      <button
        onClick={() => {
          localStorage.clear();
          navigate('/login');
        }}
      >
        To Logout please click here
      </button>
    </div>
  );
}
