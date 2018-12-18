import React, { Component, Fragment } from 'react';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';

class SubmitServices extends Component {
  state = {
    openMenu: false
  };

  handleMenuToggle = () => {
    this.setState(state => ({
      openMenu: !state.openMenu
    }));
  };

  handleMenuSubmit = serviceId => {
    const { submitForm } = this.props;

    this.setState(
      {
        openMenu: false
      },
      () => {
        submitForm(serviceId);
      }
    );
  };

  render() {
    const { services, serviceId } = this.props;
    const { openMenu } = this.state;

    let service;
    let handle = this.handleMenuToggle;

    if (serviceId) {
      service = services.find(s => s.id === serviceId);
    } else if (services.length === 1) {
      service = services[0];
    }

    if (service) {
      handle = () => this.handleMenuSubmit(service.id);
    }

    return (
      <Fragment>
        <Button
          buttonRef={node => {
            this.submitAnchorEl = node;
          }}
          aria-owns={openMenu ? 'menu-list-grow' : undefined}
          aria-haspopup="true"
          onClick={handle}
          color="primary"
        >
          Save in{service && ` ${service.name}`}
        </Button>
        <Popper open={openMenu} anchorEl={this.submitAnchorEl} transition disablePortal>
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              id="menu-list-grow"
              style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
            >
              <Paper>
                <ClickAwayListener onClickAway={this.handleMenuToggle}>
                  <MenuList>
                    {services.map(s => (
                      <MenuItem key={s.id} onClick={() => this.handleMenuSubmit(service.id)}>
                        {s.name}
                      </MenuItem>
                    ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </Fragment>
    );
  }
}

export default SubmitServices;
