import { prompt } from 'inquirer';
import * as fs from 'fs';
import * as path from 'path';

import * as c from './constants';
import Logger from './logger';
import * as m from './migrations';
import { readJSON } from './utils';

const logger = new Logger();

export = async function run() {
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

  let hasChanges = false;

  m.removePages(content, maxPages);
  m.removePageSections(content, maxSectionsPerPage, structure);
  m.removeMetaFields(content, structure);
  m.removePageFields(content, structure);
  m.removeSectionFields(content, structure);

  if (logger.getListLength() > 0) {
    hasChanges = true;
    logger.log({ item: '' });
    logger.log({
      item: 'I will %=R% the following:'.toUpperCase(),
      prefix: '',
      interpolations: { R: { str: 'REMOVE', lvl: 3 }}
    });
    logger.log({ item: c.DIVIDER_LINE });
    logger.logList();
  }

  m.addPages(content, minPages, structure);
  m.addSections(content, minSectionsPerPage, structure);
  m.addMetaFields(content, structure);
  m.addPageFields(content, structure);
  m.addSectionFields(content, structure);

  if (logger.getListLength() > 0) {
    hasChanges = true;
    logger.log({ item: '' });
    logger.log({
      item: 'I will add the following:'.toUpperCase(),
      prefix: '',
      interpolations: { r: { str: 'add', lvl: 1 }}
    });
    logger.log({ item: c.DIVIDER_LINE });
    logger.logList();
  }

  if (hasChanges) {
    logger.log({ item: '' });
    const answers = await prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: 'Do you want me to save these changes?',
        default: true,
      },
      {
        type: 'confirm',
        name: 'backup',
        message: 'Do you want me to create a backup file?',
        default: true,
        when: a => a.confirm,
      },
    ]);

    if (answers.confirm) {
      if (answers.backup) {
        fs.copyFileSync(contentPath, `${contentPath}.backup`);
      }
      fs.writeFileSync(contentPath, JSON.stringify(content, null, 2));
      logger.log({ item: `New content.json saved.${answers.backup ? ' Backup saved as content.json.backup' : ''}` });
      return;
    }
  }
  
  logger.log({ item: 'Nothing changed.' });
}
