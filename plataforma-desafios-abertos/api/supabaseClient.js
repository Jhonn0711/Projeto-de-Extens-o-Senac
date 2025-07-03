const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mlrldrstowikdkvrqiyg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1scmxkcnN0b3dpa2RrdnJxaXlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1MDA2OTEsImV4cCI6MjA2NzA3NjY5MX0.UGfKiZOcXG9_Mn5_Ijc1JnOeFIcUeYenoTDlYN-YPjA';

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
