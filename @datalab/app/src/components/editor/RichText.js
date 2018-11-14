import React, { Component } from 'react';
import { Editor, EditorState } from 'draft-js';
import SimpleDecorator from 'draft-js-simpledecorator';
import debounce from 'lodash.debounce';

import { withStyles } from '@material-ui/core/styles';
import WordError from './WordError';

const styles = theme => ({
  root: {
    marginTop: theme.spacing.unit * 2,
    borderBottom: `1px solid ${theme.palette.divider}`,
    padding: `${8 - 2}px 0 ${8 - 1}px`,
    fontFamily: theme.typography.fontFamily,
    color: theme.palette.text.primary,
    fontSize: theme.typography.pxToRem(16),
    lineHeight: '1.1875em',
    '& .public-DraftEditor-content': {
      minHeight: 50
    }
  }
});

class RichText extends Component {
  constructor(props) {
    super(props);

    this.spellcheckDecorator = new SimpleDecorator(
      (contentBlock, callback) => {
        this.errors.forEach(error => {
          callback(error.start, error.end, {
            message: error.message
          });
        });
      },

      /**
       * @prop {String} color
       */
      function component(props) {
        const { message, children } = props;
        return <WordError title={message}>{children}</WordError>;
      }
    );

    this.state = {
      editorState: EditorState.createEmpty(this.spellcheckDecorator)
    };
    this.spellcheck = debounce(this.spellcheck.bind(this), 1000);
  }

  onChange = editorState => {
    this.errors = [];
    this.setState({ editorState }, () => {
      this.spellcheck();
    });
  };

  spellcheck = async () => {
    const { editorState } = this.state;
    const value = editorState.getCurrentContent().getPlainText();
    const { onSpellcheck } = this.props;

    if (!onSpellcheck) {
      return;
    }

    const {
      data: { errors = [] }
    } = await onSpellcheck({ value });
    this.forceEditorUpdate(errors);
  };

  forceEditorUpdate = errors => {
    this.errors = errors;
    const { editorState } = this.state;
    const contentState = editorState.getCurrentContent();

    const newEditorStateInstance = EditorState.createWithContent(contentState, this.spellcheckDecorator);

    const copyOfEditorState = EditorState.set(newEditorStateInstance, {
      selection: editorState.getSelection(),
      undoStack: editorState.getUndoStack(),
      redoStack: editorState.getRedoStack(),
      lastChangeType: editorState.getLastChangeType()
    });

    this.setState({ editorState: copyOfEditorState });
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Editor editorState={this.state.editorState} onChange={this.onChange} />
      </div>
    );
  }
}

export default withStyles(styles)(RichText);
