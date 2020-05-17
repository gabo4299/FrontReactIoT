
import React     from 'react';
import axios from 'axios';

import ipFunc from '../ipFunc.json';



import '../App.css';
//import { CLIENT_RENEG_LIMIT } from 'tls';
//import { Socket } from 'dgram';


class Prueba extends React.Component{

    constructor(props) {
        super(props)
        console.log(ipFunc["ip"])
        this.t = undefined
        // this.start = 100
         this.repeat = this.repeat.bind(this)
        // this.onMouseDown = this.onMouseDown.bind(this)
        // this.onMouseUp = this.onMouseUp.bind(this)
        this.state={fondo:undefined}
      }
    
      repeat() {
        
        this.t = setTimeout(this.repeat,300)
        // this.start = this.start / 10
        console.log("repitiendo")
      }
   
      onMouseDown() {
        this.repeat()
      }
      onMouseUp() {
        clearTimeout(this.t)
        // this.start = 100
      }
      enviar(e){
          console.log(this.state.fondo)
        let config = {headers: {'Content-Type': 'multipart/form-data' }};
        const c =new FormData()
        c.append('fondo',this.state.fondo);

        axios.post('http://localhost:5000/API/Cuarto/add', c  , config)
          .then(res => {
            //console.log(res);
            console.log(res.data);
            alert(res.data);
          })

      }
      setear(e){
          this.setState({
              fondo:e.target.files[0]
          }) 
      }
    render(){
        return (
            <div className='App'>
                
                <header className="App-header">
           
 
                <img src={process.env.PUBLIC_URL + '/Images/Escudo.png'} alt='Escudo' width='400'/>
                    <h1 id="t"> Este va ser un como una constante </h1>
                    {/* <div>
                                            
                        
                        <button id='miBoton'  class='btn btn-primary'   onMouseDown={this.z.bind(this)} onMouseUp={this.h.bind(this)}> hola </button>
                    </div> */}
<div className="zoomControl" >
     
      <button className="zoomIn" onMouseUp={this.onMouseUp.bind(this)} onMouseDown={this.onMouseDown.bind(this)}>+</button>
      
    </div>


                <div  style={{justifyContent:"center"}}>
           <form action = "http://localhost:5000/API/Uploader" method = "POST" 
                encType = "multipart/form-data">
         <input type = "file" name = "fondo"  onChange={this.setear.bind(this)}/>
         <input type="text" name='Nombre'></input>
         <input type = "submit"/>
      </form>
      
      </div>   
      <div>
          <button onClick={this.enviar.bind(this)}>
              on
          </button>
      </div>
                </header>
            </div>
        );
    
                    }
    }
    export default Prueba