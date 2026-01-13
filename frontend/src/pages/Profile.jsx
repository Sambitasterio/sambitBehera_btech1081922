import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabaseClient';
import api, { getApiBaseURL } from '../services/api';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    avatar_url: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/profile');
      const profileData = response.data.profile;
      setProfile(profileData);
      setFormData({
        email: profileData.email || '',
        full_name: profileData.metadata?.full_name || '',
        avatar_url: profileData.metadata?.avatar_url || ''
      });
    } catch (err) {
      console.error('Error fetching profile:', err);
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        setError('Failed to load profile. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      // Prepare metadata
      const metadata = {
        full_name: formData.full_name || null,
        avatar_url: formData.avatar_url || null
      };

      const response = await api.put('/profile', {
        email: formData.email,
        metadata: metadata
      });

      setProfile(response.data.profile);
      setSuccess('Profile updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
      
      // Provide more specific error messages
      if (err.code === 'ECONNREFUSED' || err.message?.includes('Network Error') || !err.response) {
        const apiUrl = getApiBaseURL();
        setError(`Cannot connect to backend server at ${apiUrl}. Please check if the backend is running and accessible.`);
      } else if (err.response?.status === 401) {
        setError('Authentication failed. Please log in again.');
      } else if (err.response?.status === 400) {
        setError(err.response.data?.message || 'Invalid data. Please check your input.');
      } else if (err.response?.status === 500) {
        setError(err.response.data?.details || err.response.data?.message || 'Server error. Please try again later.');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.details) {
        setError(err.response.data.details);
      } else {
        setError('Failed to update profile. Please check your connection and try again.');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    setError('');

    try {
      // Delete user's data and account via backend
      const response = await api.delete('/profile');
      
      // Sign out the user
      await supabase.auth.signOut();
      
      // Show success message and redirect
      if (response.data.accountDeleted) {
        setSuccess('Your account and all data have been deleted successfully.');
      } else {
        setSuccess('Your account data has been deleted. Please delete your account from the Supabase dashboard if needed.');
      }
      
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      console.error('Error deleting account:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to delete account. Please try again or contact support.');
      }
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-white/70 hover:text-white mb-4 flex items-center gap-2 transition-colors"
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Dashboard
          </button>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Profile Settings
          </h1>
          <p className="text-white/70">Manage your account information</p>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-green-200">
            {success}
          </div>
        )}

        {/* Profile Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 md:p-8 mb-6">
          <h2 className="text-2xl font-bold text-white mb-6">Edit Profile</h2>

          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white/90 mb-2">
                Email <span className="text-red-400">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={saving}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-white/90 mb-2">
                Full Name
              </label>
              <input
                id="full_name"
                name="full_name"
                type="text"
                value={formData.full_name}
                onChange={handleChange}
                disabled={saving}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="avatar_url" className="block text-sm font-medium text-white/90 mb-2">
                Avatar URL
              </label>
              <input
                id="avatar_url"
                name="avatar_url"
                type="url"
                value={formData.avatar_url}
                onChange={handleChange}
                disabled={saving}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                placeholder="https://example.com/avatar.jpg"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={saving}
                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Update Profile'}
              </button>
            </div>
          </form>
        </div>

        {/* Account Info */}
        {profile && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6 md:p-8 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">Account Information</h2>
            <div className="space-y-3 text-white/80">
              <div>
                <span className="font-semibold">User ID:</span> {profile.id}
              </div>
              <div>
                <span className="font-semibold">Account Created:</span>{' '}
                {new Date(profile.created_at).toLocaleDateString()}
              </div>
              {profile.email_confirmed_at && (
                <div>
                  <span className="font-semibold">Email Verified:</span>{' '}
                  {new Date(profile.email_confirmed_at).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Delete Account Section */}
        <div className="bg-red-500/10 backdrop-blur-lg rounded-2xl shadow-xl border border-red-500/30 p-6 md:p-8">
          <h2 className="text-2xl font-bold text-red-300 mb-4">Danger Zone</h2>
          <p className="text-white/70 mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>

          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition duration-200"
            >
              Delete Account
            </button>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                <p className="text-red-200 font-semibold mb-2">
                  Are you absolutely sure?
                </p>
                <p className="text-red-200/80 text-sm">
                  This action cannot be undone. This will permanently delete your account
                  and all associated data including all your tasks.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={deleting}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition duration-200 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleting ? 'Deleting...' : 'Yes, Delete My Account'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
