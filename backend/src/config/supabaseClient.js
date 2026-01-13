const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// Check if credentials are valid (not placeholder values)
const isPlaceholder = (value) => {
  if (!value) return true;
  return value.includes('your-project') || 
         value.includes('your_supabase') || 
         value === 'your_supabase_anon_key' ||
         value === 'your_supabase_project_url' ||
         value.includes('placeholder');
};

const hasValidCredentials = supabaseUrl && supabaseAnonKey && 
                           !isPlaceholder(supabaseUrl) && 
                           !isPlaceholder(supabaseAnonKey);

if (!hasValidCredentials) {
  console.error('⚠️  WARNING: Missing or invalid Supabase environment variables!');
  console.error('Please create a .env file in the backend folder with:');
  console.error('SUPABASE_URL=your_supabase_project_url');
  console.error('SUPABASE_ANON_KEY=your_supabase_anon_key');
  console.error('\nThe server will start but authenticated API calls will fail until these are configured.');
}

// Create Supabase client
let supabase;
if (hasValidCredentials) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  // Create a dummy object with the same structure to prevent crashes
  supabase = {
    auth: {
      getUser: async () => {
        throw new Error('Supabase is not configured. Please set SUPABASE_URL and SUPABASE_ANON_KEY in your .env file.');
      }
    }
  };
}

// Add configuration flag as a property
Object.defineProperty(supabase, 'isConfigured', {
  value: hasValidCredentials,
  writable: false,
  enumerable: true
});

module.exports = supabase;
