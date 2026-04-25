export const parseCurrency = (text: string): number =>
  parseFloat(text.replace('$', ''));
