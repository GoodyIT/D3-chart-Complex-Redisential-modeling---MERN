/* eslint-disable import/no-named-as-default */
import { Route, Switch } from "react-router-dom";

import HomePage from "./HomePage";
import RCViews from "./RCViews"
import PropTypes from "prop-types";
import React from "react";
import { hot } from "react-hot-loader";

// This is a class-based component because the current
// version of hot reloading won't hot reload a stateless
// component at the top-level.

class App extends React.Component {
  constructor(props) {
    super(props);

    this.handleRCDirChange = this.handleRCDirChange.bind(this);
    
    this.state = {
     json: {
      name: '',
      location_GPS_point: '',
      short_description: '',
      location_GPS_shape_coords: '',
      location: '',
      number_of_buildings: '1',
      number_of_aps: '',
      number_of_parking_places: '',
      RC_views: [
        
      ],
      unique_floor_plans: [
        
      ],
      buildings : [

      ],
      ap_types: [

      ]
     }
    }

  }
  componentDidMount() {

  }
  
  
  handleRCDirChange = event => {
    // var dirIndex = event.target.value;
    this.setState({ 
      json: {
        ...this.state.json,
        [event.target.name]: event.target.value,
      }});
  };

  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/" render={() => <HomePage  />} />
          <Route path="/rc-views/:building" render={() => <RCViews/>} />
        </Switch>
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.element,
  classes: PropTypes.object,
};

export default hot(module)((App));
