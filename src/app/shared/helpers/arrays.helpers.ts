export const hasIntersection =
  <T>(arr_1: T[], arr_2: T[]): boolean =>
    arr_2.some(item => arr_1.includes(item));

export const pushIfNotIndluded = <T>(arr: T[], item: T): T[] =>
  arr.includes(item) ? [...arr] : [...arr, item];

export const removeItemFromArray = <T> (arr: T[], item: T): T[] =>
  arr.filter(i => i !== item);

