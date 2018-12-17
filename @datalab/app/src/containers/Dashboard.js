import React, { Component } from 'react';
import { compose } from 'react-apollo';
import { Route, Switch, Link, Redirect } from 'react-router-dom';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { withStyles } from '@material-ui/core/styles';

import Organizations from './Organizations';
import Contacts from './Contacts';

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper
  }
});

const ORGANIZATIONS_URL = '/organizations';
const CONTACTS_URL = '/contacts';

class Dashboard extends Component {
  render() {
    const {
      classes,
      location: { pathname }
    } = this.props;

    return (
      <div className={classes.root}>
        <Tabs value={pathname === '/' ? ORGANIZATIONS_URL : pathname}>
          <Tab component={Link} label="Organizations" to={ORGANIZATIONS_URL} value={ORGANIZATIONS_URL} />
          <Tab component={Link} label="Contacts" to={CONTACTS_URL} value={CONTACTS_URL} />
        </Tabs>
        <Switch>
          <Route path={ORGANIZATIONS_URL} component={Organizations} />
          <Route path={CONTACTS_URL} component={Contacts} />
          <Redirect from="/" exact to={ORGANIZATIONS_URL} />
        </Switch>
      </div>
    );
  }
}

export default compose(withStyles(styles))(Dashboard);
