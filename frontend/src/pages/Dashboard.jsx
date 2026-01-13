import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabaseClient';
import api from '../services/api';
import KanbanBoard from '../components/KanbanBoard';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/login');
        return;
      }

      setUser(session.user);
    };

    checkUser();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-lg border-b border-white/20 p-4 md:p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
              Task Management
            </h1>
            {user && (
              <p className="text-white/70 text-sm md:text-base">
                Welcome, {user.email}
              </p>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/profile')}
              className="px-4 py-2 md:px-6 md:py-2 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition duration-200 text-sm md:text-base flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span className="hidden md:inline">Profile</span>
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 md:px-6 md:py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition duration-200 text-sm md:text-base"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="max-w-7xl mx-auto">
        <KanbanBoard />
      </div>
    </div>
  );
};

export default Dashboard;
