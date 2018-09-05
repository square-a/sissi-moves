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

  migratePages() {
    const newPages = [];
    const existingPagesArray = Object.entries(this.content.pages);
    const protectedPageTypes = pages.getProtectedPageTypes(this.structure.pages);
    const minPages = this.structure.global.minItems;
    const maxPages = this.structure.global.maxItems;
    const validPageTypes = Object.keys(this.structure.pages);

    // filter out pages with invalid types
    const validExistingPages = existingPagesArray.filter(([id, page]) => {
      return !!validPageTypes.find(type => type === page._type);
    });

    this.content.global._items = validExistingPages.map(([id, page]) => id) || [];
    this.content.pages = validExistingPages.reduce((acc, [id, page]) => {
      acc[id] = page;
      return acc;
    }, {});

    // create protected pages
    protectedPageTypes.forEach(type => {
      const hasType = !!validExistingPages.find(([id, page]) => type === page._type);
      if (!hasType) {
        newPages.push(pages.createPage(type));
      }
    });

    // create minimum amount of pages
    while (validExistingPages.length + newPages.length < minPages) {
      newPages.push(pages.createPage());
    }

    // add created pages to content
    this.content.global._items = this.content.global._items.concat(newPages.map(page => page._id));

    this.content.pages = newPages.reduce((acc, page) => {
      acc[page._id] = page;
      return acc;
    }, this.content.pages);

    // remove unprotected pages over maximum amount
    const pagesToRemove = [];
    const existingPages = Object.entries(this.content.pages);
    while (existingPages.length > maxPages) {
      let candidate = existingPages.pop();
      while (candidate && protectedPageTypes.includes(candidate[1]._type)) {
        candidate = existingPages.pop();
      }
      if (candidate) {
        pagesToRemove.push(candidate);
      }
    }

    pagesToRemove.forEach(([id, page]) => {
      const pageIndex = this.content.global._items.findIndex(pageId => pageId === id);
      this.content.global._items.splice(pageIndex, 1);

      delete this.content.pages[id];
    });

    return this;
  }

  migrateSections() {
    // add sections to initial content
    const newSections = [];

    Object.entries(this.content.pages).forEach(([id, page]) => {
      const pageStructure = this.structure.pages[page._type];
      const allowedSectionTypes = pageStructure.allowedItems || [c.TYPE_STANDARD];
      const minSections = pageStructure.minItems || 0;
      page._items = [];

      while(page._items.length < minSections) {
        const newSection = sections.createSection(allowedSectionTypes[0]);
        newSections.push(newSection);
        page._items.push(newSection._id);
      }
    });

    this.content.sections = newSections.reduce((acc, section) => {
      acc[section._id] = section;
      return acc;
    }, this.content.sections);

    return this;
  }

  migrateFields() {
    // add fields to initial content
    this.structure.global.fields.forEach(fieldName => this.content.global[fieldName] = '');

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
