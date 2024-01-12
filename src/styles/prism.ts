import font from '@/styles/font';

const theme = {
  base: '#5271b1', // mix gray[500] & blue[500]
  primary: '#277fb5', // cyan[500]
  secondary: '#9b47b2', // purple[500]
  tertiary: '#7567a1', // mix gray[500] & violet[500]
  quaternary: '#7f58be', // violet[500]
  quinary: '#a2abb7', // gray[400]
  unset: '#5271b1', // base
  boldWeight: 600,
};

const prism: { [key: string]: React.CSSProperties } = {
  'code[class*="language-"]': {
    color: theme.base,
    fontFamily: font.code.style.fontFamily,
    fontSize: `${13 / 16}rem`,
    hyphens: 'none',
    lineHeight: 1.5,
    tabSize: 2,
    overflowWrap: 'break-word',
    textAlign: 'left',
    wordSpacing: 'normal',
    wordWrap: 'normal',
  },

  atrule: { color: theme.unset },
  'attr-name': { color: theme.secondary },
  'attr-value': { color: theme.tertiary },
  boolean: { color: theme.tertiary },
  builtin: { color: theme.quaternary },
  char: { color: theme.tertiary },
  'class-name': { color: theme.primary },
  comment: { color: theme.quinary },
  constant: { color: theme.secondary },
  deleted: { color: theme.unset },
  function: { color: theme.primary },
  important: {
    color: theme.unset,
    fontWeight: theme.boldWeight,
  },
  inserted: { color: theme.unset },
  keyword: { color: theme.quaternary },
  'maybe-class-name': { color: theme.primary },
  number: { color: theme.tertiary },
  operator: { color: theme.quinary },
  property: { color: theme.secondary },
  punctuation: { color: theme.quinary },
  regex: { color: theme.unset },
  selector: { color: theme.primary },
  string: { color: theme.tertiary },
  symbol: { color: theme.quinary },
  tag: { color: theme.primary },
  'template-string': { color: theme.tertiary },
  url: { color: theme.tertiary },
  variable: { color: theme.secondary },

  bold: { fontWeight: theme.boldWeight },
  italic: { fontStyle: 'italic' },
};
export default prism;
