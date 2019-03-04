import React, { Component } from 'react';
import logo from '../../logo.svg';
import './style.scss';
import axios from 'axios';

class VideoMiniatura extends Component {
  constructor(props){
    super(props);
    this.state = {
      active:false
    };
  }
  render(){
    let style = {
      backgroundImage:`url('/uploads/${this.props.name}.jpg')`,
    };
    return (
      <div className="video-mini">
        <div className="play" style={style} onClick={()=>this.props.play(this.props.name)}>
          <i className="far fa-play-circle fa-null"></i>
        </div>
        <div className="video-options">
          <div className="views">
            <span>{this.props.view}<i className="fas fa-eye"></i></span>
          </div>
        </div>
      </div>
    );
  }
}
 export default VideoMiniatura;
