import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from "react-router-dom";
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';

import TopBar from './TopBar';

import * as actions from '../actions/adminActions';

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      dirList: [],
      json: {
        location_GPS_point: "34"
      },
      RC_views: [],
    }

    this.handleChange = this.handleChange.bind(this);
    this.saveData = this.saveData.bind(this);
    this.navigate = this.navigate.bind(this)
  }

  handleChange = name => event => {
    this.setState({
      ...this.state,
      json: {
        ...this.state.json,
        [name]: event.target.value,
      }
    });
  };

  saveData = () => {
    actions.saveData({...this.state.json}).then( res => {
      console.log('saved');
    });
  }

  navigate = (url) => {
    if (this.props.history) {
      this.props.history.push(url);
    }
  }

  componentDidMount() {
    actions.getAll().then((values) => {
      this.setState({loading: false, json: values[0], dirList: values[1]});
    });
  }

  render() {
    // const dirSelList =  dirNameList.map((name, i) => {
    //     return ( 
    //       <MenuItem key={i} value={i}>{name}</MenuItem>
    //     )
    //   }
    // )
   
    return (
      <div>
        <TopBar 
          dirList={this.state.dirList}  
          navigate={this.navigate} 
          json={this.state.json} 
          activeStage={1} />      
        {
          this.state.loading ? 
            <div> ...loading </div> :
            <Card className="card">
              <CardContent>
                <Typography className="card-title" color="textSecondary">
                  Define RC Main Attributes
                </Typography>
                <form className="container" noValidate autoComplete="off">
                  <TextField
                    required
                    id="name"
                    label="Name"
                    className="textField"
                    value={this.state.json.name}
                    onChange={this.handleChange('name')}
                    margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  <TextField
                    required
                    id="location_GPS_point"
                    label="location-GPS-point"
                    className="textField"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    placeholder="47.159444, 27.610089"
                    value={this.state.json.location_GPS_point}
                    onChange={this.handleChange('location_GPS_point')}
                    margin="normal"
                  />
                  <TextField
                    required
                    id="short_description"
                    label="Short Description"
                    style={{ margin: 8 }}
                    placeholder="This is the powerful admin tool."
                    helperText="Please input precise description"
                    fullWidth
                    margin="normal"
                    value={this.state.json.short_description}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={this.handleChange('short_description')}
                  />
                  <TextField
                    required
                    id="location_GPS_shape_coords"
                    label="location-GPS-shape-coords"
                    style={{ margin: 8 }}
                    placeholder="868, 531.5625; 1047, 531.5625; 1046, 646.5625; 989, 663.5625"
                    helperText="Please input coords with comma seprated value."
                    fullWidth
                    margin="normal"
                    value={this.state.json.location_GPS_shape_coords}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={this.handleChange('location_GPS_shape_coords')}
                  />
                  <TextField
                    required
                    id="location"
                    label="Location"
                    style={{ margin: 8 }}
                    value={this.state.json.location}
                    placeholder="Bucsinescu - Oancea, Strada Orfelinatului, Iași 700259"
                    helperText="Please input full location address."
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={this.handleChange('location')}
                  />
                </form>
              </CardContent>
              <Divider />
              <CardContent>
                <Typography className="card-title" color="textSecondary">
                  Define RC Attributes (Continue)
                </Typography>
                <form className="container" noValidate autoComplete="off">
                  {/* <FormControl className="formControl">
                    <InputLabel htmlFor="dir-simple">Select a Directory</InputLabel>
                    <Select
                      value={json.rc_views_dir}
                      onChange={handleRCDirChange}
                      inputProps={{
                        name: 'rc_views_dir',
                        id: 'dir-simple',
                      }}
                    >
                    { dirSelList }
                    </Select>
                  </FormControl> */}
                    <TextField
                        required
                        id="number_of_buildings"
                        label="# of Buildings"
                        className="textField"
                        placeholder="6"
                        value={this.state.json.number_of_buildings}
                        onChange={this.handleChange('number_of_buildings')}
                        margin="normal"
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                      <TextField
                        id="number_of_aps"
                        label="# of Apartments"
                        style={{ margin: 8 }}
                        value={this.state.json.number_of_aps}
                        placeholder="500"
                        helperText="This value is just as a hint, not precise"
                        margin="normal"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        onChange={this.handleChange('number_of_aps')}
                      />
                      <TextField
                        id="number_of_parking_places"
                        label="# of Parking Places"
                        style={{ margin: 8 }}
                        value={this.state.json.number_of_parking_places}
                        placeholder="2"
                        helperText="This value is just optional"
                        margin="normal"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        onChange={this.handleChange('number_of_parking_places')}
                      />
                    
                </form>
              </CardContent>
              <CardActions>
                <Button onClick={() => this.saveData()} variant="contained" color="secondary" size="large">Save</Button>
              </CardActions>
            </Card>
        }
      </div>
    );
  }
}

HomePage.propTypes = {
  handleChange: PropTypes.func,
  handleRCDirChange: PropTypes.func,
  navigate: PropTypes.func,
  saveData: PropTypes.func,
  dirList: PropTypes.array,
  classes: PropTypes.object,
  json: PropTypes.object,
  parent: PropTypes.object,
  dirIndex: PropTypes.number,
  RC_views: PropTypes.array,
  actions: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    dirList: state.AdminReducer.dirList,
    json:state.AdminReducer.json,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(HomePage));
