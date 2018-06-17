import _cloneDeep = require('lodash.clonedeep');
import _get = require('lodash.get');

import * as c from '../constants';
import logger from '../logger';
import { getContentId } from '../utils';

export function addSections(content, minSections, structure) {
  content.pages.forEach(page => {
    page.sections = page.sections || [];
    if (page.sections.length < minSections) {
      let sectionsToAdd = 0;
      let hasMissingSections;

      while(page.sections.length < minSections || hasMissingSections) {
        hasMissingSections = false;
        const missingSectionTypes = getMissingSectionTypes(content, page.id, structure);
        const sectionType = missingSectionTypes.pop() || c.STANDARD_PAGE_TYPE;

        if (missingSectionTypes.length) {
          hasMissingSections = true;
        }

        const newPage = {
          id: getContentId(),
          type: sectionType,
        };

        const { fields } = structure.pages[newPage.type];
        fields.forEach(field => newPage[field] = '');

        page.sections.push(newPage);
        sectionsToAdd += 1;
      }

      logger(
        `%=s% new section(s) will be added to page %=p%`,
        { s: { str: sectionsToAdd.toString(), lvl: 1 }, p: { str: page.id, lvl: 2 }}
      );
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
          logger(
            `Page %=p% has too many required sections. Can\'t remove them automatically. %=c%`,
            { p: { str: page.id, lvl: 3 }, c: { str: c.CHECK_MANUALLY, lvl: 3 }}
          );
          return;
        }
      }

      const sections = sectionsToRemove.join(', ');
      logger(
        `Section(s) %=s% will be removed from page %=p%`,
        { s: { str: sections, lvl: 3 }, p: { str: page.id, lvl: 2 }}
      );
    }
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
