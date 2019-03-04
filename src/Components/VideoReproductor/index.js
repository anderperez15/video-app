import React, { Component } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';


import './style.scss';

class VideoReproductor extends Component {
	constructor(props){
		super(props)

	}
	componentWillMount() {
    	document.addEventListener("keydown", this.onKeyPressed.bind(this));
  	}
	componentDidMount() {
	    // instantiate Video.js
	    this.player = videojs(this.videoNode, this.props, function onPlayerReady() {
	    	console.log('onPlayerReady', this)
	    });
	}
	// destroy player on unmount
	componentWillUnmount() {
		document.removeEventListener("keydown", this.onKeyPressed.bind(this));
    	if (this.player) {
    		this.player.dispose()
    	}
  	}

  	download(url){
  		window.open(url, '_blank');
  	}
	
	onKeyPressed(e) {
    	if(e.key === 'Escape'){
    		this.props.closet();
    	};
	}


	render(){
		return (
			<div onKeyDown={(e) => this.onKeyPressed(e)}>
				<div className='reproductor' onKeyPress={this.handleKeyPress}>
					<div data-vjs-player className='video-reproductor'>
	          			<video ref={ node => this.videoNode = node } className="video-js"></video>
					</div>
				</div>
				<i onClick={this.props.closet} className="fas fa-times" style={{fontSize:'25px',position:'fixed',top:0,right:0, color:'white',padding:'15px', cursor:'pointer'}}></i>
				<i onClick={()=>this.download(this.props.sources[0].src)} className="fas fa-download" style={{fontSize:'30px',position:'fixed',bottom:0,right:0, color:'white',padding:'15px', cursor:'pointer'}}></i>
			</div>
		);
	}
}

export default VideoReproductor;