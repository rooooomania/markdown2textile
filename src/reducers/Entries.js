/**
 * Created by moriyasei on 2016/09/14.
 */

import expect from 'expect';
import { createStore, combineReducers } from 'redux';

const initialState = {
  entriesById: {},
  entryIds: [],
};

const entriesById = (state = initialState.entriesById, action) => {
  switch (action.type) {
    case 'ADD_ENTRY':
      const newAction = Object.assign(
        {},
        action
      );

      delete newAction.type;
      return {
        ...state,
        [action.id]: newAction,
      };

    default:
      return state;
  }
};

const entryIDs = (state = initialState.entryIds, action) => {
  switch (action.type) {
    case 'ADD_ENTRY':
      return [
        ...state,
        'testId',
      ];

    default:
      return state;
  }
};

export const entryReducer = combineReducers({
  entriesById,
  entryIDs
});

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


const store = createStore(entryReducer);
console.log(store.getState());
