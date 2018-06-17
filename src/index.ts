import * as path from 'path';

import * as c from './constants';
import logger from './logger';
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

  logger('');
  logger('Sissi will remove the following:'.toUpperCase());
  logger(c.DIVIDER_LINE);

  m.removePages(content, maxPages);
  m.removePageSections(content, maxSectionsPerPage, structure);
  m.removeMetaFields(content, structure);
  m.removePageFields(content, structure);

  logger('');
  logger('Sissi will add the following:'.toUpperCase());
  logger(c.DIVIDER_LINE);

  m.addPages(content, minPages, structure);
  m.addSections(content, minSectionsPerPage, structure);

}
