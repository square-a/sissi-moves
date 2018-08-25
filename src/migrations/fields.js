import * as c from '../constants';
import Logger from '../logger';
import { pluralize } from '../utils';

const logger = new Logger();

export function addMetaFields(content, structure) {
  const fieldsToAdd = getFieldsToAdd(content.meta, structure.meta.fields);

  if (fieldsToAdd.length) {
    fieldsToAdd.forEach(field => content.meta[field] = '');

    logger.add({
      item: `${pluralize('Field', fieldsToAdd)} %=f% to meta content`,
      prefix: c.LIST_ITEM,
      interpolations: { f: { str: fieldsToAdd.join(', '), lvl: 1 }}
    });
  }
}

export function addPageFields(content, structure) {
  content.pages.forEach(page => {
    const pageType = page.pageType || c.STANDARD_PAGE_TYPE;
    const pageFields = structure.pages[pageType].fields || [];
    const fieldsToAdd = getFieldsToAdd(page, pageFields);

    if (fieldsToAdd.length) {
      fieldsToAdd.forEach(field => page[field] = '');

      logger.add({
        item: `${pluralize('Field', fieldsToAdd)} %=f% to page %=p%`,
        prefix: c.LIST_ITEM,
        interpolations: { f: { str: fieldsToAdd.join(', '), lvl: 1 }, p: { str: page.id, lvl: 2 }}
      });
    }
  });
}

export function addSectionFields(content, structure) {
  Object.entries(content.sections).forEach(([id, section]) => {
    const sectionType = section.sectionType || c.STANDARD_SECTION_TYPE;
    const sectionFields = structure.sections[sectionType].fields || [];
    const fieldsToAdd = getFieldsToAdd(section, sectionFields);

    if (fieldsToAdd.length) {
      fieldsToAdd.forEach(field => section[field] = '');

      logger.add({
        item: `${pluralize('Field', fieldsToAdd)} %=f% to section %=s%`,
        prefix: c.LIST_ITEM,
        interpolations: { f: { str: fieldsToAdd.join(', '), lvl: 1 }, s: { str: id, lvl: 2 }}
      });
    }
  });
}

export function removeMetaFields(content, structure) {
  const fieldsToRemove = getFieldsToRemove(content.meta, structure.meta.fields);

  if (fieldsToRemove.length) {
    fieldsToRemove.forEach(field => delete content.meta[field]);

    logger.add({
      item: `${pluralize('Field', fieldsToRemove)} %=f% from meta content`,
      prefix: c.LIST_ITEM,
      interpolations: { f: { str: fieldsToRemove.join(', '), lvl: 3 }}
    });
  }
}

export function removePageFields(content, structure) {
  content.pages.forEach(page => {
    const pageType = page.pageType || c.STANDARD_PAGE_TYPE;
    const pageFields = structure.pages[pageType].fields;
    const allowedFields = c.ALLOWED_FIELDS.concat(pageFields);
    const fieldsToRemove = getFieldsToRemove(page, allowedFields);

    if (fieldsToRemove.length) {
      fieldsToRemove.forEach(field => delete page[field]);

      logger.add({
        item: `${pluralize('Field', fieldsToRemove)} %=f% from page %=p%`,
        prefix: c.LIST_ITEM,
        interpolations: { f: { str: fieldsToRemove.join(', '), lvl: 3 }, p: { str: page.id, lvl: 2 }}
      });
    }
  });
}

export function removeSectionFields(content, structure) {
  Object.entries(content.sections).forEach(([id, section]) => {
    const sectionType = section.sectionType || c.STANDARD_SECTION_TYPE;
    const sectionFields = structure.sections[sectionType].fields;
    const allowedFields = c.ALLOWED_FIELDS.concat(sectionFields);
    const fieldsToRemove = getFieldsToRemove(section, allowedFields);

    if (fieldsToRemove.length) {
      fieldsToRemove.forEach(field => delete section[field]);

      logger.add({
        item: `${pluralize('Field', fieldsToRemove)} %=f% from section %=s%`,
        prefix: c.LIST_ITEM,
        interpolations: { f: { str: fieldsToRemove.join(', '), lvl: 3 }, s: { str: id, lvl: 2 }}
      });
    }
  });
}

function getFieldsToAdd(obj, neededFields) {
  return neededFields.filter(field => !obj.hasOwnProperty(field));
}

function getFieldsToRemove(obj, allowedFields) {
  return Object.keys(obj).filter(field => allowedFields.indexOf(field) === -1);
}
