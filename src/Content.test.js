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
    });
  });
});
