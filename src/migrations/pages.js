import * as c from '../constants';
import { getContentId } from '../utils';

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

export const getPagesOverMaximum = (structure, pagesContent) => {
  const pagesOverMaximum = [];
  const protectedPageTypes = _getProtectedPageTypes(structure.pages);
  const maxAmountOfPages = structure.global.maxItems;
  const existingPagesArray = Object.entries(pagesContent);

  while (existingPagesArray.length > maxAmountOfPages) {
    let pageToBeRemoved = existingPagesArray.pop();

    while (pageToBeRemoved && protectedPageTypes.includes(pageToBeRemoved[1]._type)) {
      pageToBeRemoved = existingPagesArray.pop();
    }

    if (pageToBeRemoved) {
      pagesOverMaximum.push(pageToBeRemoved[0]);
    }
  }

  return pagesOverMaximum;
}

export const getRequiredPages = (structure, pagesContent) => {
  const requiredPages = [];
  const protectedPageTypes = _getProtectedPageTypes(structure.pages);
  const minAmountOfPages = structure.global.minItems;
  const existingPagesArray = Object.entries(pagesContent);

  protectedPageTypes.forEach(type => {
    const hasType = !!existingPagesArray.find(([id, page]) => type === page._type);
    if (!hasType) {
      requiredPages.push(_createPage(type));
    }
  });

  while (existingPagesArray.length + requiredPages.length < minAmountOfPages) {
    requiredPages.push(_createPage());
  }

  return requiredPages;
}
