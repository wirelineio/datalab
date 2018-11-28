import React, { Component } from 'react';
import classNames from 'classnames';
import Select from 'react-select';
import Creatable from 'react-select/lib/Creatable';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import MenuItem from '@material-ui/core/MenuItem';
import CancelIcon from '@material-ui/icons/Cancel';
import { emphasize } from '@material-ui/core/styles/colorManipulator';
import CircularProgress from '@material-ui/core/CircularProgress';
import InputAdornment from '@material-ui/core/InputAdornment';

const styles = theme => ({
  input: {
    display: 'flex',
    padding: 0,
    cursor: 'default'
  },
  valueContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: 1,
    alignItems: 'center'
  },
  chip: {
    margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`
  },
  chipFocused: {
    backgroundColor: emphasize(theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.grey[700], 0.08)
  },
  noOptionsMessage: {
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`
  },
  singleValue: {
    fontSize: 16
  },
  placeholder: {
    position: 'absolute',
    left: 2,
    fontSize: 16
  },
  paper: {
    position: 'absolute',
    zIndex: 100,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0
  },
  divider: {
    height: theme.spacing.unit * 2
  }
});

function NoOptionsMessage(props) {
  return (
    <Typography color="textSecondary" className={props.selectProps.classes.noOptionsMessage} {...props.innerProps}>
      {props.children}
    </Typography>
  );
}

function inputComponent({ inputRef, ...props }) {
  return <div ref={inputRef} {...props} />;
}

function Control(props) {
  const { loading, ...textFieldProps } = props.selectProps.textFieldProps;
  return (
    <TextField
      fullWidth
      InputProps={{
        inputComponent,
        inputProps: {
          className: props.selectProps.classes.input,
          inputRef: props.innerRef,
          children: props.children,
          ...props.innerProps
        },
        startAdornment: loading && (
          <InputAdornment position="start">
            <CircularProgress size={24} />
          </InputAdornment>
        )
      }}
      {...textFieldProps}
    />
  );
}

function Option(props) {
  return (
    <MenuItem
      buttonRef={props.innerRef}
      selected={props.isFocused}
      component="div"
      style={{
        fontWeight: props.isSelected ? 500 : 400
      }}
      {...props.innerProps}
    >
      {props.children}
    </MenuItem>
  );
}

function Placeholder(props) {
  return (
    <Typography color="textSecondary" className={props.selectProps.classes.placeholder} {...props.innerProps}>
      {props.children}
    </Typography>
  );
}

function SingleValue(props) {
  return (
    <Typography className={props.selectProps.classes.singleValue} {...props.innerProps}>
      {props.children}
    </Typography>
  );
}

function ValueContainer(props) {
  return <div className={props.selectProps.classes.valueContainer}>{props.children}</div>;
}

function MultiValue(props) {
  return (
    <Chip
      tabIndex={-1}
      label={props.children}
      className={classNames(props.selectProps.classes.chip, {
        [props.selectProps.classes.chipFocused]: props.isFocused
      })}
      onDelete={props.selectProps.isClearable || props.data.deleteable ? props.removeProps.onClick : null}
      deleteIcon={<CancelIcon {...props.removeProps} />}
    />
  );
}

function Menu(props) {
  return (
    <Paper square className={props.selectProps.classes.paper} {...props.innerProps}>
      {props.children}
    </Paper>
  );
}

const components = {
  Control,
  Menu,
  MultiValue,
  NoOptionsMessage,
  Option,
  Placeholder,
  SingleValue,
  ValueContainer
};

class Autocomplete extends Component {
  handleChange = value => {
    const { field, form, onBeforeChange, onAfterChange } = this.props;

    if (onBeforeChange) {
      value = onBeforeChange(value, { field, form });
    }

    form.setFieldValue(field.name, value);

    if (onAfterChange) {
      onAfterChange(value, { field, form });
    }
  };

  handleBlur = () => {
    const {
      field: { name },
      form: { setFieldTouched }
    } = this.props;
    setFieldTouched(name, true);
  };

  render() {
    const {
      field,
      form: { touched, errors, isSubmitting },
      loading,
      classes,
      theme,
      styles,
      textFieldProps = {},
      isCreatable,
      ...props
    } = this.props;

    const selectStyles = {
      ...styles,
      input: base => ({
        ...base,
        color: theme.palette.text.primary,
        '& input': {
          font: 'inherit'
        }
      })
    };

    const hasError = !!(touched[field.name] && errors[field.name]);

    let helperText;
    if (hasError) {
      const errorList = errors[field.name];
      if (typeof errorList === 'string') {
        helperText = errorList;
      } else {
        helperText = Object.keys(errorList)
          .map(key => errorList[key])
          .join('\n');
      }
    }

    const _textFieldProps = {
      ...textFieldProps,
      error: hasError,
      helperText,
      loading
    };

    if (isCreatable) {
      return (
        <Creatable
          isDisabled={isSubmitting}
          classes={classes}
          styles={selectStyles}
          components={components}
          textFieldProps={_textFieldProps}
          value={field.value}
          {...props}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
        />
      );
    }

    return (
      <Select
        isDisabled={isSubmitting}
        classes={classes}
        styles={selectStyles}
        components={components}
        textFieldProps={_textFieldProps}
        value={field.value}
        {...props}
        onChange={this.handleChange}
        onBlur={this.handleBlur}
      />
    );
  }
}

export default withStyles(styles, { withTheme: true })(Autocomplete);
