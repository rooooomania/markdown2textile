import React, {Component} from 'react';
import { Grid, Col, Row } from 'react-bootstrap';
import TextField from 'material-ui/TextField';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import marked from 'marked';
import { markdown2Textile } from './utils/Converter';
import 'github-markdown-css';
import CardComponent from './components/CardComponent';

import injectTapEventPlugin from 'react-tap-event-plugin';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

// TODO: store で情報を管理するテキストエディタ
// TODO: マテリアルデザイン、React Bootstrapを使ったデザイン
// TODO: React, Reduxを使ったデータ管理

const mdStyle = {
  boxSizing: 'border-box',
  margin: '0 auto',
  padding: '5px',
};


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editor: '',
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.setState({
      editor: e.target.value,
    });
  }

  render() {
    const { editor } = this.state;
    const markdowned = marked(this.state.editor);
    return (
      <div className="App">
        <Grid className="editor">
          <Row>
            <Col sm={12} md={12}>
              <CardComponent
                title="Markdown"
                subtitle="ここにMarkdownを書くと、左下にTextileが表示されます"
                >
                <TextField
                  name="markdown-editor"
                  onChange={this.handleChange}
                  value={this.state.editor}
                  fullWidth={true}
                  multiLine={true}
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
        </Grid>
      </div>
    );
  }
}

const MuiApp = () => (
  <MuiThemeProvider>
    <App />
  </MuiThemeProvider>
);

export default MuiApp;
