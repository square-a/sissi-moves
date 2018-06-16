import LogList from './logList';

const logList = new LogList();

export default function migrate(content, structure) {
  const {
    minPages,
    maxPages,
    minSectionsPerPage,
    maxSectionsPerPage,
  } = structure.settings;

  removePages(content, maxPages);
  removePageSections(content, maxSectionsPerPage);

  logList.log();
}

function removePages(content, maxPages) {
  if (content.pages.length > maxPages) {
    const pagesToRemove : string[] = [];
    while(content.pages.length > maxPages) {
      const removedPage : string = content.pages.pop().id;
      pagesToRemove.push(removedPage);
    }
    logList.add(
      `Pages %=p% will be removed`,
      { p: { str: pagesToRemove.join(', '), level: 2 }}
    );
  }
}

function removePageSections(content, maxSections) {
  content.pages.forEach(page => {
    if (page.sections.length > maxSections) {
      const sectionsToRemove : string[] = [];
      while(page.sections.length > maxSections) {
        const removedSection = page.sections.pop();
        sectionsToRemove.push(removedSection);
      }
      const sections = sectionsToRemove.join(', ');
      logList.add(
        `Sections %=s% will be removed from page %=p%`,
        { s: { str: sections, level: 2 }, p: { str: page.id, level: 1 }}
      );
    }
  });
}
