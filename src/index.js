import hashStructure from './hashStructure';
import migrate from './migrate';

module.exports = async function run(args, flags) {
  switch(args[0]) {
    case 'hash':
      hashStructure(flags);
      return;

    default:
      migrate(flags);
      return;
  }
}
