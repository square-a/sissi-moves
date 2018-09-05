import * as c from '../constants';
import Logger from '../logger';
import { getContentId, pluralize } from '../utils';

export const _createPage = (_type = c.TYPE_STANDARD) => ({
  _id: getContentId(),
  _type,
});

export const _getProtectedPageTypes = pages => Object.entries(pages)
  .filter(entry => entry[1].isProtected)
  .map(entry => entry[0]);

export const getInvalidPageIds = (pagesStructure, pagesContent) => {
  const invalidPageIds = [];
  const validPageTypes = Object.keys(pagesStructure);

  Object.entries(pagesContent).forEach(([id, page]) => {
    if (!validPageTypes.includes(page._type)) {
      invalidPageIds.push(id);
    }
  })

  return invalidPageIds;
}

export const getRequiredPages = (structure, pagesContent) => {
  const newPages = [];
  const protectedPageTypes = _getProtectedPageTypes(structure.pages);
  const minAmountOfPages = structure.global.minItems;
  const existingPagesArray = Object.entries(pagesContent);

  protectedPageTypes.forEach(type => {
    const hasType = !!existingPagesArray.find(([id, page]) => type === page._type);
    if (!hasType) {
      newPages.push(_createPage(type));
    }
  });

  while (existingPagesArray.length + newPages.length < minAmountOfPages) {
    newPages.push(_createPage());
  }

  return newPages;
}

const logger = new Logger();

export function addPages(content, minPages, structure) {
  if (content.pages.length < minPages) {
    const pagesToAdd = [];

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
    const pagesToRemove = [];
    while(content.pages.length > maxPages) {
      const removedPage = content.pages.pop().id;
      pagesToRemove.push(removedPage);
    }

    logger.add({
      item: `${pluralize('Page', pagesToRemove)} %=p%`,
      prefix: c.LIST_ITEM,
      interpolations: { p: { str: pagesToRemove.join(', '), lvl: 3 }}
    });
  }
}
