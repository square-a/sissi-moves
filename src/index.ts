import * as fs from 'fs';
import * as path from 'path';

import migrate from './migrate';
import { readJSON } from './utils';

export = function run() {
  const contentPath = path.join(process.cwd(), 'content.json');
  const structurePath = path.join(process.cwd(), 'structure.json');

  const { error: strError, file: structure } = readJSON(structurePath);
  if (strError) {
    console.log(strError);
    return;
  }

  const { error: cntError, file: content } = readJSON(contentPath);
  if (cntError) {
    console.log(cntError);
    return;
  }

  migrate(content, structure);
}
