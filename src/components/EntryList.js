import React, { Component } from 'react';
import { Paper } from 'material-ui';
import { FlatButton } from 'material-ui';

const EntryList = ({
  entries,
  handleClick,
  deleteEntry
}) => {
  return (
    <Paper>
      <ul>
        {entries.map(e =>
          <li
            id={e.id}
            key={e.id}
          >
            <span onClick={handleClick(e.id)}>{e.entry.split("\n")[0]}</span>
            <FlatButton
              label='delete'
              onClick={ el => {
                deleteEntry(e.id);
                const newStorage = entries.filter(elm => elm.id !== e.id);
                window.localStorage.setItem('entries', JSON.stringify(newStorage));
              }}
            />
          </li>
        )}
      </ul>
    </Paper>
  )
};

export default EntryList;

