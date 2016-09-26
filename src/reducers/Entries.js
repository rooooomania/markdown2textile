/**
 * Created by moriyasei on 2016/09/14.
 */

import expect from 'expect';
import { combineReducers } from 'redux';
import Constants from '../constants';

const initialState = {
  entriesById: {},
  entryIds: [],
  currentEntryId: '',
};

const entriesById = (state = initialState.entriesById, action) => {
  switch (action.type) {
    case Constants.ADD_ENTRY:
    case Constants.EDIT_ENTRY:
      const newAction = Object.assign(
        {},
        action
      );

      delete newAction.type;
      return {
        ...state,
        [action.id]: newAction,
      };
    case Constants.DELETE_ENTRY:
      const newState = Object.assign(
        {},
        state
      );
      delete newState[action.id];
      return newState;

    default:
      return state;
  }
};

const entryIds = (state = initialState.entryIds, action) => {
  switch (action.type) {
    case Constants.ADD_ENTRY:
      return [
        ...state,
        action.id,
      ];
    case Constants.EDIT_ENTRY:
      return state;
    case Constants.DELETE_ENTRY:
      return state.filter(id => id !== action.id);

    default:
      return state;
  }
};

const currentEntryId = (state = initialState.currentEntryId, action) => {
  switch (action.type) {
    case Constants.SET_CURRENT_ENTRY:
      return action.id;
    case Constants.CLEAR_CURRENT_ENTRY:
      return initialState.currentEntryId;
    default:
      return state;
  }
};


const Entries = combineReducers({
  entriesById,
  entryIds,
  currentEntryId
});

/*
 * APIs
 */

export const getEntriesById = (parentState, id) =>
  parentState.entriesById[id];
export const getEntryIds = (parentState) => parentState.entryIds;
export const getCurrentEntryId = (parentState) => parentState.currentEntryId;

export default Entries;

/*
 * test code
 */
const testAddEntry = () => {
  const actionMock = {
    type: 'ADD_ENTRY',
    id: 'mockId',
    entry: `## これはMarkdownです。`
  }
  const beforeState = {};
  const afterState = {
    'mockId': {
      id: 'mockId',
      entry: '## これはMarkdownです。',
    },
  }

  expect(entriesById({}, actionMock)).toEqual(afterState);

};
// testAddEntry();
// console.log('test passed.');


