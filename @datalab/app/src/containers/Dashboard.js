import React, { Component } from 'react';
import { compose } from 'react-apollo';
import { Route, Switch, Link, Redirect } from 'react-router-dom';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { withStyles } from '@material-ui/core/styles';

import Partners from './Partners';

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper
  }
});

const PARTNERS_URL = '/partners';
const CONTACTS_URL = '/contacts';

class Dashboard extends Component {
  render() {
    const {
      classes,
      location: { pathname }
    } = this.props;

    return (
      <div className={classes.root}>
        <Tabs value={pathname === '/' ? PARTNERS_URL : pathname}>
          <Tab component={Link} label="Partners" to={PARTNERS_URL} value={PARTNERS_URL} />
          <Tab component={Link} label="Contacts" to={CONTACTS_URL} value={CONTACTS_URL} />
        </Tabs>
        <Switch>
          <Route path={PARTNERS_URL} component={Partners} />
          <Route path={CONTACTS_URL} component={() => <div />} />
          <Redirect from="/" exact to={PARTNERS_URL} />
        </Switch>
      </div>
    );
  }
}

export default compose(withStyles(styles))(Dashboard);
