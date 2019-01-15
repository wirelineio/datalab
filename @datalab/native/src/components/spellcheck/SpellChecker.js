import React, { Component, Fragment } from 'react';
import { Spinner } from 'native-base';
import styled from 'styled-components/native';
import { Grid, Col } from 'react-native-easy-grid';
import Popover from 'react-native-popover-view';

import { material } from '../../style/variables';
import Icon from '../Icon';
import Text from '../Text';
import Modal from '../Modal';
import Button from '../Button';

const LINE_BREAK = '\n';

const SpellCheckerStatus = styled.TouchableOpacity`
  margin: 8px;
  margin-top: 4px;
  height: 20px;
  padding-top: 1px;
`;

export default class SpellChecker extends Component {
  state = {
    fixerOpened: false
  };

  onPress = () => {
    this.props.errors.length > 0 && this.setState({ fixerOpened: true });
  };

  onFixerClose = () => this.setState({ fixerOpened: false });

  onFixerFix = value => {
    this.onFixerClose();
    this.props.onFix(value);
  };

  render() {
    const { errors = [], loading = true, value = '' } = this.props;
    const valid = errors.length === 0;

    const icon = valid ? 'check' : 'error-outline';
    const color = loading ? material.brandInfo : valid ? material.brandSuccess : material.brandDanger;
    const text = `SpellCheck${!valid ? `: ${errors.length} misspelled word${errors.length !== 1 ? 's' : ''}` : ''}`;

    return (
      <Fragment>
        <SpellCheckerStatus onPress={this.onPress}>
          <Grid>
            <Col style={{ width: 20 }}>
              {loading ? (
                <Spinner size={16} color={material.brandInfo} style={{ height: 16 }} />
              ) : (
                <Icon size={16} name={icon} color={color} />
              )}
            </Col>
            <Col>
              <Text fontSize="14px" lineHieght="14px" color={color} textDecorationLine="underline">
                {text}
              </Text>
            </Col>
          </Grid>
        </SpellCheckerStatus>
        {this.state.fixerOpened && (
          <SpellCheckerFixer onClose={this.onFixerClose} onFix={this.onFixerFix} value={value} errors={errors} />
        )}
      </Fragment>
    );
  }
}

const FixeableTextView = styled.View`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  align-items: flex-start;
  width: 100%;
`;

const FixeableText = styled(FixeableTextView)`
  border-radius: 4px;
  background-color: #f2f2f2;
  padding: 8px;
`;

const FixeableWord = props => {
  const { onPress, error, children, onRef } = props;

  return (
    <Text onPress={() => onPress(error)} ref={onRef} color="red" fontWeight="bold" padding="0 2px">
      {children}
    </Text>
  );
};

class SpellCheckerFixer extends Component {
  state = {
    showSuggestions: false,
    currentWord: null,
    fixeableText: null,
    errors: []
  };

  wordRefs = {};

  componentDidMount() {
    this.setState({ errors: this.props.errors, fixeableText: this.props.value });
  }

  renderFixeableLine = (lineIndex, text, errors) => {
    let lastIndex = 0;
    return (
      <FixeableTextView key={lineIndex}>
        {errors
          .reduce((all, error) => {
            let { column, word, line } = error;
            const wordIndex = column - 1;
            const key = line + column;
            const prevText = text.slice(lastIndex, wordIndex);

            if (prevText) all.push(<Text key={line + 'prev'}>{prevText}</Text>);

            all.push(
              <FixeableWord
                key={key}
                onRef={r => (this.wordRefs[key] = r)}
                onPress={this.onPressWord(key)}
                error={error}
                renderToHardwareTextureAndroid={true}
                collapsable={false}
              >
                {word}
              </FixeableWord>
            );

            lastIndex = column + word.length;

            return all;
          }, [])
          .concat(text.slice(lastIndex).length ? <Text key={lineIndex + 1 + 'last'}>{text.slice(lastIndex)}</Text> : [])
          .filter(Boolean)}
      </FixeableTextView>
    );
  };

  renderFixeableText = () => {
    const { errors, fixeableText } = this.state;

    if (!fixeableText) return null;

    const lines = fixeableText.split(LINE_BREAK);

    return (
      <FixeableText>
        {lines.map((line, lineIndex) =>
          this.renderFixeableLine(lineIndex, line, errors.filter(e => e.line === lineIndex + 1))
        )}
      </FixeableText>
    );
  };

  onPressWord = key => error => {
    this.setState({ currentWord: { error, viewRef: this.wordRefs[key] }, showSuggestions: true });
  };

  onPressSuggestion = async (suggestion, error) => {
    const { fixeableText, errors } = this.state;

    const lines = fixeableText.split(LINE_BREAK);
    const replacedErrorLine = lines[error.line - 1];
    const originalLine = replacedErrorLine;

    lines[error.line - 1] = [
      ...replacedErrorLine.slice(0, error.column - 1),
      suggestion,
      replacedErrorLine.slice(error.column + error.word.length - 1)
    ].join('');

    const filteredErrors = errors
      .filter(e => e.line !== error.line || (e.column !== error.column && e.word !== error.word))
      .map(e => ({
        ...e,
        column:
          e.line === error.line && e.column > error.column
            ? e.column - (originalLine.length - replacedErrorLine.length)
            : e.column
      }));

    this.setState({
      fixeableText: lines.join(LINE_BREAK),
      errors: filteredErrors,
      showSuggestions: false
    });
  };

  onDone = () => {
    this.props.onFix(this.state.fixeableText);
  };

  onCloseSuggestions = () => {
    this.setState({ showSuggestions: false });
  };

  render() {
    const { onClose } = this.props;
    const { currentWord, showSuggestions } = this.state;

    return (
      <Fragment>
        <Modal onClose={onClose} title="SpellCheck fixer">
          {this.renderFixeableText()}
          <Button primary block small onPress={this.onDone} marginTop={8}>
            Done
          </Button>
        </Modal>
        {showSuggestions && (
          <Popover
            isVisible={true}
            onClose={this.onCloseSuggestions}
            popoverStyle={{
              padding: 8
            }}
            fromView={showSuggestions ? currentWord.viewRef : undefined}
            showInModal={true}
          >
            <Text fontWeight="bold">
              Replace <Text color="red">{currentWord.error.word}</Text> with:
            </Text>
            {showSuggestions &&
              currentWord.error.suggestions &&
              currentWord.error.suggestions.map(s => (
                <Text
                  key={s}
                  onPress={() => this.onPressSuggestion(s, currentWord.error)}
                  padding="4px 8px"
                  textDecorationLine="underline"
                  fontSize="16px"
                  color="#40a0ae"
                >
                  {s}
                </Text>
              ))}
          </Popover>
        )}
      </Fragment>
    );
  }
}
