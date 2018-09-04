import * as pages from './migrations/pages';

export default class Content {
  constructor(content, structure) {
    content.global = content.global || {};
    content.pages = content.pages || {};
    content.sections = content.sections || {};

    this.content = content;
    this.structure = structure;
  }

  getContent() {
    return this.content;
  }

  migratePages() {
    const protectedPageTypes = pages.getProtectedPageTypes(this.structure.pages);
    const newPages = protectedPageTypes.map(type => pages.createPage(type));
    this.content.pages = newPages.reduce((acc, page) => {
      acc[page._id] = page;
      return acc;
    }, this.content.pages);
    
    return this;
  }
}
