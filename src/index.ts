import * as path from 'path';

import * as m from './migrations';
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

  const {
    minPages,
    maxPages,
    minSectionsPerPage,
    maxSectionsPerPage,
  } = structure.settings;

  m.removePages(content, maxPages);
  m.removePageSections(content, maxSectionsPerPage, structure);

  m.addPages(content, minPages, structure);
  m.addSections(content, minSectionsPerPage, structure);
}
