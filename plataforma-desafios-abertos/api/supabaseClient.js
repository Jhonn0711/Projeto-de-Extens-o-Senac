const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mlrldrstowikdkvrqiyg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1scmxkcnN0b3dpa2RrdnJxaXlnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTUwMDY5MSwiZXhwIjoyMDY3MDc2NjkxfQ.mCAg__Ssa7TcEI0Tk6-uTZ9mahZi14rxYQU1z6xgi0s';

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
