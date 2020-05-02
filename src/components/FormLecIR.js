import React  from 'react';
import axios from 'axios';
import cors from 'cors';
 

import SocketIOClient from 'socket.io-client'
import io from 'socket.io-client'

import ipFunc from '../ipFunc.json';
import '../App.css';
import Axios from 'axios';

class FormLecIR extends React.Component{

    constructor(e){
      
      super(e);
      
  this.state={
        Casa:undefined,
        IdDisp:undefined,
        IDsDisponibles:undefined,
        Dispositivo:"Rasp",
        Pin:undefined,
        PinesSLibres:undefined,
  }  
  

      
  }
  componentDidMount(){
    let linkCasa =ipFunc["ipapi"]+"/Casa/1"
    axios.get(linkCasa)
    .then (response =>
        {
            console.log("casa:",response.data)
            this.setState({
                Casa:response.data
             });
        })

    let linkDisp =ipFunc["ipapi"]+"/CPU/Rasps"
    axios.get(linkDisp)
    .then (response =>
        {
            console.log( "ids rasps",response.data.IdRasp)
            this.setState({
                IDsDisponibles:response.data.IdRasp
             });
        })

     
  }

  onChange(e){
       let  val = e.target.value
    if (e.target.name == "Dispositivo")
   {
       
        let linkDisp =ipFunc["ipapi"]+"/CPU/"+e.target.value+"s"
        axios.get(linkDisp)
            .then (response =>
            {
                if (response.data != "No se registraron")
                {
                    if (val=="Rasp")
                {
                    this.setState({
                        IDsDisponibles:response.data.IdRasp
                     });
                }
                if (val=="Node")
                {
                    this.setState({
                        IDsDisponibles:response.data.IdNode
                     });
                }
                if (val=="Esp32")
                {
                    this.setState({
                        IDsDisponibles:response.data.IdEsp32
                     });
                }
                    
                }
                else
                {
                    var s="No se registraron"
                    this.setState({
                        IDsDisponibles:[s],
                        PinesSLibres:undefined
                     });
                }
        
            })
            this.setState({
                [e.target.name]:e.target.value
            })
        
                 
   } 
   if (e.target.name == "Pin"){
        
        
        
        
            // console.log("entrasste con el pin con valor ",e.target.value)
            this.setState({
                [e.target.name]:e.target.value
            })
        
   }


     }

  onChangeid(e)
  {
      if( e.target.value != "No se registraron")
      {
        if (e.target.value == "")
        {
            this.setState({
                PinesSLibres:undefined,
                [e.target.name]:e.target.value
            })
        }
        else{
        this.setState({
            [e.target.name]:e.target.value
        })
        let linkPins=ipFunc["ipapi"]+"/CPU/"+this.state.Dispositivo+"/"+e.target.value+"/PinFree/LecIR"
        axios.get(linkPins)
        .then (response => {
            
            if (response.data != "no existe id")
            {
                console.log("Entro a qui lptm response : ",response.data)
                this.setState({
                    PinesSLibres:response.data
                })

            }
        })}
      }
    
  }
  handleSubmit = event => {
    event.preventDefault()
    if (this.state.Pin !=undefined && this.state.Pin !=""){
    let linklecIR=ipFunc["ipapi"]+"/LecIR/add"
    const data={
        IdDisp:this.state.IdDisp,
        IdCasa:this.state.Casa.IdCasa,
        Dispositivo:this.state.Dispositivo,
        Pin:this.state.Pin
    }
    axios.post(linklecIR,data)
     .then(response=>{
         alert(response.data)
         
     })
    }    
    else{
        alert ("No Agregado")
    }
  
}

  render(){
    
    const { IDsDisponibles } = this.state;
    const {PinesSLibres}= this.state;
      var Form;
      var imgs;
      
      if (this.state.Dispositivo=="Rasp")
      {
            imgs=<img src={process.env.PUBLIC_URL +"/Images/Rasp.png"} alt='Rasp' width='250'/>
       
     
      }
      if (this.state.Dispositivo=="Node")
      {
        imgs=<img src={process.env.PUBLIC_URL + "/Images/Node.jpg"} alt='Node' width='280'/>
        
      }
      if (this.state.Dispositivo=="Esp32")
      {
        imgs=<img src={process.env.PUBLIC_URL + "/Images/Esp32.png"} alt='Esp32' width='380'/>
        
      }
      Form =   <header className="App-header">
        
      
      
        <form onSubmit={this.handleSubmit} className="FormularioLecIr" encType = "multipart/form-data">
         <div >
         <h2>
          Formulario Lector IR
        </h2>
        <img src={process.env.PUBLIC_URL + "/Images/Lector.jpg"}  width='350'/>
            <div id = "separador">
            <select  id = "form" value={this.state.Dispositivo} name="Dispositivo" onChange={this.onChange.bind(this)} >
                <option value ="Rasp">Raspberry</option>
                <option value ="Node">Node MCU</option>
                <option value ="Esp32">Esp32</option>

            </select></div>
            <div className ="container">
                <div className= "row"> 
                <div className="col-md-auto">  {imgs}</div>
            <div className="col-4">
                    <div className = "row">
                        

                        
                        <select   id="form"  name="IdDisp"  value={this.state.IdDisp} onChange={this.onChangeid.bind(this)} >
                            <option name="IdDisp" value = ''>Id Dispositivo</option>
                        {
                    IDsDisponibles && IDsDisponibles.length && IDsDisponibles.map((p,index) => {
                        return (<option key={index} name="IdDisp"  value={p}  onChange={this.onChangeid.bind(this)} >{p}</option>)
                        })
                        }
          
                        </select>


                    </div>
                    <div id="separador"></div>
                    <div className = "row">
                        {this.state.PinesSLibres == undefined && <h3 style={{color:"red"}}>Error de Dispositivo</h3>
                        
                        }
                        {this.state.PinesSLibres != undefined && 
                        
                    
                         <select  id = "form" value={this.state.Pin} name="Pin" onChange={this.onChange.bind(this)} >
                             
                                <option value ="" name = "Pin">Eliga el pin a usar en {this.state.Dispositivo}</option>

                                
                                {
                                PinesSLibres && PinesSLibres.length && PinesSLibres.map((p,index) => {
                        return (<option key={index} name="Pin"  value={p}  onChange={this.onChange.bind(this)} >{p}</option>)
                        })
                        }

                         </select>
                         }
                    </div>
                </div>
           
            </div>
           </div>           
           </div>
             
            <input className="button" type="submit" value="Submit" className="button" onChange={this.onChange}/>
            
          </form>

          
      </header>

      return(
          
          <div className ="App">
              <nav className="navbar navbar-dark bg-dark"> 
        
                               
        <div style={{ fontSize:" calc(10px + 2vmin)", color: "white"}}>
        <a href="/main"><button type="button" className="btn btn-dark">Home </button></a>
        
         </div>
        
        <img  className="Logo" src={process.env.PUBLIC_URL + '/Images/Escudo.png'} alt='Escudo' width='60'/>
</nav>
         {this.state.Casa == "No Existe Casa" && <div ><h1 style ={{color:"red"}}> No Existe Casa Configurar Casa</h1>
                <a href ="/main"><h2>Regresar a CASA</h2></a> </div>}
                {this.state.Casa != "No Existe Casa" && <div>
                {Form}</div>}

          </div>
      )
  }
}

export default FormLecIR;