import * as c from './constants';
import * as pages from './migrations/pages';
import * as sections from './migrations/sections';

export default class Content {
  constructor(content, structure) {
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
    // add pages to initial content
    const protectedPageTypes = pages.getProtectedPageTypes(this.structure.pages);
    const newPages = protectedPageTypes.map(type => pages.createPage(type));

    const minPages = this.structure.global.minItems;
    while (newPages.length < minPages) {
      newPages.push(pages.createPage());
    }

    this.content.global._items = newPages.map(page => page._id);

    this.content.pages = newPages.reduce((acc, page) => {
      acc[page._id] = page;
      return acc;
    }, this.content.pages);

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
}
