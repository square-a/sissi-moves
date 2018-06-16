import chalk from 'chalk';

const levelColors = {
  0: 'white',
  1: 'yellow',
  2: 'redBright',
  3: 'blue',
};

export default function logger(
  item : string,
  interpolations? : { [key : string]: { str : string, level: number }}
) {
  let newLog = item;

  if (interpolations) {
    Object.entries(interpolations).forEach(([key, int]) => {
      const color = levelColors[int.level];
      const lookup = `%=${key}%`;
      const replacement = chalk.bold[color](int.str);

      newLog = newLog.replace(lookup, replacement);
    });
  }
  console.log(`-- ${newLog}`);
}
