export const paginate = (array: any[], page: number, pagesize: number) => {
  const arr = array.slice((page - 1) * pagesize, page * pagesize);
  return arr;
}
