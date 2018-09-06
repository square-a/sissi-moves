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

  describe('createSection', () => {
    it('should return a section with the desired type', () => {
      const result = migrations.createSection('photo');

      expect(result).toHaveProperty('_id');
      expect(result).toHaveProperty('_type', 'photo');
    });

    it('should return a section with the standard type if no type is specified', () => {
      const result = migrations.createSection();

      expect(result).toHaveProperty('_id');
      expect(result).toHaveProperty('_type', 'standard');
    });
  });

  describe('getInvalidSectionIds', () => {
    it('should return an array of sections with invalid section types', () => {
      const result = migrations.getInvalidSectionIds({ standard: {}, newSection: {} }, testContent.sections);

      expect(result).toEqual(['123abc']);
    });

    it('should return an empty array if all existing sections have valid types', () => {
      const result = migrations.getInvalidSectionIds(testStructure.sections, testContent.sections);

      expect(result).toEqual([]);
    });
  });
});
