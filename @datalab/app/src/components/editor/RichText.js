import React, { Component } from 'react';
import { Editor, EditorState, ContentState, SelectionState, Modifier } from 'draft-js';
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

const spellcheckDecorator = ({ errors = [], onFix }) =>
  new SimpleDecorator(
    (contentBlock, callback) => {
      const text = contentBlock.getText();
      errors.forEach(error => {
        const word = new RegExp(`\\b${error.word}\\b`, 'ig');

        const props = {
          messages: error.messages,
          suggestions: error.suggestions,
          word: error.word,
          blockKey: contentBlock.getKey()
        };

        let match;
        while ((match = word.exec(text)) !== null) {
          // Decorate the color code
          let matchText = match[0];
          let start = match.index;
          let end = start + matchText.length;
          callback(start, end, {
            start,
            end,
            ...props
          });
        }
      });
    },
    function render(props) {
      const { children, ...otherProps } = props;
      return (
        <WordError {...otherProps} onFix={onFix}>
          {children}
        </WordError>
      );
    }
  );

class RichText extends Component {
  constructor(props) {
    super(props);

    const { field } = props;

    this.errors = [];

    const contentState = ContentState.createFromText(field.value);
    const editorState = EditorState.createWithContent(
      contentState,
      spellcheckDecorator({ errors: this.errors, onFix: this.fix })
    );

    this.state = {
      search: 'helo',
      replace: 'hello',
      editorState
    };

    this.spellcheck = debounce(this.spellcheck.bind(this), 1000);
  }

  fix = ({ start, end, suggestion, blockKey }) => {
    const { field, form } = this.props;

    this.setState(
      state => {
        const { editorState } = state;

        const selectionToReplace = SelectionState.createEmpty(blockKey).merge({
          anchorOffset: start,
          focusOffset: end
        });

        const contentState = Modifier.replaceText(editorState.getCurrentContent(), selectionToReplace, suggestion);

        return {
          editorState: EditorState.push(editorState, contentState)
        };
      },
      () => {
        const { editorState } = this.state;
        const value = editorState.getCurrentContent().getPlainText();
        form.setFieldValue(field.name, value);
      }
    );
  };

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

    const errors = await onSpellcheck({ value });
    this.errors = errors;

    this.setState(state => ({
      editorState: EditorState.set(state.editorState, {
        decorator: spellcheckDecorator({ errors: this.errors, onFix: this.fix })
      })
    }));
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
