import _testStructure from '../_testData/structure';
import * as migrations from './pages';

describe('migrations/pages', () => {
  describe('createPage', () => {
    it('should return a page with the desired type', () => {
      const result = migrations.createPage('gallery');

      expect(result).toHaveProperty('_id');
      expect(result).toHaveProperty('_type', 'gallery');
    });

    it('should return a page with the standard type if no type is specified', () => {
      const result = migrations.createPage();

      expect(result).toHaveProperty('_id');
      expect(result).toHaveProperty('_type', 'standard');
    });
  });
  
  describe('getProtectedPageTypes', () => {
    it('should return an array with protected page types', () => {
      const result = migrations.getProtectedPageTypes(_testStructure.pages);

      expect(result).toEqual(['gallery']);
    });
  });
});
