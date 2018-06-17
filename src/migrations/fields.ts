import logger from '../logger';

export function removeFields(content, structure) {
  const metaFieldsToRemove = getFieldsToRemove(content.meta, structure.meta.fields);

  if (metaFieldsToRemove.length) {
    metaFieldsToRemove.forEach(field => delete content.meta[field]);

    logger(
      'Will remove field(s) %=f% from meta content',
      { f: { str: metaFieldsToRemove.join(', '), lvl: 3 }}
    );
  }
}

function getFieldsToRemove(obj, allowedFields) {
  return Object.keys(obj).filter(field => allowedFields.indexOf(field) === -1);
}
