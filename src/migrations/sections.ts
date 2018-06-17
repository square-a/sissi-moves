import _cloneDeep = require('lodash.clonedeep');
import _get = require('lodash.get');

import * as c from '../constants';
import Logger from '../logger';
import { getContentId, pluralize } from '../utils';

const logger = new Logger();

export function addSections(content, minSections, structure) {
  content.pages.forEach(page => {
    page.sections = page.sections || [];
    if (page.sections.length < minSections) {
      let sectionsToAdd : string[] = [];
      let hasMissingSections;

      while(page.sections.length < minSections || hasMissingSections) {
        hasMissingSections = false;
        const missingSectionTypes = getMissingSectionTypes(content, page.id, structure);
        const sectionType = missingSectionTypes.pop() || c.STANDARD_SECTION_TYPE;

        if (missingSectionTypes.length) {
          hasMissingSections = true;
        }
        const sectionId = getContentId();

        const newSection = {
          id: sectionId,
          sectionType: sectionType,
        };

        content.sections[sectionId] = newSection;
        page.sections.push(sectionId);
        sectionsToAdd.push(sectionId);
      }

      logger.add({
        item: `%=s% new ${pluralize('section', sectionsToAdd)} to page %=p% [%=sid%]`,
        prefix: c.LIST_ITEM,
        interpolations: {
          s: { str: sectionsToAdd.length, lvl: 1 },
          p: { str: page.id, lvl: 2 },
          sid: { str: sectionsToAdd.join(', '), lvl: 1 },
        }
      });
    }
  });
}

export function removePageSections(content, maxSections, structure) {
  content.pages.forEach(page => {
    if (page.sections.length > maxSections) {
      const requiredSectionTypes = getRequiredSectionTypes(structure, page.pageType);
      const pageSections = getPageSections(content, page.id);
      const sectionsToRemove : string[] = [];

      while(page.sections.length > maxSections) {
        let hasRemoved = false;
        for (let i = page.sections.length - 1; i >= 0; i--) {
          if (!requiredSectionTypes.includes(pageSections[i].sectionType)) {
            const removedSection = page.sections.splice(i, 1);
            sectionsToRemove.push(removedSection);
            hasRemoved = true;
            break;
          }
        }

        if (!hasRemoved) {
          logger.add({
            item: 'Page %=p% has too many required sections. Can\'t remove them. %=c%',
            prefix: c.LIST_ITEM,
            interpolations: { p: { str: page.id, lvl: 4 }, c: { str: c.CHECK_MANUALLY, lvl: 4 }}
          });
          return;
        }
      }

      const sections = sectionsToRemove.join(', ');
      logger.add({
        item: `${pluralize('Section', sectionsToRemove)} %=s% from page %=p%`,
        prefix: c.LIST_ITEM,
        interpolations: { s: { str: sections, lvl: 3 }, p: { str: page.id, lvl: 2 }}
      });
    }
  });
}

export function removeUnusedSections(content) {
  const sectionsToRemove = Object.keys(content.sections)
    .filter(section => !content.pages.some(page => page.sections.includes(section)));

  sectionsToRemove.forEach(section => {
    delete content.sections[section];
  });

  logger.add({
    item: `Unused ${pluralize('section', sectionsToRemove)} %=s%`,
    prefix: c.LIST_ITEM,
    interpolations: { s: { str: sectionsToRemove.join(', '), lvl: 3 }}
  });
}

function getPageSections(content, pageId) {
  const page = content.pages.find(p => p.id === pageId) || {};
  const sectionIds = page.sections || [];
  return sectionIds.map(sId => _cloneDeep(_get(content.sections, sId, {})));
}

function getRequiredSectionTypes(structure, pageType) {
  return _get(structure.pages, `${pageType}.requiredSections`, []);
}

function getMissingSectionTypes(content, pageId, structure) {
  const pageSections = getPageSections(content, pageId);
  const requiredSections = getRequiredSectionTypes(structure, pageId);
  const pageSectionTypes = pageSections.map(s => s.sectionType);

  return requiredSections.filter(s => !pageSectionTypes.includes(s));
}
