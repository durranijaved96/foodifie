/* eslint-disable @typescript-eslint/no-unused-vars */
import { createClient, SupabaseClient } from '@supabase/supabase-js';


const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://oiljglujpxrykeabezwz.supabase.co';
const supabaseApiKey = process.env.REACT_APP_SUPABASE_API_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9pbGpnbHVqcHhyeWtlYWJlend6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4MjUwNzMsImV4cCI6MjA3NDQwMTA3M30.bsnhTBrv-LW_xIOgqMzcBg3OF-UPWvWBnLOKG_UsZSc';


export const supabase: SupabaseClient | null = supabaseUrl && supabaseApiKey ? createClient(supabaseUrl, supabaseApiKey) : null;
