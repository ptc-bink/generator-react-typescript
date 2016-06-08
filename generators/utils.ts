import * as chalk from 'chalk';

export function accentOn(...text: string[]) {
    return chalk.green(...text);
}