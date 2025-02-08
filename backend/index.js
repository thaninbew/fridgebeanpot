import express from 'express';
import dotenv from 'dotenv';
import { supabase } from './supabase.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.get('/api/test', async (req, res) => {
  try {
    const { data, error } = await supabase.from('your_table').select('*').limit(1);
    
    if (error) throw error;
    
    res.json({
      message: 'Successfully connected to Supabase',
      data
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 