import React, { Component } from 'react';

import { lighten } from '@material-ui/core/styles/colorManipulator';
import { withStyles } from '@material-ui/core/styles';

import { SVG, Graph as D3Graph } from '@wirelineio/ux';

const styles = theme => ({
  root: {
    height: '70vh',
    width: '100%'
  },
  svg: {
    height: '100%',
    width: '100%'
  },
  graph: {
    backgroundColor: '#fafafa',
    fontFamily: theme.typography.fontFamily,
    '& .ux-node': {
      '& circle': {
        stroke: 'gray',
        strokeWidth: 3,
        fill: lighten('#808080', 0.6)
      },

      '& text': {
        fontSize: 14
      }
    },

    '& .ux-node.ux-node-partner': {
      '& circle': {
        fill: lighten('#E9967A', 0.3),
        stroke: theme.palette.primary.main,
        strokeWidth: 6
      },

      '& text': {
        fontSize: 18
      }
    },

    '& .ux-node-contact': {
      '& circle': {
        fill: lighten('#808080', 0.6),
        stroke: theme.palette.primary.main,
        strokeWidth: 4
      },

      '& text': {
        fontSize: 18
      }
    },

    '& path': {
      stroke: '#6666'
    },

    '& path.ux-link': {
      stroke: theme.palette.primary.main
    }
  }
});

class Graph extends Component {
  graphData = partners => {
    return partners.reduce(
      (data, { id, name, contacts }) => {
        data.nodes.push({
          type: 'partner',
          id,
          label: name,
          className: 'ux-node-partner'
        });

        contacts.forEach(({ id: contactId, name }) => {
          const contact = data.nodes.find(c => c.id === contactId);
          if (!contact) {
            data.nodes.push({
              type: 'contact',
              id: contactId,
              label: name,
              className: 'ux-node-contact'
            });
          }

          data.links.push({
            id: `${id}-${contactId}`,
            source: id,
            target: contactId,
            className: 'ux-link'
          });
        });
        return data;
      },
      {
        nodes: [],
        links: []
      }
    );
  };

  render() {
    const { classes, partners } = this.props;
    return (
      <div className={classes.root}>
        <SVG className={classes.svg}>
          <D3Graph data={this.graphData(partners)} className={classes.graph} />
        </SVG>
      </div>
    );
  }
}

export default withStyles(styles)(Graph);
