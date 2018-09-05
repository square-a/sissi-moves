import { prompt } from 'inquirer';
import fs from 'fs';
import path from 'path';

import * as c from './constants';
import Content from './Content';
import Logger from './logger';
import * as m from './migrations';
import { readJSON } from './utils';

const logger = new Logger();

export default async function migrate() {
  const contentPath = path.join(process.cwd(), 'content.json');
  const structurePath = path.join(process.cwd(), 'structure.json');

  const { error: strError, file: structure } = readJSON(structurePath);
  if (strError) {
    console.log(strError);
    return;
  }

  const { error: cntError, file: content } = readJSON(contentPath, true);
  if (cntError) {
    console.log(cntError);
    return;
  }

  const newContent = new Content(content, structure);

  newContent.migratePages()
    .migrateSections()
    .migrateFields();

  const isInitialContent = JSON.stringify(content) === '{}';
  const hasContentChanged = JSON.stringify(content) !== JSON.stringify(newContent.getContent());

  if (hasContentChanged) {
    let message = 'New content.json created.';

    if (!isInitialContent) {
      fs.copyFileSync(contentPath, `${contentPath}.backup`);
      message += ' Backup saved as content.json.backup';
    }

    fs.writeFileSync(contentPath, JSON.stringify(newContent.getContent(), null, 2));
    logger.log({ item: message });
  }
}
