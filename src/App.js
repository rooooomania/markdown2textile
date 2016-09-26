import React, {Component} from 'react';
import { connect } from 'react-redux';
import { Grid, Col, Row } from 'react-bootstrap';
import { RaisedButton } from 'material-ui';
import TextField from 'material-ui/TextField';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import CopyToClipboard from 'react-copy-to-clipboard';
import marked from 'marked';
import { markdown2Textile } from './utils/Converter';
import 'github-markdown-css';
import CardComponent from './components/CardComponent';
import EntryList from './components/EntryList';
import { getEntryIds, getEntriesById, getCurrentEntry } from './configuredStore';
import actions from './actions/actionCreator';
import Snackbar from 'material-ui/Snackbar';


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

class App extends Component {
  constructor(props) {
    super(props);

    console.log('props', this.props)
    this.state = {
      editor: '',
      open: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleClickList = this.handleClickList.bind(this);
    this.handleTouchTap = this.handleTouchTap.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);
  }

  handleClick(e) {
    const { entries, currentEntry, addEntry, editEntry, clearCurrentEntry } = this.props;
    if (this._input.props.value) {
      const id = v4();
      currentEntry ?
        editEntry({id: currentEntry.id, entry: this._input.props.value}) :
        addEntry({id: id, entry: this._input.props.value});

      this.setState({
        editor: '',
      });

      clearCurrentEntry();

      localStorage.setItem('entries', JSON.stringify([
        ...entries,
        {id, entry: this._input.props.value},
      ]));

    }
  }

  handleClickList(id) {
    const { setCurrentEntry } = this.props;
    return function(e) {
      console.log('setCurrentEntry invoked');
      setCurrentEntry(id);
    };
  }

  handleTouchTap() {
    this.setState({
      open: true,
    });
  }

  handleRequestClose() {
    this.setState({
      open: false,
    })
  }

  componentDidMount() {
    const { addEntry } = this.props;
    const entries = JSON.parse(window.localStorage.getItem('entries'));
    if (entries.length) {
      return entries.map(e => addEntry({ id: e.id, entry: e.entry}));
    }
  }

  handleChange(e) {
    this.setState({
      editor: e.target.value,
    });
  }

  componentWillReceiveProps(nextProps) {
    const { currentEntry } = nextProps;
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
    const { deleteEntry } = this.props;
    const { editor } = this.state;
    const markdowned = marked(this.state.editor);
    const storage = window.localStorage.getItem('entries');

    return (
      <div className="App">
        <Grid className="main">
          <Row>
            <Col sm={12} md={4}>
              <EntryList
                entries={this.props.entries.length ? this.props.entries : JSON.parse(storage) || []}
                handleClick={this.handleClickList}
                deleteEntry={deleteEntry}
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
                    <CopyToClipboard
                      text={markdown2Textile(this.state.editor)}
                    >
                      <RaisedButton
                        onTouchTap={this.handleTouchTap}
                        label="Copy to Clipboard"
                        primary={false}
                      />
                    </CopyToClipboard>
                  </CardComponent>
                </Col>
              </Row>
              <Row>
                <Col sm={12} md={12}>
                  <h2>Result</h2>
                  <div
                    className="markdown-body"
                    style={mdStyle}
                    dangerouslySetInnerHTML={{
                      __html: markdowned,
                    }}
                  />
                </Col>
                <Col sm={12} md={12}>
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
              </Row>
            </Col>
          </Row>
        </Grid>
        <Snackbar
          open={this.state.open}
          message='your textile was copied on clip board'
          autoHideDuration={3000}
          onRequestClose={this.handleRequestClose} />
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
  actions
)(App);

const MuiApp = () => (
  <MuiThemeProvider>
    <App />
  </MuiThemeProvider>
);


export default MuiApp;
