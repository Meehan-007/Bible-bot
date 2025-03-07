import { fileURLToPath } from 'url';
import { dirname } from 'path';

export const config = {
  __filename: fileURLToPath(import.meta.url),
  get __dirname() {
    return dirname(this.__filename);
  }
}; 