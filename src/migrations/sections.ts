import logger from '../logger';

export function removePageSections(content, maxSections) {
  content.pages.forEach(page => {
    if (page.sections.length > maxSections) {
      const sectionsToRemove : string[] = [];
      while(page.sections.length > maxSections) {
        const removedSection = page.sections.pop();
        sectionsToRemove.push(removedSection);
      }
      const sections = sectionsToRemove.join(', ');
      logger(
        `Sections %=s% will be removed from page %=p%`,
        { s: { str: sections, level: 2 }, p: { str: page.id, level: 1 }}
      );
    }
  });
}
