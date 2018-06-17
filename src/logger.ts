import chalk from 'chalk';

const levelColors = {
  0: 'white',
  1: 'green',
  2: 'yellow',
  3: 'redBright',
  4: 'magentaBright',
};

export default function logger(
  item : string,
  prefix : string = '',
  interpolations? : { [key : string]: { str : string | number, lvl: number }},
) {
  let newLog = item;

  if (interpolations) {
    Object.entries(interpolations).forEach(([key, int]) => {
      const color = levelColors[int.lvl];
      const lookup = `%=${key}%`;
      const replacement = chalk.bold[color](int.str);

      newLog = newLog.replace(lookup, replacement);
    });
  }
  console.log(prefix + newLog);
}
