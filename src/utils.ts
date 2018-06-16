import * as fs from 'fs';

export function readJSON(path) {
  try {
    const file = fs.readFileSync(path);
    return { error: false, file: JSON.parse(file.toString()) };
  } catch(error) {
    if (error.code === 'ENOENT') {
      return { error: `File not found. Are you sure it exists? [${path}]` };
    } else if (error.toString().includes('SyntaxError')) {
       return { error: `Couldn\'t parse file. Please check for a valid JSON format. [${path}]` };
    }
    return { error: 'Couldn\'t read file.' };
  }
}

export function getContentId() {
  return Math.random().toString(36).substring(2, 9);
}
