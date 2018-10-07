import _get from 'lodash.get';

import * as c from '../constants';
import { getContentId } from '../utils';

export const _createSection = (type) => ({
  _id: getContentId(),
  _type: type || c.TYPE_STANDARD,
});

export const getInvalidSectionIds = (structure, content) => {
  let invalidSectionIds = [];
  const validSectionTypes = Object.keys(structure.sections);

  Object.values(content.pages).forEach(page => {
    const validSectionTypesForPage = structure.global.maxItems > 1
      ? structure.pages[page._type].allowedItems || [c.TYPE_STANDARD]
      : validSectionTypes;

    const invalidSectionIdsForPage = page._items.filter(sectionId => {
      const sectionType = content.sections[sectionId]._type;

      return !(validSectionTypes.includes(sectionType) && validSectionTypesForPage.includes(sectionType));
    });
    invalidSectionIds = [...invalidSectionIds, ...invalidSectionIdsForPage];
  });

  return invalidSectionIds;
}

export const getRequiredSectionsForPage = (pagesStructure, page) => {
  const requiredSections = [];
  const allowedSectionTypes = _get(pagesStructure, `${page._type}.allowedItems`, [c.TYPE_STANDARD]);
  const minSections = _get(pagesStructure, `${page._type}.minItems`, 0);

  let totalAmountOfSections = page._items.length;
  while(totalAmountOfSections < minSections) {
    requiredSections.push(_createSection(allowedSectionTypes[0]));
    totalAmountOfSections += 1;
  }

  return requiredSections;
}

export const getSectionsOverMaximum = (pagesStructure, page) => {
  const maxSections = _get(pagesStructure, `${page._type}.maxItems`, Infinity);

  return page._items.slice(maxSections);
}
