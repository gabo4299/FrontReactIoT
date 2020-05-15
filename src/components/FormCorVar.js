import React  from 'react';
import axios from 'axios';
import cors from 'cors';
import ipFunc from "../ipFunc.json"


import '../App.css';

class FormCorVar extends React.Component {
constructor(e){
    super(e);
    this.state = {
        Pinmotor: '',
        PinSen1: '',
        PinSen2: '',
        Tipo:'',
        IdCuarto:this.props.match.params.date,
        Cuartos:undefined,
        linkcuarto:'',
        NombreCuarto:'',
        Nombre:'',   
        Dispositivo:"Rasp",
        IdDisp:undefined,
        PinesSLibres:undefined,
        PinsSenLibres:undefined,
        IDsDisponibles:undefined,

      }
}


componentDidMount() {
    let linkcuarto="/cuarto/"+this.props.match.params.date
    this.setState({linkcuarto})
    let Cuartos=[];
    const axx=[];
    
    let linget=ipFunc["ipapi"]+"/Cuarto/"+this.props.match.params.date
    axios.get(linget)
    .then(response => {
      this.setState({NombreCuarto:response.data.nombre})
    })

    axios.get(ipFunc["ipapi"]+"/Cuartos")
      .then(response => {
  
         const  a=JSON.stringify(response.data);
        //   console.log(response.data);
          axx.au=response.data;
         const b=JSON.stringify(axx.au.idcuarto);
          
         for (let i = 1; i < b.length; i=i+2) {
           Cuartos.push({idcuarto:parseInt((JSON.stringify(axx.au.idcuarto))[i])});
         }
         this.setState({ Cuartos });
      });

      let linkDisp =ipFunc["ipapi"]+"/CPU/Rasps"
        axios.get(linkDisp)
        .then (response =>
            {
            
                this.setState({
                    IDsDisponibles:response.data.IdRasp
                  });
            })
  }
    
 
  onChange(e){
    let  val = e.target.value
    let  nam = e.target.name
    let linkDisp
 if (e.target.name == "Dispositivo")
{
    if (val ="IoT"){
       linkDisp =ipFunc["ipapi"]+"/CPU/Rasps"
      val="Rasp"
    }
    else{
       linkDisp =ipFunc["ipapi"]+"/CPU/"+e.target.value+"s"
    }
     
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
if (e.target.name == "Pinmotor" ||e.target.name == "Nombre"||e.target.name == "Marca"||e.target.name == "NewMarca" ||e.target.name == "PinSen1"||e.target.name == "PinSen2"||e.target.name == "Tipo" ){
         if ((nam == "PinSen1" && (val!= this.state.PinSen2))  || (nam == "PinSen2" && (val!= this.state.PinSen1)) || nam!="PinSen1"|| nam!="PinSen2"|| nam=="Nombre")
         {
           console.log("el name es ",e.target.name,"el valor",val)
          this.setState({ 
            [e.target.name]:e.target.value
        })
         }
         
         
         else{
           alert ("pines de sensores iguales")
         }
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
        let linkPins=ipFunc["ipapi"]+"/CPU/"+this.state.Dispositivo+"/"+e.target.value+"/PinFree/PWM"
        axios.get(linkPins)
        .then (response => {
            
            if (response.data != "no existe id")
            {
                console.log("Entro a qui lptm response : ",response.data)
                this.setState({
                    PinesSLibres:response.data
                })

            }
        })
        let linkPinsen=ipFunc["ipapi"]+"/CPU/"+this.state.Dispositivo+"/"+e.target.value+"/PinFree/Sen"
        axios.get(linkPinsen)
        .then (response => {
            
            if (response.data != "no existe id")
            {
                // console.log("Entro a qui lptm response : ",response.data)
                this.setState({
                  PinsSenLibres:response.data
                })

            }
        })
        
      }
      }
    
  }

    
    
    
      handleSubmit = event => {
        event.preventDefault();
    
        const cor = {
          Pinmotor: this.state.Pinmotor,
          PinSensor1: this.state.PinSen1,
          PinSensor2: this.state.PinSen2,
          Tipo:this.state.Tipo,
          IdCuarto:this.state.IdCuarto,
          Nombre:this.state.Nombre,
          Dispositivo:this.state.Dispositivo,
          IdDisp:this.state.IdDisp,
    
        };
    
        //AYUDA CON EL LUGAR DODNE SE PONDRA EL INTERRUPTOR 
        if (cor.Pinmotor == "" || cor.PinSensor1 == "" || cor.PinSensor2 == ""   || cor.PinSensor2==cor.PinSensor1 )
        {
          
          alert("error de pines revisar porfavor")
        }
        else
        {
          // console.log(cor)
        let config = {headers: {'Access-Control-Allow-Origin': "*"}};
        let lin=ipFunc["ipapi"]+"/Cuarto/";
        lin=lin+cor.IdCuarto+"/Cortina/add";
        
        axios.post(lin,  cor , config)
          .then(res => {
            
            console.log(res.data);
            alert(res.data);
          })
        }
      }
render(){
  var Form;
  const { IDsDisponibles } = this.state;
const {PinesSLibres}= this.state;
const {PinsSenLibres}= this.state;
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
Form=<div>
    <div id = "separador">
       <b style={{color:"#7A7270"}}>Dispositivo:</b> <select  id = "form" value={this.state.Dispositivo} name="Dispositivo" onChange={this.onChange.bind(this)} >
            <option value ="Rasp">Raspberry</option>
            <option value ="Node">Node MCU</option>
            <option value ="Esp32">Esp32</option>
           <option value ="IoT">IoT</option>}

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
                    {this.state.PinesSLibres != undefined  && 
                    
                
                     <div className = "col">
                       <label style={{color:"#7A7270",fontSize:"15px"}}>Pin de motor</label>
                         <select  id = "form" value={this.state.Pinmotor} name="Pinmotor" onChange={this.onChange.bind(this)} >
                         
                            <option value ="" name = "Pinmotor">Eliga el pin de motor a usar en {this.state.Dispositivo}</option>

                            
                            {
                            PinesSLibres && PinesSLibres.length && PinesSLibres.map((p,index) => {
                    return (<option key={index} name="Pinmotor"  value={p}  onChange={this.onChange.bind(this)} >{p}</option>)
                    })
                    }

                     </select>

                     <label style={{color:"#7A7270",fontSize:"15px"}}>Pin Sensor 1</label>
                         <select  id = "form" value={this.state.PinSen1} name="PinSen1" onChange={this.onChange.bind(this)} >
                         
                            <option value ="" name = "PinSen1">Eliga el pin sensor1 a usar en {this.state.Dispositivo}</option>

                            
                            {
                            PinsSenLibres && PinsSenLibres.length && PinsSenLibres.map((p,index) => {
                              if (this.state.Dispositivo == "IoT"){
                                if (index <(PinsSenLibres.length/2) ){
                                  return (<option key={index} name="PinSen2"  value={p}  onChange={this.onChange.bind(this)} >{p}</option>)
                                }
                            }
                            else{
                              return (<option key={index} name="PinSen2"  value={p}  onChange={this.onChange.bind(this)} >{p}</option>)
                            }
                    })
                    }

                     </select>
                     <label style={{color:"#7A7270",fontSize:"15px"}}>Pin Sensor 2</label>
                         <select  id = "form" value={this.state.PinSen2} name="PinSen2" onChange={this.onChange.bind(this)} >
                         
                            <option value ="" name = "PinSen2">Eliga el pin  sensor2 a usar en {this.state.Dispositivo}</option>

                            
                            {
                            PinsSenLibres && PinsSenLibres.length && PinsSenLibres.map((p,index) => {
                              if (this.state.Dispositivo == "IoT"){
                                  if (index >=(PinsSenLibres.length/2) ){
                                    return (<option key={index} name="PinSen2"  value={p}  onChange={this.onChange.bind(this)} >{p}</option>)
                                  }
                              }
                              else{
                                return (<option key={index} name="PinSen2"  value={p}  onChange={this.onChange.bind(this)} >{p}</option>)
                              }
                    
                    })
                    }

                     </select>
                     
                    
                     
                     </div>
                     }
                </div>
            </div>
       
        </div>
       </div>  
  </div>
    return (
      <div className="App">
        <nav className="navbar navbar-dark bg-dark"> 
            <div className="dropdown">
               
                <div className="dropdown-menu" id="bg-dark" aria-labelledby="dropdownMenuButton">
                    <div className="bg-dark p-4">
                        <h4 className="text-white">Agregar Disp</h4>
                            
                       <a href="/form"> <button type="button" className="btn btn-light">Agregar Cuarto</button>  </a>
                         <a href="/formInt">   <button type="button" className="btn btn-dark"   id="T">Agregar Luz</button></a>
                            <a href="/formCor"> <button type="button" className="btn btn-light"  id="T">Agregar Cortina</button>  </a>
                    </div>
                </div>
                 
                 <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        
                            <span className="navbar-toggler-icon"></span>
                               </button>

                               </div>
                               
                               <div style={{ fontSize:" calc(10px + 2vmin)", color: "white"}}>
                               <a href="/main"><button type="button" className="btn btn-dark">Home </button></a>
                               <a href={this.state.linkcuarto}><button type="button" className="btn btn-dark">Regresar A Cuarto {this.state.NombreCuarto}</button></a>
                                </div>
                               
                               <img  className="Logo" src={process.env.PUBLIC_URL + '/Images/Escudo.png'} alt='Escudo' width='60'/>
                 </nav>
      <header className="App-header">
        
      <img src={process.env.PUBLIC_URL + '/Images/Escudo.png'} alt='Escudo' width='400'/>

        <form onSubmit={this.handleSubmit} className="Formulario3">
        <h2>
          Formulario Cortina
        </h2>
         
           <div id="separador">
           <input id="form" placeholder="Nombre"  type="text" name="Nombre"   value={this.state.Nombre} onChange={this.onChange.bind(this)}/>
           </div>
           
           <div id="separador">
           <select   id="form"  name="Tipo"  value={this.state.Tipo} onChange={this.onChange.bind(this)} >
           <option name="Tipo" value = ''>Tipo</option>
           <option name="Tipo" value = 'Roler'>Roller</option>
           <option name="Tipo" value = 'Persiana'>Persiana</option>
           </select>
            {Form}

           
           </div>
             <div id="separador">
            <input className="button" type="submit" value="Submit"  className="button" onChange={this.onChange}/>
            </div>
          </form>
      </header>
    </div>


    );

}
}

export default FormCorVar