/**
 * Created by moriyasei on 2016/09/15.
 */

import { createStore, applyMiddleware } from 'redux';
import createLogger from 'redux-logger';
import promise from 'redux-promise';

import Entries, * as fromEntries from './reducers/Entries';

export const getEntriesById = fromEntries.getEntriesById;
export const getEntryIds = fromEntries.getEntryIds;
export const getCurrentEntry = (state) => {
  const currentId = fromEntries.getCurrentEntryId(state);
  return getEntriesById(state,currentId);
};

const configuredStore = () => {
  const middlewares = [promise];
  if (process.env.NODE_ENV !== 'production') {
    middlewares.push(createLogger());
  }
  return createStore(
    Entries,
    applyMiddleware(...middlewares)
  );
};

export default configuredStore;

