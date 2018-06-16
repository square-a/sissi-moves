import logger from '../logger';

export function removePages(content, maxPages) {
  if (content.pages.length > maxPages) {
    const pagesToRemove : string[] = [];
    while(content.pages.length > maxPages) {
      const removedPage : string = content.pages.pop().id;
      pagesToRemove.push(removedPage);
    }
    logger(
      `Pages %=p% will be removed`,
      { p: { str: pagesToRemove.join(', '), level: 2 }}
    );
  }
}
