import React, { Component } from 'react';

import NavBar from '../../Components/NavBar';
import { MDBBtn, MDBCard, MDBCardBody, MDBCardImage, MDBCardTitle } from 'mdbreact';

import './style.scss';
import img from './logo.png';
import createNotification from '../../notifications';
import VideoReproductor from '../../Components/VideoReproductor';
import axios from 'axios';
import Loader from 'react-loader-spinner'


class Editor extends Component {
  constructor(props){
    super(props);
    this.state = {
      active:false,
      data:null,
      video: null,
      filter: 1,
      name:'Arrastre un video o haga click aqui.',
      btn:false,
      loader:false
    }

    this.filtro = this.filtro.bind(this);
    this.changeVideo = this.changeVideo.bind(this);
    this.upload = this.upload.bind(this);
    this.play = this.play.bind(this);
    this.closet = this .closet.bind(this);
  }

  closet(){
    this.setState({active:false,data:null});
    this.setState({name:'Arrastre un video o haga click aqui.',btn:false, video:null});
  }

  play(name){
    let url = `/uploads/${name}.mp4`;

    let data = {
      autoplay: true,
      controls: true,
      sources: [{
        src: url,
        type: 'video/mp4'
      }]
    }
    this.setState({active:true,data:data});
  };

  filtro(n){
    this.setState({filter:n});
  }

  changeVideo(e){
    let file = e.target.files[0];
    let format = ['video/mp4','video/3gp','video/mpeg','video/x-matroska']
    console.log(file);
    if(format.some(formato => formato === file.type)){
      if(file.size <= 12000000){
        this.setState({name:file.name, btn:true,video:file});
      } else {
        createNotification('warning',{content:'Con un tamaño maximo de 10MB.',title:'El video debe de ser corto.'})();
        this.setState({name:'Arrastre un video o haga click aqui.',btn:false, video:null})
      }

    } else {
      console.log(file.type)
      createNotification('warning',{content:'Es posible que este no sea un archivo con formato de video.',title:'Formato no valido.'})();
      this.setState({name:'Arrastre un video o haga click aqui.',btn:false, video:null})
    }
  }

  upload(){
    let config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    };

    let formData = new FormData();
    this.setState({loader:true});
    formData.append('file',this.state.video);
    axios.post(`/upload/${this.state.filter}`, formData,config).then(resp=>{
      this.setState({loader:false});
      this.play(resp.data.name);
    })
  }
  render(){
    let active = {
      1:this.state.filter===1?'en uso':'usar',
      2:this.state.filter===2?'en uso':'usar',
      3:this.state.filter===3?'en uso':'usar'
    }

    let style = {
      backgroundImage:`url(${img})`
    };
    let loader = this.state.loader?(
      <div style={{position:"fixed",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",top:"0",left:"0",width:"100vw",height:"100vh",backgroundColor:"#000000e0"}}>
        <Loader type="Puff" color="blue" height={80} width={80} />
        <div style={{color:"white",fontSize:"10px"}}>Esto puede llevar de 1 a 2 minutos, por favor espere!</div>
      </div>
    ):null;
    let reproductor = this.state.active?<VideoReproductor closet={this.closet} {...this.state.data}/>:null;

    return (
        <div>
          <NavBar active={false} />
          <div className='container'>
            <div className="editor">
              <h4 className="h4-responsive title-type-one">Efectos:</h4>
              <div className="d-flex justify-content-center justify-content-md-between flex-wrap">
                <MDBCard  className="card-option" style={{ margin:'10px' }}>
                  <MDBCardImage className="img-fluid" src="/papel.jpg" waves />
                  <MDBCardBody>
                    <MDBCardTitle>Confeti cayendo</MDBCardTitle>
                    <MDBBtn onClick={()=>this.filtro(1)} className={`${this.state.filter===1?'':'btn-outline-default'}`}>
                      {active[1]}
                    </MDBBtn>
                  </MDBCardBody>
                </MDBCard>
                <MDBCard  className="card-option" style={{ margin:'10px' }}>
                  <MDBCardImage className="img-fluid" src="/nieve.jpg" waves />
                  <MDBCardBody>
                    <MDBCardTitle>Nieve cayendo</MDBCardTitle>
                    <MDBBtn onClick={()=>this.filtro(2)} className={`${this.state.filter===2?'':'btn-outline-default'}`}>
                      {active[2]}
                    </MDBBtn>
                  </MDBCardBody>
                </MDBCard>
                <MDBCard  className="card-option" style={{ margin:'10px' }}>
                  <MDBCardImage className="img-fluid" src="/lluvia.jpg" waves />
                  <MDBCardBody>
                    <MDBCardTitle>Lluvia cayendo</MDBCardTitle>
                    <MDBBtn onClick={()=>this.filtro(3)} className={`${this.state.filter===3?'':'btn-outline-default'}`}>
                      {active[3]}
                    </MDBBtn>
                  </MDBCardBody>
                </MDBCard>
              </div>
              <h4 className="h4-responsive title-type-one" style={{marginTop:'10px', marginBottom:'20px'}}>Cargue su video:</h4>
              <div className="procesar">
                <div className="container-logo">
                  <div className="logo" style={style}>
                    <input id="file" type="file" name="files[]" onChange={this.changeVideo}/>
                    <p id="message-file">{this.state.name}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <MDBBtn onClick={this.upload} style={{position:'fixed', right:'10px', bottom:'10px',display:`${this.state.btn?'':'none'}`}}>
              procesar
          </MDBBtn>
          {loader}
          {reproductor}
        </div>
    );
  }
}

export default Editor;
