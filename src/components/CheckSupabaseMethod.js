// CheckSupabaseMethod.js
import React, { useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://poaxhsurnoaohtmzdwon.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvYXhoc3Vybm9hb2h0bXpkd29uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk0Mzc5MTcsImV4cCI6MjA0NTAxMzkxN30.dLxi8cD1DL-_WudCw4K-D4bvgaOiFLs19I8X82A70d4';
const supabase = createClient(supabaseUrl, supabaseKey);

const CheckSupabaseMethod = () => {
  useEffect(() => {
    if (typeof supabase.auth.getSessionFromUrl === 'function') {
      console.log('getSessionFromUrl is available');
    } else {
      console.error('getSessionFromUrl is not available');
    }
  }, []);

  return (
    <div>
      <h1>Supabase Method Check</h1>
    </div>
  );
};

export default CheckSupabaseMethod;
