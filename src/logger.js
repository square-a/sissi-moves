import chalk from 'chalk';

const levelColors = {
  0: 'white',
  1: 'green',
  2: 'yellow',
  3: 'redBright',
  4: 'magentaBright',
};

let instance;

export default class Logger {
  constructor() {
    if (!instance) {
      this.list = [];
      instance = this;
    }

    return instance;
  }

  add(options) {
    this.list.push(this.getString(options));
  }

  log(options) {
    const logString = this.getString(options);
    console.log(logString);
  }

  logList() {
    while (this.list.length) {
      console.log(this.list.shift());
    }
  }

  getListLength() {
    return this.list.length;
  }

  getString(options) {
    const { item, prefix = '', interpolations } = options;
    let newLog = item;

    if (interpolations) {
      Object.entries(interpolations).forEach(([key, int]) => {
        const color = levelColors[int.lvl];
        const lookup = `%=${key}%`;
        const replacement = chalk.bold[color](int.str);

        newLog = newLog.replace(lookup, replacement);
      });
    }

    return prefix + newLog;
  }
}
