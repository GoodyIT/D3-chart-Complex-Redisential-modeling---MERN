import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from "react-router-dom";
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as d3 from 'd3';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import TopBar from './TopBar';

import * as actions from '../actions/adminActions';

var width = 940;
var height = 600;
var isStarted = false;
var dragger = undefined;
var dragging = false, drawing = false, startPoint;
var points = [];
var svg;
var polyID = 0, activeID = 0;
var selectedImage, fileName;
var listener;

class RCViews extends Component {
  constructor(props){
    super(props)
    this.state = {
      building: -1,
      loading: true,
      dirList: [],
      json: {},
      RC_views: [],
    }

    this.createPloygon = this.createPloygon.bind(this)
    this.drawPolygon = this.drawPolygon.bind(this)
    this.closePolygon = this.closePolygon.bind(this)
    this.handleDrag = this.handleDrag.bind(this)
    this.handleChange = this.handleChange.bind(this);
    this.saveData = this.saveData.bind(this);
    this.navigate = this.navigate.bind(this)
    this.updateRCViews = this.updateRCViews.bind(this)
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

  updateRCViews = (data, i) => {
    var _RC_Views = this.state.json.RC_views;
    if (_RC_Views == undefined) {
      _RC_Views = [];
    }
    if (_RC_Views.length < i + 1) {
      for (var idx = 0; idx < i; idx++) {
        _RC_Views.push([]);
      }
    }
    _RC_Views[i] = data;
    this.setState({
      ...this.state,
      json: {
        ...this.state.json,
        RC_views: _RC_Views,
      }
    }, () => {
      this.saveData();
    })
  }

  saveData = () => {
    actions.saveData({...this.state.json});
  }

  navigate = (url) => {
    if (this.props.history) {
      this.props.history.push(url);
    }
  }

  componentDidMount() {
    // this.createPloygon()
    var building = this.props.location.pathname.substr(this.props.location.pathname.lastIndexOf('/') + 1)
    let id = 0;
    try {
      id = parseInt(building);
    } catch(err) {};
    // if (this.state.building != building) {
    //   this.setState({building: id})
    // }
    actions.getAll().then((values) => {
      var dirList = [];
      for (const list of values[1]) {
        if (list.length > 0 && list[0].dir == 'RC_views') {
          dirList = list;
          break;
        }
      }
      this.setState({loading: false, building: id, json: values[0], dirList: dirList}, () => {
        this.createPloygon();
      });
    });
  }

  componentDidUpdate() {
    document.removeEventListener('keyup', listener, true);
  }

  componentWillReceiveProps(nextProps) {
    var building = nextProps.location.pathname.substr(nextProps.location.pathname.lastIndexOf('/') + 1)
    let id = 0;
    try {
      id = parseInt(building);
    } catch(err) {};
    
    this.setState({...this.state, building: id, loading: false}, () => {
      this.createPloygon();
      // if (nextProps.json.RC_views && nextProps.json.RC_views.length > 0) {
      //   this.redrawPolygonBasedonJson(nextProps.json.RC_views[id].buildings)
      // }
    })
    
    // if (this.state.building != id) {
    //   this.setState({building: id}, () => {
    //     this.createPloygon();
    //     if (nextProps.json.RC_views && nextProps.json.RC_views.length > 0) {
    //       this.redrawPolygonBasedonJson(nextProps.json.RC_views[id].buildings)
    //     }
    //   })
    // } else {
    //   if (nextProps.json.RC_views && nextProps.json.RC_views.length > 0) {
    //     this.redrawPolygonBasedonJson(nextProps.json.RC_views[id].buildings)
    //   }
    // }
  }

  componentDidUpdate() {
  }

  redrawPolygonBasedonJson(buildings) {
    for (const _points of buildings) {
      if (_points != '') {
        var array = _points.split(',');
        var pairsArray = [];
        for(var i = 0; i < array.length; i += 2){
            pairsArray.push([+array[i], +array[i+1]]);
        }
        points = pairsArray;
        this.closePolygon();
      }
    }
  }
  
  drawPolygon() {
    var g = svg.select('g.drawPoly')
    g.select('polyline').remove();
    g.append('polyline').attr('points', points)
                    .style('fill', '#E9E7E6')
                    .attr('opacity', '.3')
                    .attr('stroke', '#000');

    g.selectAll('circle').remove();
    for(var i = 0; i < points.length; i++) {
        g.append('circle')
          .attr('cx', points[i][0])
          .attr('cy', points[i][1])
          .attr('r', 4)
          .attr('fill', 'yellow')
          .attr('stroke', '#000')
          .attr('is-handle', 'true')
          .style('cursor', 'pointer');
    }
  }   

  closePolygon() {
    if (points.length == 0) return;
    svg = d3.select(this.node);
    svg.select('g.drawPoly').remove();
    var g = svg.append('g').attr('id', 'polyID' + polyID);

    var clonePoint = points.slice(0)
    // empty polyline 
    g.select('polyline').remove();
    g.append('polygon')
      .attr('points', clonePoint)
      .attr('fill', 'none')
      .attr('stroke', '#333');

    // remove blue drag line
    g.select('line').remove();

    for(var i = 0; i < clonePoint.length; i++) {
      g.selectAll('circles')
        .data([clonePoint[i]])
        .enter()
        .append('circle')
        .attr('cx', clonePoint[i][0])
        .attr('cy', clonePoint[i][1])
        .attr('r', 4)
        .attr('stroke', 'yellow')
        .attr('is-handle', 'true')
        .style('cursor', 'move')
        .call(dragger);
    }
    // points.splice(0);
    drawing = false;
    polyID += 1;
    points = []
  }

  handleDrag() {
    if(drawing) return;
    var newPoints = [], circle;
    dragging = true;
    var poly = svg.select("#polyID"+activeID).select('polygon');
    var circles = svg.select("#polyID"+activeID).selectAll('circle');

    svg.select("#polyID"+activeID).select('circle.active')
        .attr('cx', d3.event.x)
        .attr('cy', d3.event.y);
    for (var i = 0; i < circles._groups[0].length; i++) {
        circle = d3.select(circles._groups[0][i]);
        newPoints.push([circle.attr('cx'), circle.attr('cy')]);
    }
    poly.attr('points', newPoints);
    // points = newPoints;
  }

  exportJson() {
    var buildings = [];
    var groups = document.querySelectorAll('svg g');
    for (const g of groups) {
      buildings.push(g.querySelector('polygon').getAttribute('points') + "\t\n");
    }

    var data = {
      // degrees_from_north: this.state.json.RC_views[this.state.building].degrees_from_north,
      degrees_from_north: '12',
      img_file: selectedImage.name,
      buildings: buildings,
    }
    this.updateRCViews(data, this.state.building);
  }

  createPloygon() {
    if (!this.state.dirList || this.state.dirList.length == 0 || selectedImage == undefined) {
      return;
    }

    const node = this.node
    var self = this;
    
    fileName = '../test_dataset/' + selectedImage.path;
    width = selectedImage.width;
    height = selectedImage.height

    svg = d3.select(node);
    svg.selectAll("*").remove();

    svg.append('pattern')
        .attr('id', 'pic1')
        .attr('patternUnits', 'userSpaceOnUse')
        .attr('width', width)
        .attr('height', height)
        .append('svg:image')
        .attr('xlink:href', fileName)
        .attr("width", width)
        .attr("height", height)
        .attr("x", 0)
        .attr("y", 0);

      svg.append('rect')
        .attr("x", 0)
        .attr("y", 0)     
        .attr("height", height)
        .attr("width", width)
        .style("fill", "url(#pic1)")

        dragger = d3.drag()
          .on('start', function() {
            d3.select(this).raise().classed("active", true);
            activeID = d3.select(this.parentNode).attr('id').replace('polyID', '')
          })
          .on('drag', self.handleDrag)
          .on('end', function(){
              dragging = false;
              d3.select(this).classed("active", false);
          });

        svg.on('mousedown', function(){
              isStarted = true;
            });

        svg.on('mouseup', function(){
            if(dragging) return;
            if (!isStarted) return;

            drawing = true;
            startPoint = [d3.mouse(this)[0], d3.mouse(this)[1]];
            if(svg.select('g.drawPoly').empty()) {
              svg.append('g').attr('class', 'drawPoly').attr('id', 'polyID' + polyID);
            }
            points.push(d3.mouse(this));
            self.drawPolygon();
        });

        svg.on('mousemove', function() {
            if(!drawing) return;
            if (points.length == 0) return;
            var g = svg.select("#polyID"+polyID);
            g.select('line').remove();
            g.append('line')
              .attr('x1', startPoint[0])
              .attr('y1', startPoint[1])
              .attr('x2', d3.mouse(this)[0] + 2)
              .attr('y2', d3.mouse(this)[1])
              .attr('stroke', '#53DBF3')
              .attr('stroke-width', 1);
      })

      listener = document.addEventListener('keyup', function(e){
        if(e.keyCode == 13){ // enter
          self.closePolygon();
          self.exportJson();
        }
        if(e.keyCode == 27){ // esc
            if (points.length == 0) return;
            points.pop();
            if (points.length > 0) {
                startPoint = points[points.length-1];
            } else {
                startPoint = points[0];
            }
            svg.select('g.drawPoly').selectAll("*").remove();
            self.drawPolygon();
        }
      }, true);
 }

  render() {
    selectedImage = this.state.dirList[this.state.building];

    return (
        <div>
          <TopBar 
            dirList={this.state.dirList}  
            navigate={this.navigate} 
            json={this.state.json}
            activeStage={1} /> 

            {this.state.loading && <div>Loading ... </div>}
            {!this.state.loading && <div>
              <Card className="card">
                <CardContent>
                  <Typography className="card-title" color="textSecondary">
                    { this.state.dirList[this.state.building].name}
                  </Typography>

                  <TextField
                      required
                      id="degrees_from_north"
                      label="Degrees-From-North"
                      className="textField"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      placeholder="10"
                      value={this.state.json.degrees_from_north}
                      onChange={this.handleChange('degrees_from_north')}
                      margin="normal"
                    />
                </CardContent>
                <CardActions>
                  <Button onClick={() => this.saveData()} variant="contained" color="secondary" size="large">Save</Button>
                </CardActions>
              </Card>
          
              <svg className="working-board" ref={node => this.node = node}
                width={width} height={height}>
              </svg> 
            </div>}     
        </div>
    )
  }
}

RCViews.propTypes = {
    RC_views:PropTypes.array,
    json: PropTypes.object,
    navigate: PropTypes.func,
    drawPolygon:PropTypes.func,
    handleChange: PropTypes.func,
    saveData: PropTypes.func,
    updateRCViews: PropTypes.func,
}

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
)(RCViews));
