import * as c from '../constants';
import Logger from '../logger';
import { getContentId, pluralize } from '../utils';

const logger = new Logger();

export function addPages(content, minPages, structure) {
  if (content.pages.length < minPages) {
    const pagesToAdd : string[] = [];

    while(content.pages.length < minPages) {
      const newPage = {
        id: getContentId(),
        pageType: c.STANDARD_PAGE_TYPE,
      };

      content.pages.push(newPage);
      pagesToAdd.push(newPage.id);
    }

    logger.add({
      item: `%=p% new ${pluralize('page', pagesToAdd)} [%=pid%]`,
      prefix: c.LIST_ITEM,
      interpolations: { p: { str: pagesToAdd.length, lvl: 1 }, pid: { str: pagesToAdd.join(', '), lvl: 1 }}
    });
  }
}

export function removePages(content, maxPages) {
  if (content.pages.length > maxPages) {
    const pagesToRemove : string[] = [];
    while(content.pages.length > maxPages) {
      const removedPage : string = content.pages.pop().id;
      pagesToRemove.push(removedPage);
    }

    logger.add({
      item: `${pluralize('Page', pagesToRemove)} %=p%`,
      prefix: c.LIST_ITEM,
      interpolations: { p: { str: pagesToRemove.join(', '), lvl: 3 }}
    });
  }
}
