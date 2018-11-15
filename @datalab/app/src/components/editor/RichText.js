import React, { Component } from 'react';
import { Editor, EditorState, ContentState } from 'draft-js';
import SimpleDecorator from 'draft-js-simpledecorator';
import debounce from 'lodash.debounce';

import FormLabel from '@material-ui/core/FormLabel';
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
    '& .DraftEditor-root': {
      marginTop: 3
    },
    '& .public-DraftEditor-content': {
      minHeight: 50
    },
    '& .public-DraftEditorPlaceholder-root': {
      position: 'absolute',
      pointerEvents: 'none',
      userSelect: 'none'
    },
    '& .public-DraftEditorPlaceholder-inner': {
      color: theme.palette.grey[500]
    }
  }
});

class RichText extends Component {
  constructor(props) {
    super(props);

    const { field } = props;

    this.errors = [];

    this.spellcheckDecorator = new SimpleDecorator(
      (contentBlock, callback) => {
        const text = contentBlock.getText();
        this.errors.forEach(error => {
          const word = new RegExp(error.word, 'ig');
          const props = {
            messages: error.messages
          };

          let match;
          while ((match = word.exec(text)) !== null) {
            // Decorate the color code
            let matchText = match[0];
            let start = match.index;
            let end = start + matchText.length;
            callback(start, end, props);
          }
        });
      },

      /**
       * @prop {String} color
       */
      function component(props) {
        const { messages, children } = props;
        return <WordError messages={messages}>{children}</WordError>;
      }
    );

    const contentState = ContentState.createFromText(field.value);
    const editorState = EditorState.createWithContent(contentState, this.spellcheckDecorator);

    this.state = {
      editorState
    };

    this.spellcheck = debounce(this.spellcheck.bind(this), 1000);
  }

  componentDidMount() {
    const { editorState } = this.state;
    this.spellcheck(editorState.getCurrentContent().getPlainText());
  }

  onChange = editorState => {
    const { editorState: oldEditorState } = this.state;
    const { field, form } = this.props;

    this.setState({ editorState }, () => {
      const { editorState } = this.state;
      const oldValue = oldEditorState.getCurrentContent().getPlainText();
      const value = editorState.getCurrentContent().getPlainText();
      form.setFieldValue(field.name, value);
      if (oldValue !== value) {
        this.spellcheck(value);
      }
    });
  };

  spellcheck = async value => {
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
    const { classes, label, placeholder } = this.props;
    return (
      <div className={classes.root}>
        <FormLabel className={classes.formLabel}>{label}</FormLabel>
        <Editor editorState={this.state.editorState} onChange={this.onChange} placeholder={placeholder} />
      </div>
    );
  }
}

export default withStyles(styles)(RichText);
