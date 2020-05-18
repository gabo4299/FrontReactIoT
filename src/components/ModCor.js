import React  from 'react';
import axios from 'axios';


import ipFunc from '../ipFunc.json'

import '../App.css';
/* eslint-disable */
class ModCor extends React.Component {
    constructor (e){
        super(e);
    
    
        this.state = {
            idCortina:this.props.match.params.date2 ,
            IdCuarto: this.props.match.params.date,
            Pinmotor: '',
            PinSensor1: '',
            PinSensor2: '',
            Tipo:'',
            Nombre:'',
            Existe:true,
            NombreCuarto:" ",
            linkcuarto:"",
            Cortina:undefined,
            PinLibreMotor:undefined,
            PinLibreSen1:undefined,
          };
          
    
        }
    componentDidMount() {
           
        let linget=ipFunc["ipapi"]+"/Cuarto/"+this.props.match.params.date
        let Cortina = undefined
        axios.get(linget)
        .then(response => {
            console.log("este es el cuarto ",response.data)
        this.setState({NombreCuarto:response.data.nombre})
        })

            let lin=ipFunc["ipapi"]+"/Cuarto/"+this.props.match.params.date+"/Cortina/"+ this.props.match.params.date2
            axios.get(lin)
              .then(response => {
                console.log(response.data)
                if (response.data == undefined || response.data == "error de cuarto" || response.data=="NO EXISTE cortina")
                {
                    if(response.data != "error de cuarto" )
                    {
                        let aux="/cuarto/"+this.props.match.params.date
                        this.setState({linkcuarto:aux})
                    }
                    
                    this.setState({Existe:false})
                }
                else
                {
                    let aux="/cuarto/"+this.props.match.params.date
                    this.setState({
                        linkcuarto:aux,
                        
                    })
                 
                    Cortina=response.data
                    this.setState({Cortina})
                    if ( Cortina !=undefined)
              {
                let PinLibreMotor;
                let linkMot=ipFunc["ipapi"]+"/CPU/"+Cortina.Dispositivo+"/"+Cortina.IdDisp+"/PinFree/PWM"
                let PinLibreSen1;
                let linkSen1=ipFunc["ipapi"]+"/CPU/"+Cortina.Dispositivo+"/"+Cortina.IdDisp+"/PinFree/Sen"
  
        
                axios.get(linkMot)
                .then(response => {
                  if (response.data != undefined)
                    {
                      PinLibreMotor=response.data
                    }      
                    console.log("los piens libres de motor son :",PinLibreMotor)
                  this.setState({ PinLibreMotor });
                })
                axios.get(linkSen1)
                .then(response => {
                 
                   if (response.data != undefined)
                    {
                      PinLibreSen1=response.data
                    }      
                    
                      this.setState({PinLibreSen1});
                })
           
        
              }
                }
          
              });



              
          
          }
onChange(e){
            if (e.target.name != "PinSensor1" && e.target.name != "PinSensor2" ){
            this.setState({
              [e.target.name]:e.target.value
        
            });
          }
          else {
            
            if (e.target.name == "PinSensor1"){
              
              if (e.target.value != this.state.PinSensor2 || e.target.value=="")
              {
                this.setState({
                  [e.target.name]:e.target.value
            
                });
              }
              else{
                alert ("Pines de sensores iguales")
              }
            }
            if (e.target.name == "PinSensor2"){
              if (e.target.value != this.state.PinSensor1 || e.target.value=="")
              {
                this.setState({
                  [e.target.name]:e.target.value
            
                });
              }
              else{
                alert ("Pines de sensores iguales")
              }
            }
          }
    
}
    
    
        
      
        
        
handleSubmit = event => {
            event.preventDefault();
        
            const Cor = {
              Pinmotor: this.state.Pinmotor,
              PinSensor1:  this.state.PinSensor1,
              PinSensor2: this.state.PinSensor2,
              Tipo: this.state.Tipo,
              Nombre:this.state.Nombre
            };            
            console.log ("se enviara ", Cor)
            let config = {headers: {'Access-Control-Allow-Origin': "*"}};

            let lin=ipFunc["ipapi"]+"/Cuarto/"+ this.props.match.params.date+"/Cortina/"+ this.props.match.params.date2+"/mod";
            axios.put(lin,  Cor , config)
              .then(res => {
                
                alert(res.data);
              }) 
      
          }



    
    render(){
      const { PinLibreMotor } = this.state;
      const { PinLibreSen1 } = this.state;
        var siexiste= 
        <div>
        {this.state.Cortina != undefined &&
                        <form onSubmit={this.handleSubmit} className="Formulario2" style={{color:"#AEA8A7"}}>
        <h2>
          Formulario Cortina
        </h2>
        
           <div id="separador">
           <span >Nombre </span>
           <input id="form" placeholder={this.state.Cortina.Nombre}  type="text" name="Nombre"   value={this.state.Nombre} onChange={this.onChange.bind(this)}/>
           </div>
           <div id="separador">
           <span >Pin Motor </span>
           <select   id="form"  name="Pinmotor"  value={this.state.Pinmotor} onChange={this.onChange.bind(this)} >
            {this.state.Cortina != undefined &&<option name="Pinmotor" value = ''>{this.state.Cortina.Pinmotor}</option>}
           {
              PinLibreMotor && PinLibreMotor.length && PinLibreMotor.map((p,index) => {
                 return (<option key={index} name="Pinmotor"  value={p}  onChange={this.onChange.bind(this)} >{p}</option>)
                })
          }
          
           </select>
           
           </div>

            <div id="separador">   
            <span >Sensor 1 </span>
            <select   id="form"  name="PinSensor1"  value={this.state.PinSensor1} onChange={this.onChange.bind(this)} >
            { this.state.Cortina !=undefined && <option name="PinSensor1" value = "">{this.state.Cortina.PinSensor1}</option>}
                {
              PinLibreSen1 && PinLibreSen1.length && PinLibreSen1.map((p,index) => {
                 if (this.state.Dispositivo == "IoT"){
                                if (index <(PinLibreSen1.length/2) ){
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

           <div id="separador">
           <span >Sensor 2 </span>
           <select   id="form"  name="PinSensor2"  value={this.state.PinSensor2}  onChange={this.onChange.bind(this)} >
            { this.state.Cortina !=undefined && <option name="PinSensor2" value = "">{this.state.Cortina.PinSensor2}</option>}
                {
              PinLibreSen1 && PinLibreSen1.length && PinLibreSen1.map((p,index) => {
                if (this.state.Dispositivo == "IoT"){
                  if (index >=(PinLibreSen1.length/2) ){
                    return (<option key={index} name="PinSen2"  value={p}  onChange={this.onChange.bind(this)} >{p}</option>)
                  }
              }
              else{
                return (<option key={index} name="PinSen2"  value={p}  onChange={this.onChange.bind(this)} >{p}</option>)
              }
                })
                }
          
           </select>
  
           {/* <input id="form" placeholder="Pin Sensor 2"  type="text" name="PinSensor2"   value={this.state.PinSensor2} onChange={this.onChange.bind(this)}/> */}
           </div>
           <div>
           { this.state.Cortina != undefined &&
           <span> Pines del Dispositivo: <b style={{color:"black"}}>{this.state.Cortina.Dispositivo}</b> con el id: {this.state.Cortina.IdDisp} .</span>}

           <span>si desea cambiar el dispositvio o el cuarto eliminar y agregar uno nuevo</span>
           </div>
           <div id="separador">
           <span >Tipo </span>
           <select   id="form"  name="Tipo"  value={this.state.Tipo} onChange={this.onChange.bind(this)} >
           <option name="Tipo" value = ''>{this.state.Cortina.Tipo}</option>
           <option name="Tipo" value = 'Roler'>Roller</option>
           <option name="Tipo" value = 'Persiana'>Persiana</option>
           </select>


           {/* <input id="form" placeholder="Tipo"  type="text" name="Tipo"   value={this.state.Tipo} onChange={this.onChange.bind(this)}/> */}
           </div>
             <div id="separador">
            <input className="button" type="submit" value="Submit"  className="button" onChange={this.onChange}/>
            </div>
          </form>}
          </div>
                        
        if (this.state.Existe == false)
        {
            siexiste=<h1>Error No Existe Cuarto O Id De Cortina</h1>
        }
      
        return (
    
    
            
          <div className="App">
            <nav className="navbar navbar-dark bg-dark"> 
                <div className="dropdown">
                   
                    
                     
                     <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            
                                <span className="navbar-toggler-icon"></span>
                                   </button>
    
                                   </div>
                                   
                                   <div style={{ fontSize:" calc(10px + 2vmin)", color: "white"}}>
                                   <a href="/main"><button type="button" className="btn btn-dark">Home </button></a>
                                   <a href={this.state.linkcuarto}><button type="button" className="btn btn-dark">Regresar A Cuarto {this.state.NombreCuarto} </button></a>
                                    </div>
                                   
                                   <img  className="Logo" src={process.env.PUBLIC_URL + '/Images/Escudo.png'} alt='Escudo' width='60'/>
                     </nav>
          <header className="App-header">
          <img src={process.env.PUBLIC_URL + '/Images/Escudo.png'} alt='Escudo' width='400'/>
       
           {siexiste}
              
          </header>
        </div>
        
    
    
        );
    
    }    












}
export default ModCor