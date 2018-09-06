import _cloneDeep from 'lodash.clonedeep';

import _testContent from '../_testData/content';
import _testStructure from '../_testData/structure';
import * as migrations from './sections';

describe('migrations/sections', () => {
  let testContent, testStructure;

  beforeEach(() => {
    testContent = _cloneDeep(_testContent);
    testStructure = _cloneDeep(_testStructure);
  });

  describe('_createSection', () => {
    it('should return a section with the desired type', () => {
      const result = migrations._createSection('photo');

      expect(result).toHaveProperty('_id');
      expect(result).toHaveProperty('_type', 'photo');
    });

    it('should return a section with the standard type if no type is specified', () => {
      const result = migrations._createSection();

      expect(result).toHaveProperty('_id');
      expect(result).toHaveProperty('_type', 'standard');
    });
  });

  describe('getInvalidSectionIds', () => {
    it('should return an array of sections with invalid section types', () => {
      testStructure.sections = { standard: {}, newSection: {} };
      const result = migrations.getInvalidSectionIds(testStructure, testContent);

      expect(result).toEqual(['123abc', '567ghi']);
    });

    it('should include invalid section types for each page type', () => {
      const result = migrations.getInvalidSectionIds(testStructure, testContent);

      expect(result).toEqual(['123abc']);
    });

    it('should return an empty array if all existing sections have valid types', () => {
      testStructure.pages.standard = { allowedItems: ['standard', 'photo'] };

      const result = migrations.getInvalidSectionIds(testStructure, testContent);

      expect(result).toEqual([]);
    });
  });

  describe('getRequiredSectionsForPage', () => {
    it('should return an array with the minimum amount of sections for the given page', () => {
      testContent.pages = {
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

      const result = migrations.getRequiredSectionsForPage(testStructure.pages, testContent.pages.test1);

      expect(result.length).toBe(4);
    });
  });
});
