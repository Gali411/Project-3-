import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, '../../../client/dist/index.html')); 
  });
  
  export default router;
