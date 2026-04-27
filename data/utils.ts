export const parseCurrency = (text: string): number => {
  const match = text.match(/\$(\d+\.\d{2})/);
  if (!match) throw new Error(`Could not parse currency from: "${text}"`);
  return parseFloat(match[1]);
};

export type SortOption = 'az' | 'za' | 'lohi' | 'hilo';
