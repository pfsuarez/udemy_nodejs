import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

export const __dirname = path.join(dirname(fileURLToPath(import.meta.url)), "..");