import _cloneDeep from 'lodash.clonedeep';
import * as c from './constants';
import * as pages from './migrations/pages';
import * as sections from './migrations/sections';

export default class Content {
  constructor(_content, _structure) {
    const content = _cloneDeep(_content);
    const structure = _cloneDeep(_structure);

    content.global = content.global || {};
    content.pages = content.pages || {};
    content.sections = content.sections || {};

    this.content = content;
    // TODO: validate structure (add default values for e.g. minItems = 0; maxItems = 99;)
    this.structure = structure;
  }

  getContent() {
    return this.content;
  }

  _addPages(newPages) {
    this.content.global._items = this.content.global._items.concat(newPages.map(page => page._id));

    this.content.pages = newPages.reduce((acc, page) => {
      acc[page._id] = page;
      return acc;
    }, this.content.pages);
  }

  _addSections(newSections, page) {
    newSections.forEach(section => {
      page._items.push(section._id);

      this.content.sections = newSections.reduce((acc, section) => {
        acc[section._id] = section;
        return acc;
      }, this.content.sections);
    });
  }

  _removePages(pageIdsToRemove) {
    pageIdsToRemove.forEach(id => {
      const existingPageIds = this.content.global._items;
      const pageIndex = existingPageIds.findIndex(pageId => pageId === id);
      existingPageIds.splice(pageIndex, 1);

      delete this.content.pages[id];
    });
  }

  _removeSections(sectionIdsToRemove) {
    sectionIdsToRemove.forEach(id => {
      const pages = Object.values(this.content.pages);
      pages.forEach(page => {
        page._items = page._items.filter(sectionId => sectionId === id)
      });

      delete this.content.sections[id];
    });
  }

  migratePages() {
    this.content.global._items = this.content.global._items || [];

    const invalidPageIds = pages.getInvalidPageIds(this.structure.pages, this.content.pages);
    this._removePages(invalidPageIds);

    const requiredPages = pages.getRequiredPages(this.structure, this.content.pages);
    this._addPages(requiredPages);

    const pagesOverMaximum = pages.getPagesOverMaximum(this.structure, this.content.pages);
    this._removePages(pagesOverMaximum);

    return this;
  }

  migrateSections() {
    const invalidSectionIds = sections.getInvalidSectionIds(this.structure, this.content);
    this._removeSections(invalidSectionIds);

    Object.values(this.content.pages).forEach(page => {
      const requiredSections = sections.getRequiredSectionsForPage(this.structure.pages, page);
      this._addSections(requiredSections, page);

      const sectionsOverMaximum = sections.getSectionsOverMaximum(this.structure.pages, page);
      this._removeSections(sectionsOverMaximum);
    });

    return this;
  }

  migrateFields() {
    const validFields = Object.keys(this.structure.fields);
    const validGlobalFields = validFields.filter(field => this.structure.global.fields.includes(field));

    const invalidGlobalFields = Object.keys(this.content.global).filter(prop => {
      return !(prop.substring(0, 1) === '_' || validGlobalFields.includes(prop));
    });

    invalidGlobalFields.forEach(field => delete this.content.global[field]);

    const missingGlobalFields = validGlobalFields
      .filter(field => !this.content.global.hasOwnProperty(field));

    missingGlobalFields.forEach(field => this.content.global[field] = '');

    Object.entries(this.content.pages).forEach(([id, page]) => {
      const fieldNames = this.structure.pages[page._type].fields;
      fieldNames.forEach(fieldName => page[fieldName] = '');
    });

    Object.entries(this.content.sections).forEach(([id, section]) => {
      const fieldNames = this.structure.sections[section._type].fields;
      // TODO: recursive function for field lists
      fieldNames.forEach(fieldName => section[fieldName] = '');
    });

    return this;
  }
}
