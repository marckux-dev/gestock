
export const normalizeString = (str: string): string => {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

const compareNormalized = (a: string, b: string): number => (
    normalizeString(a) > normalizeString(b) ?  1
  : normalizeString(a) < normalizeString(b) ? -1
  : 0
);

export const sortNormalized = (items: string[]) => (
  [...items].sort(compareNormalized)
);
