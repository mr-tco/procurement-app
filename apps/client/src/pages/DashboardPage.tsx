import { useNavigate } from 'react-router-dom';

export function DashboardPage(): JSX.Element {
  const navigate = useNavigate();
  const fullName = localStorage.getItem('fullName') ?? 'User';
  const role666 = localStorage.getItem('role');

  return (
    <div>
      <h2>Welcome123, {fullName}</h2>
      <p>Rolerrrrrrr: {role666}</p>
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
