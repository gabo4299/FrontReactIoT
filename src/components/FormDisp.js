
import React  from 'react';
import axios from 'axios';
import cors from 'cors';
 import Switch from "react-switch";

import SocketIOClient from 'socket.io-client'
import io from 'socket.io-client'

import ipFunc from '../ipFunc.json';
import '../App.css';
import Axios from 'axios';

class FormDisp extends React.Component{

    constructor(e){
      
      super(e);
      
  this.state={
        Casa:undefined,
        IdDisp:undefined,
        tipo:"Rasp",
        Conf:false,IoT:0,CantPWM:0,CantLuz:0,
        P1:"",P2:"",P3:"",P4:"",P5:"",P6:"",P7:"",P8:"",P9:"",
        err1:0,err2:0,err3:0,
        Descripcion:undefined
  }  
  this.switchchange = this.switchchange.bind(this);

      
  }
  componentDidMount(){
    let linkCasa =ipFunc["ipapi"]+"/Casa/1"
    axios.get(linkCasa)
    .then (response =>
        {
            console.log("Casa");
            this.setState({
                Casa:response.data
             });
        })
     
  }
  switchchange(Conf) {
    // console.log(checked)
    this.setState({ Conf });
    
    if (Conf == true){
        this.setState({
            CantPWM:16,
            CantLuz:8
        })
    
    }
    else{
        this.setState({
            CantPWM:0,
            CantLuz:0
        })
    
    }

    
  }
  defIoT(e)
  {
      var val =e.target.value
      var nam = e.target.name
      if (val != this.state.P1 && val != this.state.P2 && val != this.state.P3 && val != this.state.P4 && val != this.state.P5 && val != this.state.P6 && val != this.state.P7 && val != this.state.P8 && val != this.state.P9  && val != this.state.P10  && val != this.state.P11 && val != 3 && val !=2)
      {
          console.log ("seteando el",e.target.name , " con el valor:",e.target.value )
          this.setState({
              [e.target.name]:e.target.value
  
            });
            if (  ( nam == "P1" || nam == "P2" || nam == "P3") ){
              this.setState({
                  err1:0
                });
          }
          if ((nam == "P4" || nam == "P5" || nam == "P6"|| nam == "P7" || nam == "L1") ){
              this.setState({
                  err2:0
                });
          }
          
          if ((nam == "P8" || nam == "P9" || nam == "P10"|| nam == "P11" || nam == "L2" )){
              this.setState({
                  err1:0
                });
          }
  
            
      }
      else 
      {
          if (this.state.P4=="" && this.state.P5==""  && this.state.P6 =="" && this.state.P7==""  && this.state.L1 =="" )
          {
              this.setState({
                  err2:0
                  
                });
          }
          if (this.state.P10=="" && this.state.P8==""  && this.state.P9 ==""&& this.state.P11==""  && this.state.L1 =="" )
          {
              this.setState({
                  err3:0
                  
                });
          }
          
          if (nam == "P1" || nam == "P2" || nam == "P3" ){
              this.setState({
                  err1:1, IoT:0
                  
                });
          }
          if (nam == "P4" || nam == "P5" || nam == "P6"|| nam == "P7" || nam == "L1" ){
              this.setState({
                  err2:1, IoT:0,[e.target.name]:""
                });
          }
          if (nam == "P10" || nam == "P8" || nam == "P9"|| nam == "P11" || nam == "L2" ){
              this.setState({
                  err1:1, IoT:0,[e.target.name]:""
                });
          }
  
      }
  
  }
  onChange(e){

    this.setState({
        [e.target.name]:e.target.value
    })
  }
  handleSubmit = event => {
    event.preventDefault();
    var IoTs = 0
    if (this.state.tipo == "Rasp"){
        if (this.state.err1 == 0 && this.state.err2==0 && this.state.err3 ==0 )
            {
                if (this.state.P1 != "" && this.state.P2 != "" && this.state.P3 !="")
                {
                  if (this.state.P4 != "" && this.state.P5 != "" && this.state.P6 !="" && this.state.P7 !="" && this.state.L1 !="")
                  {
                    if (this.state.P10 != "" && this.state.P8 != "" && this.state.P9 !="" && this.state.P11 != "" && this.state.PL2 != "")
                        {
                            
                          IoTs=[parseInt(this.state.P1),parseInt(this.state.P2),parseInt(this.state.P3),parseInt(this.state.P4),parseInt(this.state.P5),parseInt(this.state.P6),parseInt(this.state.P7),parseInt(this.state.L1),parseInt(this.state.P8),parseInt(this.state.P9),parseInt(this.state.P10),parseInt(this.state.P11),parseInt(this.state.L2)]
                            
                        }
                        else{
                        
                          IoTs=[parseInt(this.state.P1),parseInt(this.state.P2),parseInt(this.state.P3),parseInt(this.state.P4),parseInt(this.state.P5),parseInt(this.state.P6),parseInt(this.state.P7),parseInt(this.state.L1)]
                        
                        }
                    }
                    else{
                        
                        
                            IoTs=[ parseInt (this.state.P1), parseInt (this.state.P2), parseInt (this.state.P3)]
                        
                    }
                }
                else 
                {
                  alert ("eeror activo E1:",this.state.err1," E2:",this.state.err2," E3:",this.state.err3)
                    IoTs=0
                    
                }
            }
            var str="El modulo IoT es :" + IoTs +"Cantidade de pines :"+IoTs.length+ " y la cantidad de luces : "+this.state.CantLuz +" PWM: "+this.state.CantPWM
            if (window.confirm(str)){
                const Casa = {
                  IdCasa: 1,
                  IdRasp:this.state.IdDisp,
                  IoT:IoTs,
                  CantidadPWM:this.state.CantPWM,
                  CantidadLuz:this.state.CantLuz,
                  Descripcion:this.state.Descripcion
            
                };
                let config = {headers: {'Access-Control-Allow-Origin': "*"}};
                 let lin2=ipFunc["ipapi"]+"/CPU/Rasp/add";
                    
                      axios.post(lin2,  Casa , config)
                      .then(res => {
                        //console.log(res);
                        console.log(res.data);
                        alert(res.data);
                      })}
                      else {
                        alert ("Cambie los datos")
                    }
        }
        else {
            if (this.state.tipo == "Node"){
                const node = {
                IdCasa: 1,
                IdNode:this.state.IdDisp,
                Descripcion:this.state.Descripcion
                };
                let config = {headers: {'Access-Control-Allow-Origin': "*"}};
                let lin2=ipFunc["ipapi"]+"/CPU/Node/add";
                   
                     axios.post(lin2,  node , config)
                     .then(res => {
                       //console.log(res);
                       console.log(res.data);
                       alert(res.data);
                     })}
            else{
                if (this.state.tipo == "Esp32"){
                    const Esp32 = {
                    IdCasa: 1,
                    IdEsp32:this.state.IdDisp,
                    Descripcion:this.state.Descripcion
                    };
                    let config = {headers: {'Access-Control-Allow-Origin': "*"}};
                    let lin2=ipFunc["ipapi"]+"/CPU/Esp32/add";
                       
                         axios.post(lin2,  Esp32 , config)
                         .then(res => {
                           //console.log(res);
                           console.log(res.data);
                           alert(res.data);
                         })}
            }
        }
    
  
  
}

  render(){
    var E1;
    var E2;
    var E3;
    var IoTcomp;
   
      var Form;
      var imgs;
      var DivIoT;
      if (this.state.tipo=="Rasp")
      {
            imgs=<img src={process.env.PUBLIC_URL +"/Images/Rasp.png"} alt='Escudo' width='250'/>
       
     
            if (this.state.err1 == 1 ) { E1=<li style={{color:"red"}}>Error Pines Iguales Revisar porfavor</li>     }
            else     {        E1=<h1 style ={{display:"none"}}></h1>    }
            if (this.state.err2 == 1 )    {        E2=<li style={{color:"red"}}>Error Pines Iguales Revisar porfavor</li>    }
            else     {        E2=<h1 style ={{display:"none"}}></h1>     }
            if (this.state.err3 == 1 )    {        E3=<li style={{color:"red"}}>Error Pines Iguales Revisar porfavor</li>    }
            else     {        E3=<h1 style ={{display:"none"}}></h1>    }
            if (this.state.Conf == 0)
             {
                IoTcomp=<h4>Sin Modulo IoT</h4>
             }
             else{
                IoTcomp=<div className="row"> 
                <div className = "col">
                    <h3>Raspberry Central</h3>
        
                   <div className="row"> 
                   <div className ="col">
                     {/* <input  id="form2" placeholder="# Puertos de Salida IoT" type="text" value={this.CantLuz} name="CantLuz"  onChange={this.onChange.bind(this)}/> */}
                     <h6># Puertos de Salida IoT </h6>
                     <select   id="form2"  name="CantLuz"  value={this.state.CantLuz} onChange={this.onChange.bind(this)} >
                    <option name="CantLuz" value = "8">8</option>
        
                    <option name="CantLuz" value = "16">16</option>
                    <option name="CantLuz" value = "24">24</option>
                    <option name="CantLuz" value = "32">32</option>
                    <option name="CantLuz" value = "40">40</option>
                    <option name="CantLuz" value = "48">48</option>
                    </select>
                    </div>
                    <div className ="col">
                    
                        {/* <input  id="form2" placeholder="# Puertos de PWM IoT" type="text" value={this.CantPWM} name="CantPWM" onChange={this.onChange.bind(this)} /> */}
                        <h6># Puertos de PWM IoT</h6>
                        <select   id="form2"  name="CantPWM"  value={this.state.CantPWM} onChange={this.onChange.bind(this)} >            
                    <option name="CantPWM" value = "16">16</option>
                    <option name="CantPWM" value = "32">32</option>
                    <option name="CantPWM" value = "48">48</option>
                    </select>
                    </div>
                    </div>
                    <div className="col">
                            <h4>Pines IoT</h4> <h5>minimamente elegir 3  a excepcion del pin 2 y 3 </h5>
                    </div>
                    <div className="col" style={{fontSize:"19px"}}>

                            <input id="formIoT"   min="0" placeholder="Pin 1  IoT" type="number" value={this.P1} name="P1" onChange={this.defIoT.bind(this)} />
                            <input id="formIoT"   min="0" placeholder="Pin 2  IoT" type="number" value={this.P2} name="P2" onChange={this.defIoT.bind(this)} />
                            <input id="formIoT"   min="0" placeholder="Pin 3  IoT" type="number" value={this.P3} name="P3" onChange={this.defIoT.bind(this)} />
                            {E1}
                            </div>
                     <div className="col" style={{fontSize:"19px"}}>   
                            <input id="formIoT" min="0" placeholder="Pin 4  IoT" type="number" value={this.P4} name="P4" onChange={this.defIoT.bind(this)} />
                            <input id="formIoT" min="0" placeholder="Pin 5  IoT" type="number" value={this.P5} name="P5" onChange={this.defIoT.bind(this)} />
                            <input id="formIoT" min="0" placeholder="Pin 6  IoT" type="number" value={this.P6} name="P6" onChange={this.defIoT.bind(this)} />
                            <input id="formIoT" min="0" placeholder="Pin 7  IoT" type="number" value={this.P7} name="P7" onChange={this.defIoT.bind(this)} />
                            <input id="formIoT" min="0" placeholder="Lec 1 IoT" type="number" value={this.L1} name="L1" onChange={this.defIoT.bind(this)} />
                            {E2}</div>
                     <div className="col" style={{fontSize:"19px"}}>   
                            <input id="formIoT" min="0" placeholder="Pin 8  IoT" type="number" value={this.P8} name="P8" onChange={this.defIoT.bind(this)} />
                            <input id="formIoT" min="0" placeholder="Pin 9  IoT" type="number" value={this.P9} name="P9" onChange={this.defIoT.bind(this)} />
                            <input id="formIoT" min="0" placeholder="Pin 10 IoT" type="number" value={this.P10} name="P10" onChange={this.defIoT.bind(this)} />
                            <input id="formIoT" min="0" placeholder="Pin 11 IoT" type="number" value={this.P11} name="P11" onChange={this.defIoT.bind(this)} />
                            <input id="formIoT" min="0" placeholder="Lec 2 IoT" type="number" value={this.L2} name="L2" onChange={this.defIoT.bind(this)} />
                            {E3}</div>
                </div>
                </div>
            }
            DivIoT= <div className ="App" style={{color:"black"}}> <label> IoT <Switch onChange={this.switchchange}  checked={this.state.Conf} /></label> {IoTcomp}  </div>
      }
      if (this.state.tipo=="Node")
      {
        imgs=<img src={process.env.PUBLIC_URL + "/Images/Node.jpg"} alt='Escudo' width='350'/>
        DivIoT= <div></div>
      }
      if (this.state.tipo=="Esp32")
      {
        imgs=<img src={process.env.PUBLIC_URL + "/Images/Esp32.jpg"} alt='Escudo' width='450'/>
        DivIoT= <div></div>
      }
      Form =   <header className="App-header">
        
      {imgs}
      
        <form onSubmit={this.handleSubmit} className="Formulario2" encType = "multipart/form-data">
         <div >
         <h2>
          Formulario Cuarto
        </h2>
            <div id = "separador">
            <select  id = "form" value={this.state.tipo} name="tipo" onChange={this.onChange.bind(this)} >
                <option value ="Rasp">Raspberry</option>
                <option value ="Node">Node MCU</option>
                <option value ="Esp32">Esp32</option>

            </select></div>
           <input  id = "form" placeholder="Id Dispotivo" type="text" value={this.state.IdDisp} name="IdDisp" onChange={this.onChange.bind(this)} />
           <div id= "separador">
           
           <input  id = "form" placeholder="Descripcion de Dispositvo  " type="text" value={this.state.Descripcion} name="Descripcion" onChange={this.onChange.bind(this)} />
           </div>
           </div>           
            
             
            <input className="button" type="submit" value="Submit" className="button" onChange={this.onChange}/>
            
            {DivIoT}
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

export default FormDisp;