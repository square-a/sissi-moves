import * as c from '../constants';
import logger from '../logger';
import { getContentId } from '../utils';

export function addPages(content, minPages, structure) {
  if (content.pages.length < minPages) {
    let pagesToAdd = 0;

    while(content.pages.length < minPages) {
      const newPage = {
        id: getContentId(),
        type: c.STANDARD_PAGE_TYPE,
      };

      const { fields } = structure.pages[newPage.type];
      fields.forEach(field => newPage[field] = '');

      content.pages.push(newPage);
      pagesToAdd += 1;
    }

    logger(
      `%=p% new page(s) will be added.`,
      { p: { str: pagesToAdd.toString(), lvl: 1 }}
    );
  }
}

export function removePages(content, maxPages) {
  if (content.pages.length > maxPages) {
    const pagesToRemove : string[] = [];
    while(content.pages.length > maxPages) {
      const removedPage : string = content.pages.pop().id;
      pagesToRemove.push(removedPage);
    }

    logger(
      `Page(s) %=p% will be removed`,
      { p: { str: pagesToRemove.join(', '), lvl: 3 }}
    );
  }
}
