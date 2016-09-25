import React, {Component} from 'react';
import { connect } from 'react-redux';
import { Grid, Col, Row } from 'react-bootstrap';
import { Paper, Menu, MenuItem} from 'material-ui';
import { RaisedButton, FlatButton } from 'material-ui';
import TextField from 'material-ui/TextField';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import marked from 'marked';
import { markdown2Textile } from './utils/Converter';
import 'github-markdown-css';
import CardComponent from './components/CardComponent';
import { getEntryIds, getEntriesById, getCurrentEntry } from './configuredStore';
import { addEntry, editEntry, clearCurrentEntry } from './actions/actionCreator';

import uuid from 'node-uuid';

const v4 = uuid.v4;

import injectTapEventPlugin from 'react-tap-event-plugin';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

// TODO: リファクタリング

const mdStyle = {
  boxSizing: 'border-box',
  margin: '0 auto',
  padding: '5px',
};


const EntryList = ({
  entries,
  handleClick,
  dispatch
}) => {
  return (
  <Paper>
    <ul>
      {entries.map(e => <li
        id={e.id}
        key={e.id}
        >
        <span onClick={handleClick(e.id)}>{e.entry.split("\n")[0]}</span>
        <FlatButton
          label='delete'
          onClick={ el => {
            dispatch({
              type: 'DELETE_ENTRY',
              id: e.id,
            });

            const newStorage = entries.filter(elm => elm.id !== e.id)
            localStorage.setItem('entries', JSON.stringify(newStorage)) ;
          }}
        />
        </li>
      )}
    </ul>
  </Paper>
)};


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editor: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleClickList = this.handleClickList.bind(this);
  }

  handleClick(e) {
    const { entries, currentEntry, dispatch } = this.props;
    if (this._input.props.value) {
      const id = v4();
      currentEntry ?
        dispatch(editEntry(currentEntry.id, this._input.props.value)) :
        dispatch(addEntry(id,this._input.props.value));



      this.setState({
        editor: '',
      });

      dispatch(clearCurrentEntry());

      localStorage.setItem('entries', JSON.stringify([
        ...entries,
        {id, entry: this._input.props.value},
      ]));

    }
  }

  handleClickList(id) {
    const { dispatch } = this.props;
    return function (e) {
      dispatch({
        type: 'SET_CURRENT_ENTRY',
        id,
      });
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const entries = JSON.parse(window.localStorage.getItem('entries'));
    if (entries.length) {
      return entries.map(e => dispatch(addEntry(e.id, e.entry)));
    }
  }

  handleChange(e) {
    this.setState({
      editor: e.target.value,
    });
  }

  componentWillReceiveProps(nextProps) {
    const { currentEntry, entries } = nextProps;
    if (currentEntry && this._input.value !== currentEntry.entry) {
      this.setState({
        editor: currentEntry.entry,
      })

    }
  }

  componentDidUpdate() {
    this._input.focus();
  }

  render() {
    const { editor } = this.state;
    const markdowned = marked(this.state.editor);
    const storage = window.localStorage.getItem('entries');

    return (
      <div className="App">
        <Grid className="main">
          <Row>
            <Col sm={12} md={4}>
              <EntryList
                dispatch={this.props.dispatch}
                entries={this.props.entries.length ? this.props.entries : JSON.parse(storage) || []}
                handleClick={this.handleClickList}
              />
            </Col>
            <Col sm={12} md={8}>
              <Row>
                <Col sm={12} md={12}>
                  <CardComponent
                    title="Markdown"
                    subtitle="ここにMarkdownを書くと、左下にTextileが表示されます"
                  >
                    <TextField
                      ref={(c) => this._input = c }
                      name="markdown-editor"
                      onChange={this.handleChange}
                      value={this.state.editor}
                      fullWidth={true}
                      multiLine={true}
                    />
                    <RaisedButton
                      label="save & new item"
                      primary={true}
                      onClick={this.handleClick}
                    />
                  </CardComponent>
                </Col>
              </Row>
              <Row>
                <Col sm={12} md={6}>
                  <CardComponent
                    title="Textile Viewer" >
                    <TextField
                      name="textile-convert"
                      value={markdown2Textile(editor)}
                      fullWidth={true}
                      multiLine={true}
                    />
                  </CardComponent>
                </Col>
                <Col sm={12} md={6}>
                  <h2>Result</h2>
                  <div
                    className="markdown-body"
                    style={mdStyle}
                    dangerouslySetInnerHTML={{
                      __html: markdowned,
                    }}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const entries = getEntryIds(state).map(
    e => getEntriesById(state, e)
  );
  return {
    entries,
    currentEntry: getCurrentEntry(state),
  };
};

App = connect(
  mapStateToProps,
  null
)(App);

const MuiApp = () => (
  <MuiThemeProvider>
    <App />
  </MuiThemeProvider>
);


export default MuiApp;
