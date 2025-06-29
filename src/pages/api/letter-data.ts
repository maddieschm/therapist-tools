import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import { promises as fs } from 'fs';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { file } = req.query;

  if (!file || typeof file !== 'string') {
    return res.status(400).json({ error: 'A "file" query parameter must be provided.' });
  }

  const baseDir = path.join(process.cwd(), 'public', 'lettergenerator');
  const filePath = path.join(baseDir, file);

  if (!filePath.startsWith(baseDir)) {
    return res.status(403).json({ error: 'Access to the requested file is forbidden.' });
  }

  try {
    const fileContents = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    res.status(200).json(data);
  } catch (e) {
    // This log now uses the 'e' variable, which will fix the linter error.
    console.error(`\n--- API ROUTE FAILED ---`);
    console.error(`Could not read the file at path: ${filePath}`);
    console.error(`The specific error was:`, e); // This line uses 'e'.
    console.error(`------------------------\n`);
    
    res.status(404).json({ error: 'The requested file was not found.' });
  }
}