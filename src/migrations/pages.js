import * as c from '../constants';
import { getContentId } from '../utils';

export const _createPage = (_type = c.TYPE_STANDARD) => ({
  _id: getContentId(),
  _items: [],
  _type,
});

export const _getProtectedPageTypes = pages => Object.entries(pages)
  .reduce((acc, [type, page]) => {
    if (page.isProtected) acc.push(type);
    return acc;
  }, []);

export const getInvalidPageIds = (pagesStructure, pagesContent) => {
  const invalidPageIds = [];
  const validPageTypes = Object.keys(pagesStructure);

  Object.values(pagesContent).forEach(page => {
    if (!validPageTypes.includes(page._type)) {
      invalidPageIds.push(page._id);
    }
  });

  return invalidPageIds;
}

export const getPagesOverMaximum = (structure, pagesContent) => {
  const pagesOverMaximum = [];
  const protectedPageTypes = _getProtectedPageTypes(structure.pages);
  const maxAmountOfPages = structure.global.maxItems;
  const existingPagesArray = Object.values(pagesContent).reverse();

  while (existingPagesArray.length > maxAmountOfPages) {
    const pageIndex = existingPagesArray
      .findIndex(({ _type }) => !protectedPageTypes.includes(_type));

    if (pageIndex !== -1) {
      const [pageToRemove] = existingPagesArray.splice(pageIndex, 1);
      pagesOverMaximum.push(pageToRemove._id);

    } else {
      break;
    }
  }

  return pagesOverMaximum;
}

export const getRequiredPages = (structure, pagesContent) => {
  const requiredPages = [];
  const protectedPageTypes = _getProtectedPageTypes(structure.pages);
  const minAmountOfPages = structure.global.minItems;
  const existingPagesArray = Object.values(pagesContent);

  protectedPageTypes.forEach(type => {
    const hasType = existingPagesArray.some(page => type === page._type);
    if (!hasType) {
      requiredPages.push(_createPage(type));
    }
  });

  let totalAmountOfPages = existingPagesArray.length + requiredPages.length;
  while (totalAmountOfPages < minAmountOfPages) {
    requiredPages.push(_createPage());
    totalAmountOfPages += 1;
  }

  return requiredPages;
}
