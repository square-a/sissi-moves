import chalk from 'chalk';

interface interpolationOpts {
  [key : string]: { str : string | number, lvl: number }
}

const levelColors = {
  0: 'white',
  1: 'green',
  2: 'yellow',
  3: 'redBright',
  4: 'magentaBright',
};

let instance;

export default class Logger {
  private list : string[] = [];

  constructor() {
    if (!instance) {
      instance = this;
    }

    return instance;
  }

  add(options : { item: string, prefix? : string, interpolations? : interpolationOpts }) {
    this.list.push(this.getString(options));
  }

  log(options : { item: string, prefix? : string, interpolations? : interpolationOpts }) {
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

  private getString(options : { item: string, prefix? : string, interpolations? : interpolationOpts }) {
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
