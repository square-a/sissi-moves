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
    const validSectionTypesForPage = structure.pages[page._type].allowedItems || [c.TYPE_STANDARD];
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
  const allowedSectionTypes = pagesStructure[page._type].allowedItems || [c.TYPE_STANDARD];
  const minSections = pagesStructure[page._type].minItems || 0;

  while(page._items.length + requiredSections.length < minSections) {
    const newSection = _createSection(allowedSectionTypes[0]);
    requiredSections.push(newSection);
  }

  return requiredSections;
}

export const getSectionsOverMaximum = (pagesStructure, page) => {
  const sectionsOverMaximum = [];
  const maxSections = pagesStructure[page._type].maxItems;
  const existingSections = [...page._items];

  while(existingSections.length > maxSections) {
    sectionsOverMaximum.push(existingSections.pop());
  }

  return sectionsOverMaximum;
}
