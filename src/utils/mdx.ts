import fs from 'fs';
import readline from 'readline';

import { Heading } from '@/types/mdx';

export const getHeadings = (path: string): Promise<Heading[]> => {
  const headings: Heading[] = [];

  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: fs.createReadStream(path),
      output: process.stdout,
      terminal: false,
    });

    let currtH2 = -1;
    let currtH3 = -1;

    rl.on('line', (line) => {
      if (!/^#{2,}/.test(line)) return;

      const tokens = line.match(/(^#{2,}) (.+)/);
      if (!tokens) return;

      const hash = tokens[1].length;
      const text = tokens[2];

      const h = { text, subHeadings: [] };

      if (hash == 2) {
        currtH2++;
        currtH3 = -1;
        headings.push(h);
      } else {
        if (hash === 3) {
          currtH3++;
          headings[currtH2].subHeadings.push(h);
        } else {
          headings[currtH2].subHeadings[currtH3].subHeadings.push(h);
        }
      }
    })
      .on('close', () => resolve(headings))
      .on('error', reject);
  });
};
