import Content from './Content';
import _testContent from './_testData/content';
import _testStructure from './_testData/structure';

describe('Content', () => {
  let testContent;

  describe('initialContent', () => {
    beforeEach(() => {
      testContent = new Content({}, _testStructure);
    });

    describe('migratePages', () => {
      it('should add all protected pages', () => {
        const { pages } = testContent.migratePages().getContent();
        const pagesArray = Object.values(pages);

        expect(pagesArray.find(p => p._type === 'gallery')).not.toBeUndefined();
      });

      it('should add pages until the minimum is reached', () => {
        const { pages } = testContent.migratePages().getContent();

        expect(Object.keys(pages).length).toBe(2);
      });

      it('should add the page ids to global', () => {
        const result = testContent.migratePages().getContent();

        expect(result.global._items.length).toBe(2);
      });
    });

    describe('migrateSections', () => {
      beforeEach(() => {
        testContent.content.pages = {
          test1: {
            _id: 'ababab',
            _type: 'gallery',
          },
          test2: {
            _id: 'cdcdcd',
            _type: 'standard',
          },
        };
      });

      it('should add the minimum sections to each page', () => {
        const result = testContent.migrateSections().getContent();

        expect(result.pages.test1).toHaveProperty('_items');
        expect(result.pages.test1._items.length).toBe(4);
      });

      it('should use the first of the allowed section types', () => {
        const { sections } = testContent.migrateSections().getContent();
        const sectionsArray = Object.values(sections);

        expect(sectionsArray.filter(s => s._type === 'photo').length).toBe(4);
        expect(sectionsArray.filter(s => s._type === 'standard').length).toBe(1);
      });

      it('should add the new sections to content.sections', () => {
        const { sections } = testContent.migrateSections().getContent();
        const sectionsArray = Object.values(sections);

        expect(sectionsArray.find(s => s._type === 'photo')).not.toBeUndefined();
      });

      it('should not add sections if minItems is 0 or not defined', () => {
        testContent.structure.pages = {
          standard: {
            maxItems: 6,
            minItems: 0,
            fields: ['title', 'path'],
          },
          gallery: {
            maxItems: 10,
            fields: ['title', 'path'],
            isProtected: true,
          },
        };

        const { pages, sections } = testContent.migrateSections().getContent();

        expect(pages.test1._items.length).toBe(0);
        expect(pages.test2._items.length).toBe(0);
        expect(Object.keys(sections).length).toBe(0);
      });
    });
  });
});
