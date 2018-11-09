import React, { Component } from 'react';
import { compose } from 'react-apollo';

import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import Kanban from './partners/Kanban';

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper
  }
});

class Dashboard extends Component {
  state = {
    value: 0
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <div className={classes.root}>
        <Tabs value={value} onChange={this.handleChange}>
          <Tab label="Partners" />
          <Tab label="Contacts" />
        </Tabs>
        {value === 0 && <Kanban />}
        {value === 1 && <div />}
      </div>
    );
  }
}

export default compose(withStyles(styles))(Dashboard);
