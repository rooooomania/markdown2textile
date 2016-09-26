// for 'this' problem, see "https://github.com/reactjs/redux/issues/1465"

import Constants from '../constants';

const addEntry = ({id, entry}) => ({
  type: Constants.ADD_ENTRY,
  id,
  entry,
});

const editEntry = ({id, entry}) => ({
  type: Constants.EDIT_ENTRY,
  id,
  entry
});

const deleteEntry = (id) => ({
  type: Constants.DELETE_ENTRY,
  id,
});

const clearCurrentEntry = () => ({
  type: Constants.CLEAR_CURRENT_ENTRY,
});

const setCurrentEntry = (id) => ({
  type: Constants.SET_CURRENT_ENTRY,
  id
});

const Actions = {
  addEntry,
  editEntry,
  deleteEntry,
  clearCurrentEntry,
  setCurrentEntry,
};

export default Actions;