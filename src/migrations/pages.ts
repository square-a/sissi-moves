import * as c from '../constants';
import logger from '../logger';
import { getContentId, pluralize } from '../utils';

export function addPages(content, minPages, structure) {
  if (content.pages.length < minPages) {
    const pagesToAdd : string[] = [];

    while(content.pages.length < minPages) {
      const newPage = {
        id: getContentId(),
        type: c.STANDARD_PAGE_TYPE,
      };

      content.pages.push(newPage);
      pagesToAdd.push(newPage.id);
    }

    logger(
      `%=p% new ${pluralize('page', pagesToAdd)} [%=pid%]`,
      c.LIST_ITEM,
      { p: { str: pagesToAdd.length, lvl: 1 }, pid: { str: pagesToAdd.join(', '), lvl: 1 }}
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
      `${pluralize('Page', pagesToRemove)} %=p%`,
      c.LIST_ITEM,
      { p: { str: pagesToRemove.join(', '), lvl: 3 }}
    );
  }
}
