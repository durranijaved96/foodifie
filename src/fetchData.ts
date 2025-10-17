import { supabase } from '../src/supabase';

// Define the table name
const tableName = 'Project';

export async function fetchProjectData() {
  if (!supabase) {
    console.error('Supabase is not initialized.');
    return [];
  }

  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*'); // Use the wildcard to select all columns

    if (error) {
      console.error('Error fetching project data:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching project data:', error);
    return [];
  }
}
