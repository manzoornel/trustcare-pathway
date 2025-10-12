import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://vtsvzfqjuutfjixtyskg.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ0c3Z6ZnFqdXV0ZmppeHR5c2tnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA5ODI1OTcsImV4cCI6MjA1NjU1ODU5N30.RgvvyQ_64GKvC3jz0ISUpQKQMDClVwuFh4NSaQwawUE";
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
