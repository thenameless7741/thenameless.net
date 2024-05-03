export const evalFns: { [name: string]: (assistant: string) => boolean } = {
  '01-counting-to-three': (assistant) => {
    return /^(?=.*1)(?=.*2)(?=.*3)/.test(assistant);
  },
  '01-system-prompt': (assistant) => {
    return /soo|giggles/i.test(assistant);
  },
};
