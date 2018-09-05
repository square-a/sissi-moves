import _cloneDeep from 'lodash.clonedeep';

import _testStructure from '../_testData/structure';
import _testContent from '../_testData/content';
import * as migrations from './pages';

describe('migrations/pages', () => {
  let testContent, testStructure;

  beforeEach(() => {
    testStructure = _cloneDeep(_testStructure);
    testContent = _cloneDeep(_testContent);
  });

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

  describe('getInvalidPageIds', () => {
    it('should return an array of pages with invalid page types', () => {
      const result = migrations.getInvalidPageIds({ standard: {}, newPage: {} }, testContent.pages);

      expect(result).toEqual(['def345']);
    });

    it('should return an empty array if all existing pages have valid types', () => {
      const result = migrations.getInvalidPageIds(testStructure.pages, testContent.pages);

      expect(result).toEqual([]);
    });
  });

  describe('getProtectedPageTypes', () => {
    it('should return an array with protected page types', () => {
      const result = migrations.getProtectedPageTypes(_testStructure.pages);

      expect(result).toEqual(['gallery']);
    });
  });
});
