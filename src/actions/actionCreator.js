export const addEntry = (id, entry) => ({
  type: 'ADD_ENTRY',
  id,
  entry,
});

export const editEntry = (id, entry) => ({
  type: 'EDIT_ENTRY',
  id,
  entry
});

export const clearCurrentEntry = () => ({
  type: 'CLEAR_CURRENT_ENTRY',
});

