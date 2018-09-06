import Content from './Content';
import _testContent from './_testData/content';
import _testStructure from './_testData/structure';

describe('Content', () => {
  let testContent;

  describe('_addPages', () => {
    beforeEach(() => {
      testContent = new Content({ global: { _items: [] }}, _testStructure);
    });

    it('should add the given pages to global', () => {
      testContent._addPages([{ _id: 'test1' }, { _id: 'test2' }]);
      const result = testContent.getContent();

      expect(result.global._items.length).toBe(2);
      expect(result.global._items).toContain('test1');
      expect(result.global._items).toContain('test2');
    });

    it('should add the given pages to pages', () => {
      testContent._addPages([{ _id: 'test1' }, { _id: 'test2' }]);
      const result = testContent.getContent();

      expect(result.pages.test1).not.toBeUndefined();
      expect(result.pages.test2).not.toBeUndefined();
    });
  });

  describe('_addSections', () => {
    beforeEach(() => {
      const pagesContent = {
        test1: {
          _id: 'test1',
          _items: [],
          _type: 'gallery',
        },
        test2: {
          _id: 'test2',
          _items: [],
          _type: 'standard',
        },
      };
      testContent = new Content({ pages: pagesContent }, _testStructure);
    });

    it('should add the given sections to the given page', () => {
      testContent._addSections([{ _id: 'test1' }, { _id: 'test2' }], testContent.content.pages.test2);
      const result = testContent.getContent();

      expect(result.pages.test2._items.length).toBe(2);
      expect(result.pages.test2._items).toContain('test1');
      expect(result.pages.test2._items).toContain('test2');
    });

    it('should add the given sections to sections', () => {
      testContent._addSections([{ _id: 'test1' }, { _id: 'test2' }], testContent.content.pages.test1);
      const result = testContent.getContent();

      expect(result.sections.test1).not.toBeUndefined();
      expect(result.sections.test2).not.toBeUndefined();
    });
  });

  describe('_removePages', () => {
    beforeEach(() => {
      testContent = new Content(_testContent, _testStructure);
    });

    it('should remove the pages with the given ids from global', () => {
      testContent._removePages(['abc123']);
      const result = testContent.getContent();

      expect(result.global._items).not.toContain('abc123');
    });

    it('should remove the pages with the given ids from pages', () => {
      testContent._removePages(['abc123']);
      const result = testContent.getContent();

      expect(result.pages.abc123).toBeUndefined();
    });
  });

  describe('initial content', () => {
    beforeEach(() => {
      testContent = new Content({}, _testStructure);
    });

    describe('migratePages', () => {
      it('should add all protected pages', () => {
        const { pages } = testContent.migratePages().getContent();
        const pagesArray = Object.values(pages);

        expect(pagesArray.find(p => p._type === 'gallery')).not.toBeUndefined();
      });

      it('should add the minimum amount of pages', () => {
        const { pages } = testContent.migratePages().getContent();

        expect(Object.keys(pages).length).toBe(2);
      });

      it('should add the new page ids to global', () => {
        const result = testContent.migratePages().getContent();

        expect(result.global._items.length).toBe(2);
      });
    });

    describe('migrateSections', () => {
      beforeEach(() => {
        testContent.content.pages = {
          test1: {
            _id: 'test1',
            _items: [],
            _type: 'gallery',
          },
          test2: {
            _id: 'test2',
            _items: [],
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

    describe('migrateFields', () => {
      it('should add fields to global', () => {
        const { global } = testContent.migrateFields().getContent();

        expect(global).toHaveProperty('title', '');
        expect(global).toHaveProperty('image', '');
      });

      it('should add fields to pages', () => {
        testContent.content.pages = {
          test1: {
            _id: 'test1',
            _items: [],
            _type: 'gallery',
          },
          test2: {
            _id: 'test2',
            _items: [],
            _type: 'standard',
          },
        };

        const { pages } = testContent.migrateFields().getContent();

        expect(pages.test1).toHaveProperty('title', '');
        expect(pages.test1).toHaveProperty('path', '');
        expect(pages.test2).toHaveProperty('title', '');
        expect(pages.test2).toHaveProperty('path', '');
      });

      it('should add fields to sections', () => {
        testContent.content.sections = {
          testA: {
            _id: 'testA',
            _type: 'photo',
          },
          testB: {
            _id: 'testB',
            _type: 'standard',
          },
        };

        const { sections } = testContent.migrateFields().getContent();

        expect(sections.testA).toHaveProperty('image', '');
        expect(sections.testB).toHaveProperty('title', '');
        expect(sections.testB).toHaveProperty('image', '');
      });
    });
  });

  describe('existing content', () => {
    beforeEach(() => {
      testContent = new Content(_testContent, _testStructure);
    });

    describe('migratePages', () => {
      it('should filter out all pages with invalid page types', () => {
        testContent.structure.pages = {
          standard: {
            maxItems: 6,
            minItems: 1,
            fields: ['title', 'path'],
          },
          photo: {
            maxItems: 10,
            minItems: 4,
            fields: ['image', 'path'],
          },
        };

        const { global, pages } = testContent.migratePages().getContent();

        expect(global._items).not.toContain('def345');
        expect(pages.def345).toBeUndefined();
      });

      it('should not add pages if all required pages exist', () => {
        const { global, pages } = testContent.migratePages().getContent();

        expect(global._items.length).toBe(2);
        expect(Object.entries(pages).length).toBe(2);
        expect(pages).toHaveProperty('abc123');
        expect(pages).toHaveProperty('def345');
      });

      it('should remove pages over the maximum', () => {
        testContent.structure.global.maxItems = 1;

        const { global, pages } = testContent.migratePages().getContent();

        expect(global._items.length).toBe(1);
        expect(Object.entries(pages).length).toBe(1);
      });

      it('should not remove pages below the maximum', () => {
        const { global, pages } = testContent.migratePages().getContent();

        expect(global._items.length).toBe(2);
        expect(Object.entries(pages).length).toBe(2);
      });

      it('should never remove protected pages', () => {
        testContent.structure.global.maxItems = 1;

        const { global, pages } = testContent.migratePages().getContent();

        expect(global._items.length).toBe(1);
        expect(global._items).toContain('def345');
        expect(Object.entries(pages).length).toBe(1);
        expect(Object.entries(pages)[0][0]).toBe('def345');
      });
    });

    describe('migrateSections', () => {
      beforeEach(() => {
        testContent = new Content(_testContent, _testStructure);
      });

      it('should filter out all sections with invalid section types', () => {
        testContent.structure.sections = {
          standard: {
            fields: ['title', 'path'],
          },
          newSectionType: {
            fields: ['image', 'path'],
          },
        };

        const { pages, sections } = testContent.migrateSections().getContent();
        const pagesArray = Object.values(pages);

        expect(pagesArray.find(page => page._items.includes('123abc'))).toBeUndefined();
        expect(sections['123abc']).toBeUndefined();
      });

      it('should remove sections exceeding the maximum amount for each page', () => {
        testContent.structure.pages.standard.maxItems = 0;
        testContent.structure.pages.standard.minItems = 0;
        testContent.structure.pages.standard.allowedItems = ['standard', 'photo'];

        const { sections } = testContent.migrateSections().getContent();

        expect(sections['123abc']).toBeUndefined();
        expect(sections['345def']).toBeUndefined();
      });
    });
  });
});
