import { createClient } from '@supabase/supabase-js'
const SUPABASE_URL = 'https://bmqzamhjljmqzleqohey.supabase.co'

const supabase = createClient(
  SUPABASE_URL,
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtcXphbWhqbGptcXpsZXFvaGV5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5OTk0MDM1NywiZXhwIjoyMDE1NTE2MzU3fQ.2etSEPdz4yxHcLA0eP9lKsslhpCXHXjXHWYT9w5zYR8'
)

export { supabase }
