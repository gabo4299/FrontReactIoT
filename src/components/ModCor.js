import React  from 'react';
import axios from 'axios';
import cors from 'cors';

import ipFunc from '../ipFunc.json'

import '../App.css';

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
            Existe:true,
            NombreCuarto:" ",
            linkcuarto:"",
            PinLibreMotor:undefined,
            PinLibreSen1:undefined,
            PinLibreSen2:undefined,
          };
          
    
        }
    componentDidMount() {
           
        let linget=ipFunc["ipapi"]+"/Cuarto/"+this.props.match.params.date
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
                        Pinmotor: response.data.Pinmotor,
                        PinSensor1: response.data.PinSensor1,
                        PinSensor2: response.data.PinSensor2,
                        Tipo:response.data.Tipo,
            
                        Nombre:response.data.Nombre,
                        linkcuarto:aux
                    })
                 
                }
          
              });



              if (this.state.Existe == true)
              {
                let PinLibreMotor=[];
                let linkMot=ipFunc["ipapi"]+"/PinCor"
                let PinLibreSen1=[];
                let linkSen1=ipFunc["ipapi"]+"/PinSen1"
                let PinLibreSen2=[];
                let linkSen2=ipFunc["ipapi"]+"/PinSen2"
        
                axios.get(linkMot)
                .then(response => {
                  for (let i = 0 ; i < ipFunc["NroPinesCor"] ; i++)
                  { if (response.data[i] != undefined)
                    {
                      PinLibreMotor.push({PinLibre: response.data[i]})
                    }      }
                  
                  this.setState({ PinLibreMotor });
                })
                axios.get(linkSen1)
                .then(response => {
                  for (let i = 0 ; i < ipFunc["NroPinesSen1"] ; i++)
                  { if (response.data[i] != undefined)
                    {
                      PinLibreSen1.push({PinLibre: response.data[i]})
                    }      }
                      this.setState({PinLibreSen1});
                })
                axios.get(linkSen2)
                .then(response => {
                  for (let i = 0 ; i < ipFunc["NroPinesSen2"] ; i++)
                  { if (response.data[i] != undefined)
                    {
                      PinLibreSen2.push({PinLibre: response.data[i]})
                    }      }
                      this.setState({PinLibreSen2});
                      console.log(PinLibreSen2)
                })
        
              }
          
          }
onChange(e){
            
            this.setState({
              [e.target.name]:e.target.value
        
            });
    
}
    
    
        
      
        
        
handleSubmit = event => {
            event.preventDefault();
        
            const Cor = {
              IdCortina: this.state.idCortina,
              IdCuarto:"",
              Pinmotor: this.state.Pinmotor,
              PinSensor1:  this.state.PinSensor1,
              PinSensor2: this.state.PinSensor2,
              Tipo: this.state.Tipo,
              Nombre:this.state.Nombre
            };            
            
            let config = {headers: {'Access-Control-Allow-Origin': "*"}};
            let lin=ipFunc["ipapi"]+"/Cuarto/"+ this.props.match.params.date+"/Cortina/"+ this.props.match.params.date2+"/mod";
            axios.put(lin,  Cor , config)
              .then(res => {
                console.log(res.data);
                alert(res.data);
              }) 
      
          }



    
    render(){
      const { PinLibreMotor } = this.state;
      const { PinLibreSen1 } = this.state;
      const { PinLibreSen2 } = this.state;
        var siexiste= 
        
                        <form onSubmit={this.handleSubmit} className="Formulario2">
        <h2>
          Formulario Cortina
        </h2>
         <div id="separador">
         <span style={{color:"#AEA8A7"}}>Id Cortina </span>
           <input  id="form" placeholder="ID Cortina" type="text" value={this.state.idCortina} name="IdCortina" onChange={this.onChange.bind(this)} />
           </div>
           <div id="separador">
           <span style={{color:"#AEA8A7"}}>Id Cuarto </span>
           <select   id="form"  name="IdCuarto"  value={this.state.IdCuarto} onChange={this.onChange.bind(this)} >
            <option name="IdCuarto" value={this.state.IdCuarto} >{this.state.IdCuarto}</option>
          
          
           </select>
           </div>
           <div id="separador">
           <span style={{color:"#AEA8A7"}}>Nombre </span>
           <input id="form" placeholder="Nombre"  type="text" name="Nombre"   value={this.state.Nombre} onChange={this.onChange.bind(this)}/>
           </div>
           <div id="separador">
           <span style={{color:"#AEA8A7"}}>Pin Motor </span>
           <select   id="form"  name="Pinmotor"  value={this.state.Pinmotor} onChange={this.onChange.bind(this)} >
            <option name="Pinmotor" value = {this.state.Pinmotor}>{this.state.Pinmotor}</option>
           {
              PinLibreMotor && PinLibreMotor.length && PinLibreMotor.map((p,index) => {
                 return (<option key={index} name="Pinmotor"  value={p["PinLibre"]}  onChange={this.onChange.bind(this)} >{p["PinLibre"]}</option>)
                })
          }
          
           </select>
           {/* <input id="form" placeholder="Pin Motor" type="text" name="Pinmotor"   value={this.state.Pinmotor} onChange={this.onChange.bind(this)}/> */}
           </div>

            <div id="separador">   
            <span style={{color:"#AEA8A7"}}>Sensor 1 </span>
            <select   id="form"  name="PinSensor1"  value={this.state.PinSensor1} onChange={this.onChange.bind(this)} >
            <option name="PinSensor1" value = {this.state.PinSensor1}>{this.state.PinSensor1}</option>
                {
              PinLibreSen1 && PinLibreSen1.length && PinLibreSen1.map((p,index) => {
                 return (<option key={index} name="PinSensor1"  value={p["PinLibre"]}  onChange={this.onChange.bind(this)} >{p["PinLibre"]}</option>)
                })
                }
          
           </select>
           {/* <input id="form"  placeholder="Pin Sensor 1" type="text" name="PinSensor1"  value={this.state.PinSensor1} onChange={this.onChange.bind(this)} /> */}
           </div>

           <div id="separador">
           <span style={{color:"#AEA8A7"}}>Sensor 2 </span>
           <select   id="form"  name="PinSensor2"  value={this.state.PinSensor2} onChange={this.onChange.bind(this)} >
            <option name="PinSensor2" value = {this.state.PinSensor2}>{this.state.PinSensor2}</option>
              {
              PinLibreSen2 && PinLibreSen2.length && PinLibreSen2.map((p,index) => {
                 return (<option key={index} name="PinSensor2"  value={p["PinLibre"]}  onChange={this.onChange.bind(this)} >{p["PinLibre"]}</option>)
                })
              }
          
           </select>
  
           {/* <input id="form" placeholder="Pin Sensor 2"  type="text" name="PinSensor2"   value={this.state.PinSensor2} onChange={this.onChange.bind(this)}/> */}
           </div>
           <div id="separador">
           <span style={{color:"#AEA8A7"}}>Tipo </span>
           <select   id="form"  name="Tipo"  value={this.state.Tipo} onChange={this.onChange.bind(this)} >
           <option name="Tipo" value = ''>Tipo</option>
           <option name="Tipo" value = 'Roler'>Roller</option>
           <option name="Tipo" value = 'Persiana'>Persiana</option>
           </select>


           {/* <input id="form" placeholder="Tipo"  type="text" name="Tipo"   value={this.state.Tipo} onChange={this.onChange.bind(this)}/> */}
           </div>
             <div id="separador">
            <input className="button" type="submit" value="Submit"  className="button" onChange={this.onChange}/>
            </div>
          </form>
                        
        if (this.state.Existe == false)
        {
            siexiste=<h1>Error No Existe Cuarto O Id De Cortina</h1>
        }
      
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