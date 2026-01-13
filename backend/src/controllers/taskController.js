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
 * POST /api/tasks
 * Create a new task
 */
const createTask = async (req, res) => {
  try {
    const { title, description, status, due_date } = req.body;
    const supabase = createUserClient(req.token);

    // Validation
    if (!title || title.trim() === '') {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Title is required'
      });
    }

    // Validate status if provided
    const validStatuses = ['pending', 'in-progress', 'completed'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        error: 'Validation Error',
        message: `Status must be one of: ${validStatuses.join(', ')}`
      });
    }

    // Prepare task data
    const taskData = {
      user_id: req.user.id,
      title: title.trim(),
      description: description ? description.trim() : null,
      status: status || 'pending',
      due_date: due_date || null
    };

    // Insert task into database
    const { data, error } = await supabase
      .from('tasks')
      .insert([taskData])
      .select()
      .single();

    if (error) {
      console.error('Error creating task:', error);
      return res.status(500).json({
        error: 'Database Error',
        message: 'Failed to create task',
        details: error.message
      });
    }

    res.status(201).json({
      message: 'Task created successfully',
      task: data
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred'
    });
  }
};

/**
 * GET /api/tasks
 * Fetch all tasks for the logged-in user
 * Supports filtering by ?status=
 */
const getTasks = async (req, res) => {
  try {
    const { status } = req.query;
    const supabase = createUserClient(req.token);

    // Build query
    let query = supabase
      .from('tasks')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    // Apply status filter if provided
    if (status) {
      const validStatuses = ['pending', 'in-progress', 'completed'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          error: 'Validation Error',
          message: `Status must be one of: ${validStatuses.join(', ')}`
        });
      }
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching tasks:', error);
      return res.status(500).json({
        error: 'Database Error',
        message: 'Failed to fetch tasks',
        details: error.message
      });
    }

    res.status(200).json({
      message: 'Tasks fetched successfully',
      count: data.length,
      tasks: data
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred'
    });
  }
};

/**
 * PUT /api/tasks/:id
 * Update task details
 */
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, due_date } = req.body;
    const supabase = createUserClient(req.token);

    // Validate status if provided
    const validStatuses = ['pending', 'in-progress', 'completed'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        error: 'Validation Error',
        message: `Status must be one of: ${validStatuses.join(', ')}`
      });
    }

    // Build update object (only include fields that are provided)
    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description ? description.trim() : null;
    if (status !== undefined) updateData.status = status;
    if (due_date !== undefined) updateData.due_date = due_date || null;

    // Validate that at least one field is being updated
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'At least one field (title, description, status, due_date) must be provided for update'
      });
    }

    // Validate title if being updated
    if (updateData.title !== undefined && updateData.title === '') {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Title cannot be empty'
      });
    }

    // Update task (RLS ensures user can only update their own tasks)
    const { data, error } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', req.user.id) // Extra safety check
      .select()
      .single();

    if (error) {
      console.error('Error updating task:', error);
      return res.status(500).json({
        error: 'Database Error',
        message: 'Failed to update task',
        details: error.message
      });
    }

    if (!data) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Task not found or you do not have permission to update it'
      });
    }

    res.status(200).json({
      message: 'Task updated successfully',
      task: data
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred'
    });
  }
};

/**
 * DELETE /api/tasks/:id
 * Delete a task
 */
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const supabase = createUserClient(req.token);

    // Delete task (RLS ensures user can only delete their own tasks)
    const { data, error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)
      .eq('user_id', req.user.id) // Extra safety check
      .select()
      .single();

    if (error) {
      console.error('Error deleting task:', error);
      return res.status(500).json({
        error: 'Database Error',
        message: 'Failed to delete task',
        details: error.message
      });
    }

    if (!data) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Task not found or you do not have permission to delete it'
      });
    }

    res.status(200).json({
      message: 'Task deleted successfully',
      task: data
    });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred'
    });
  }
};

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask
};
