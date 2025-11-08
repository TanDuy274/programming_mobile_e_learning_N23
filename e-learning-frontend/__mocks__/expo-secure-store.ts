const mockStorage: { [key: string]: string } = {};

export const setItemAsync = jest.fn((key: string, value: string) => {
  mockStorage[key] = value;
  return Promise.resolve();
});

export const getItemAsync = jest.fn((key: string) => {
  return Promise.resolve(mockStorage[key] || null);
});

export const deleteItemAsync = jest.fn((key: string) => {
  delete mockStorage[key];
  return Promise.resolve();
});

export default {
  setItemAsync,
  getItemAsync,
  deleteItemAsync,
};
