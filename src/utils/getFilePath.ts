// import process from 'process';
export const getFilePath = (path: string) => {
  if (!path) {
    return path;
  }
  if (path?.startsWith("http")) {
    return path;
  }
  return FILE_BASE_URL + path;
};
