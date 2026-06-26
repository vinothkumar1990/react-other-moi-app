import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../utils/auth';

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();             // Clear session
    navigate('/login', { replace: true }); // Force navigation
  };

  return (
    <div>
      <h2>Welcome to Dashboard</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Dashboard;
