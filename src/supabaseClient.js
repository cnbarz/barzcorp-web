import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xtljfwbvumquxnwyhyds.supabase.co'

const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0bGpmd2J2dW1xdXhud3loeWRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0NjM5NjUsImV4cCI6MjA5MTAzOTk2NX0.hb0KlKUNaWUUhO8lvvOdAs7lfzTMtXlc1TTah1Lc868'

export const supabase = createClient(supabaseUrl, supabaseKey)