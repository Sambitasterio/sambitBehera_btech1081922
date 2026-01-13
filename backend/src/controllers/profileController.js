const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

/**
 * Create a Supabase client with user's access token for RLS
 */
const createUserClient = (accessToken) => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
  
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  });
  
  return supabase;
};

/**
 * GET /api/profile
 * Get user profile information
 */
const getProfile = async (req, res) => {
  try {
    const supabase = createUserClient(req.token);

    // Get user data from Supabase Auth
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'User not found'
      });
    }

    // Return user profile (email, metadata, etc.)
    res.status(200).json({
      message: 'Profile fetched successfully',
      profile: {
        id: user.id,
        email: user.email,
        email_confirmed_at: user.email_confirmed_at,
        created_at: user.created_at,
        updated_at: user.updated_at,
        metadata: user.user_metadata || {}
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred'
    });
  }
};

/**
 * PUT /api/profile
 * Update user profile
 */
const updateProfile = async (req, res) => {
  try {
    const { email, metadata } = req.body;
    const supabase = createUserClient(req.token);

    // Build update object
    const updateData = {};
    
    if (email !== undefined) {
      updateData.email = email;
    }

    if (metadata !== undefined) {
      updateData.data = metadata; // Supabase uses 'data' for user_metadata
    }

    // Validate that at least one field is being updated
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'At least one field (email, metadata) must be provided for update'
      });
    }

    // Validate email format if provided
    if (updateData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updateData.email)) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Invalid email format'
      });
    }

    // Update user profile
    const { data, error } = await supabase.auth.updateUser(updateData);

    if (error) {
      console.error('Error updating profile:', error);
      return res.status(500).json({
        error: 'Database Error',
        message: 'Failed to update profile',
        details: error.message
      });
    }

    res.status(200).json({
      message: 'Profile updated successfully',
      profile: {
        id: data.user.id,
        email: data.user.email,
        email_confirmed_at: data.user.email_confirmed_at,
        created_at: data.user.created_at,
        updated_at: data.user.updated_at,
        metadata: data.user.user_metadata || {}
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred'
    });
  }
};

/**
 * DELETE /api/profile
 * Delete user account
 * Deletes user's tasks and optionally the user account if service role key is configured
 */
const deleteAccount = async (req, res) => {
  try {
    const supabase = createUserClient(req.token);
    const userId = req.user.id;

    // Delete user's tasks (CASCADE should handle this automatically, but being explicit)
    const { error: tasksError } = await supabase
      .from('tasks')
      .delete()
      .eq('user_id', userId);

    if (tasksError) {
      console.error('Error deleting user tasks:', tasksError);
      // Continue even if task deletion fails (CASCADE will handle it)
    }

    // Try to delete user account if service role key is available
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (serviceRoleKey) {
      const supabaseUrl = process.env.SUPABASE_URL;
      const { createClient } = require('@supabase/supabase-js');
      const adminClient = createClient(supabaseUrl, serviceRoleKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      });

      const { error: deleteError } = await adminClient.auth.admin.deleteUser(userId);
      
      if (deleteError) {
        console.error('Error deleting user account:', deleteError);
        return res.status(200).json({
          message: 'User data deleted successfully. Account deletion failed - please delete from Supabase dashboard.',
          accountDeleted: false
        });
      }

      return res.status(200).json({
        message: 'Account and all associated data deleted successfully',
        accountDeleted: true
      });
    }

    // If no service role key, just delete data
    res.status(200).json({
      message: 'User data deleted successfully. Please delete your account from Supabase dashboard.',
      accountDeleted: false,
      note: 'To enable automatic account deletion, add SUPABASE_SERVICE_ROLE_KEY to your .env file'
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred'
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  deleteAccount
};
