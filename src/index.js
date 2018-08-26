import hashStructure from './hashStructure';
import migrate from './migrate';

module.exports = async function run(args, flags) {
  const [ command ] = args;
  const {
    doSave = false,
  } = flags;

  switch(command) {
    case 'migrate':
      migrate();
      return;

    case 'hash':
      hashStructure(doSave);
      return;

    default:
      return;
  }
}
