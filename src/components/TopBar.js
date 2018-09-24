import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from "react-router-dom";

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/icons/Menu';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import StarBorderIcon from '@material-ui/icons/StarBorder';

const styles = theme => ({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      overflow: 'hidden',
      backgroundColor: theme.palette.background.paper,
      width: 300,
    },
    gridList: {
      flexWrap: 'wrap',
      // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
      transform: 'translateZ(0)',
      width: 300,
      
      '&:hover, &$focusVisible': {
        zIndex: 1,
        '& $imageBackdrop': {
          opacity: 0.15,
        },
        '& $imageMarked': {
          opacity: 0,
        },
        '& $imageTitle': {
          border: '4px solid currentColor',
        },
      },
    },
    focusVisible: {},
    imageBackdrop: {
        backgroundColor: theme.palette.common.black,
        opacity: 0.4,
        transition: theme.transitions.create('opacity'),
    },
    imageMarked: {
        backgroundColor: theme.palette.common.white,
        left: 'calc(50% - 9px)',
        transition: theme.transitions.create('opacity'),
    },
    title: {
      color: theme.palette.primary.light,
    },
    titleBar: {
      background:
        'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
    },
  });

class TopBar extends Component {
    constructor(props) {
        super(props);
        this.toggleDrawer = this.toggleDrawer.bind(this)
    }
    state = {
        left: false,
        right: false,
    };

    toggleDrawer = (side, open) => () => {
        this.setState({
            ...this.state,
            [side]: open,
        });
    };

    handleClick = () => {
        this.setState(state => ({
            ...state,
             open: !state.open 
        }));
      };

   
    render() {
        const { dirList, navigate } = this.props;

        const rightSideList = (
            <div className="sidebar">
            <div className="side-top">
                <h2>RC Views</h2>
            </div>
            <GridList className="right-sidebar" cols={1}>
                {dirList.length > 0 && dirList.map((tile, i) => (
                <GridListTile key={i} classes={styles.gridList}>
                    <img src={'../test_dataset/' +tile.path} alt={tile.name} />
                    <GridListTileBar
                    title={tile.name}
                    classes={{
                        root: styles.titleBar,
                        title: styles.title,
                    }}
                    actionIcon={
                        <IconButton>
                            <StarBorderIcon className={styles.title} />
                        </IconButton>
                    }
                    />
                </GridListTile>
                ))}
            </GridList>
            </div>
        );

        const sideList = (
            <div className="sidebar">
                <div className="side-top">
                    <h2>RC</h2>
                </div>
                <List component="nav">
                    <ListItem button onClick={()=>navigate('/')}>
                        <ListItemText  primary="Define RC Attributes" />
                    </ListItem>
                    <Divider />
                    <ListItem button onClick={this.handleClick}>
                        <ListItemText  primary="RC Views" />
                        {this.state.open ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={this.state.open} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {
                                [0, 1, 2, 3, 4, 5].map((i) => {
                                    return ( <ListItem  key={i} button className="nested" onClick={()=>{navigate('/rc-views/'+i); this.toggleDrawer('left', false)}}><ListItemText inset key={i} primary={i} /> </ListItem>)
                                })      
                            }
                        </List>
                    </Collapse>
                    <Divider />
                    <ListItem button>
                        <ListItemText primary="Define each building (Rb)" />
                    </ListItem>
                    <Divider />
                    <ListItem button>
                        <ListItemText primary="Define floors for each Rb"/>
                    </ListItem>
                </List>
            </div>
        );

        return (
            <div>
                <div style={{flexGrow: 1}}>
                <AppBar position="static" className="app-bar">
                    <Toolbar>
                        <IconButton  onClick={this.toggleDrawer('left', true)} className="back-btn" color="inherit" aria-label="Menu" style={{color: 'white'}}>
                            <Menu />
                        </IconButton>
                    <Typography variant="title" color="inherit" className="title" style={{flexGrow: 1}}>
                        Admin Tool
                    </Typography>
                    <Button color="inherit" onClick={this.toggleDrawer('right', true)}>Folder</Button>
                    </Toolbar>
                </AppBar>
            </div>
                <Drawer open={this.state.left} onClose={this.toggleDrawer('left', false)}>
                    <div
                    tabIndex={0}
                    role="button"
                    >
                    {sideList}
                    </div>
                </Drawer>
                <Drawer anchor="right" open={this.state.right} onClose={this.toggleDrawer('right', false)}>
                    <div
                    tabIndex={0}
                    role="button"
                    >
                    {rightSideList}
                    </div>
                </Drawer>
            </div>
        )
    }
}

TopBar.propTypes = {
    dirList: PropTypes.array,
    navigate: PropTypes.func
}

export default TopBar;