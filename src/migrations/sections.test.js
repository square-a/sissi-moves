import _testStructure from '../_testData/structure';
import * as migrations from './sections';

describe('migrations/sections', () => {
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
});
