import * as c from '../constants';
import logger from '../logger';

export function removeMetaFields(content, structure) {
  const fieldsToRemove = getFieldsToRemove(content.meta, structure.meta.fields);

  if (fieldsToRemove.length) {
    fieldsToRemove.forEach(field => delete content.meta[field]);

    logger(
      'Field(s) %=f% from meta content',
      c.LIST_ITEM,
      { f: { str: fieldsToRemove.join(', '), lvl: 3 }}
    );
  }
}

export function removePageFields(content, structure) {
  content.pages.forEach(page => {
    const pageFields = structure.pages[page.pageType].fields;
    const allowedFields = c.ALLOWED_FIELDS.concat(pageFields);
    const fieldsToRemove = getFieldsToRemove(page, allowedFields);

    if (fieldsToRemove.length) {
      fieldsToRemove.forEach(field => delete page[field]);

      logger(
        'Field(s) %=f% from page %=p%',
        c.LIST_ITEM,
        { f: { str: fieldsToRemove.join(', '), lvl: 3 }, p: { str: page.id, lvl: 2 }}
      );
    }
  });
}

function getFieldsToRemove(obj, allowedFields) {
  return Object.keys(obj).filter(field => allowedFields.indexOf(field) === -1);
}
