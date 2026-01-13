import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if environment variables are missing or contain placeholder values
const isPlaceholder = (value) => {
  if (!value) return true;
  return value.includes('your-project') || 
         value.includes('your_supabase') || 
         value === 'your_supabase_anon_key_here' ||
         value === 'your_supabase_project_url';
};

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey || isPlaceholder(supabaseUrl) || isPlaceholder(supabaseAnonKey)) {
  console.error('⚠️ Missing or invalid Supabase environment variables!');
  console.error('Please create a .env file in the frontend folder with:');
  console.error('VITE_SUPABASE_URL=your_actual_supabase_url');
  console.error('VITE_SUPABASE_ANON_KEY=your_actual_supabase_anon_key');
  console.error('\nYou can copy env.example to .env and fill in your credentials.');
  console.error('The app will still load, but authentication will not work until you configure these variables.');
}

// Create Supabase client (will use placeholder values if env vars are missing)
// This prevents the app from crashing, but auth features won't work until configured
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);
