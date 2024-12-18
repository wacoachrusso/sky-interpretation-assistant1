import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://xnlzqsoujwsffoxhhybk.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhubHpxc291andzZmZveGhoeWJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0ODA1ODUsImV4cCI6MjA1MDA1NjU4NX0.G-N5b6L3-208ox8jRHPj8NDyQAg8xIDST3r8v8Tlae8";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);