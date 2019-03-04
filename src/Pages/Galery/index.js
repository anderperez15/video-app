import React, { Component } from 'react';

import NavBar from '../../Components/NavBar';
import VideoMiniatura from '../../Components/VideoMiniatura';
import VideoReproductor from '../../Components/VideoReproductor';
import axios from 'axios';
import Loader from 'react-loader-spinner'
import { MDBBtn } from 'mdbreact';

import './style.scss';

class Galery extends Component {
  constructor(props){
    super(props);
    this.state = {
      active:false,
      data:null,
      list:null,
      btn:false,
      loader:false
    };
    this.play = this.play.bind(this);
    this.closet = this.closet.bind(this);
  }

  componentWillMount(){
    axios.get('/videos/0').then(resp=>{
      let active = resp.data.list.length === 12;
      this.setState({list:resp.data.list, btn:active});
    })
  };

  play(name){
    let url = `/uploads/${name}.mp4`;
    axios.get(`/view/${name}`);
    let list = this.state.list.map(item => {
      if(item[1] === name){
        item[2] = item[2] + 1;
        return item;
      }
      return item;
    });

    this.setState({list:list});

    let data = {
      autoplay: true,
      controls: true,
      sources: [{
        src: url,
        type: 'video/mp4'
      }]
    }
    this.setState({active:true,data:data});
  }

  moreVideo(n){
    this.setState({btn:false, loader:true})
    axios.get(`/videos/${n}`).then(resp=>{
      let active = resp.data.list.length === 12;
      this.setState({loader:false});
      let list = this.state.list.concat(resp.data.list);
      this.setState({list:list,btn:active})
    });
  }
  closet(){
    this.setState({active:false,data:null});
  }
  render(){
    let reproductor = this.state.active?<VideoReproductor closet={this.closet} {...this.state.data}/>:null;
    return (
        <div>
          <NavBar active={true} />
          <div className='container'>
          <h4 className="h4-responsive title-type-one">Videos recientes:</h4>
            <div className="list-video">
              {
                this.state.list?
                (
                  this.state.list.map((video,index) => {
                    return (
                      <VideoMiniatura
                        index={index}
                        id={video[0]}
                        name={video[1]} 
                        view={video[2]}
                        play={this.play}
                        update={this.update}
                      />
                    )
                  })
                ):(
                  <Loader type="Puff" color="blue" height={80} width={80} />
                )
              }
            </div>
            <div style={{display:'flex',justifyContent:'center',}}>
              {
                this.state.loader?
                (<Loader type="Puff" color="blue" height={80} width={80} />):
                null
              }
              <MDBBtn onClick={()=>this.moreVideo(this.state.list.length)} style={{display:`${this.state.btn?'':'none'}`}}>
                ver mas
              </MDBBtn>
            </div>
            {reproductor}
          </div>
        </div>
    );
  }
}

export default Galery;