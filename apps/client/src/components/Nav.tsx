import { Link } from 'react-router-dom';

export function Nav(): JSX.Element {
  const role = localStorage.getItem('role');

  return (
    <nav className="top-nav">
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/items">Items</Link>
      <Link to="/vendors">Vendors</Link>
      <Link to="/indents">Indents</Link>
      <Link to="/mis">MI</Link>
      <Link to="/rfqs">RFQ</Link>
      {role === 'ADMIN' && <Link to="/admin/users">Manage Users</Link>}
    </nav>
  );
}
