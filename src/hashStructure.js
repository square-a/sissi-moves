import fs from 'fs';
import path from 'path';
import { createHash } from 'crypto';

import { readJSON } from './utils';

export default function hashStructure(doSave) {
  const structurePath = path.join(process.cwd(), 'structure.json');
  const hashPath = path.join(process.cwd(), '.sthash');
  const { error: strError, file: structure } = readJSON(structurePath);

  if (strError) {
    console.log(strError);
    return;
  }

  const structureString = JSON.stringify(structure);
  const stHash = createHash('sha256').update(structureString).digest('hex');

  if (doSave) {
    fs.writeFileSync(hashPath, stHash);

  } else {
    // TODO: return hash to parent process
    console.log(stHash);
  }
};
