import _cloneDeep from 'lodash.clonedeep';
import * as c from './constants';
import * as pages from './migrations/pages';
import * as sections from './migrations/sections';

export default class Content {
  constructor(content, structure) {
    this.content = {
      global: {},
      pages: {},
      sections: {},
      ..._cloneDeep(content),
    };
    // TODO: validate structure (add default values for e.g. minItems = 0; maxItems = 99;)
    this.structure = _cloneDeep(structure);
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

  _addMissingFields(validFields, itemStructure, itemContent) {
    const itemFields = Object.keys(itemContent)
      .filter(prop => !prop.startsWith('_'));

    const validItemFields = validFields.filter(field => itemStructure.fields.includes(field));
    const missingItemFields = validItemFields.filter(field => !itemFields.includes(field));

    itemFields.forEach(fieldName => {
      if (this.structure.fields[fieldName].type === 'list') {
        itemContent[fieldName].forEach(listContent => {
          this._addMissingFields(validFields, this.structure.fields[fieldName], listContent);
        });
      }
    });

    missingItemFields.forEach(field => itemContent[field] = '');
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

  _removeInvalidFields(validFields, itemStructure, itemContent) {
    const itemFields = Object.keys(itemContent)
      .filter(prop => !prop.startsWith('_'));

    itemFields.forEach(fieldName => {
      const validItemFields = validFields.filter(field => itemStructure.fields.includes(field));

      if (validItemFields.includes(fieldName)) {
        if (this.structure.fields[fieldName].type === 'list') {
          itemContent[fieldName].forEach(listContent => {
            this._removeInvalidFields(validFields, this.structure.fields[fieldName], listContent);
          });
        }
      } else {
        delete itemContent[fieldName];
      }
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

    this._removeInvalidFields(validFields, this.structure.global, this.content.global);
    this._addMissingFields(validFields, this.structure.global, this.content.global);

    Object.values(this.content.pages).forEach(page => {
      const pageStructure = this.structure.pages[page._type];
      const pageContent = this.content.pages[page._id];
      this._removeInvalidFields(validFields, pageStructure, pageContent);
      this._addMissingFields(validFields, pageStructure, pageContent);
    });

    Object.values(this.content.sections).forEach(section => {
      const sectionStructure = this.structure.sections[section._type];
      const sectionContent = this.content.sections[section._id];
      this._removeInvalidFields(validFields, sectionStructure, sectionContent);
      this._addMissingFields(validFields, sectionStructure, sectionContent);
    });

    return this;
  }
}
