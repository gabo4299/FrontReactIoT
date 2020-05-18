import React  from 'react';
import axios from 'axios';

import ipFunc from "../ipFunc.json"



import '../App.css';
/* eslint-disable */
class FormCortina extends React.Component {
constructor(){
    super();
    this.state = {
        IdCortina: '',
        Pinmotor: '',
        PinSensor1: '',
        PinSensor2: '',
        Tipo:'',
        IdCuarto:'',
        Cuartos:undefined,
        Nombre:"",
        PinLibreMotor:undefined,
        PinLibreSen1:undefined,
        PinLibreSen2:undefined,

      }
}


componentDidMount() {
    let Cuartos=[];
    const axx=[];
    let linkget=ipFunc["ipapi"]+"/Cuartos"
    axios.get(linkget)
      .then(response => {
  
         const  a=JSON.stringify(response.data);
          console.log(response.data);
          axx.au=response.data;
         const b=JSON.stringify(axx.au.idcuarto);
          
         for (let i = 1; i < b.length; i=i+2) {
           Cuartos.push({idcuarto:parseInt((JSON.stringify(axx.au.idcuarto))[i])});
         }
         this.setState({ Cuartos });
      });

      if (Cuartos != undefined)
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
            console.log("pines libres motor : ",PinLibreMotor)
          
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
          [e.target.IdCortina]:e.target.value,
          [e.target.name]:e.target.value,
          [e.target.PinSensor1]:e.target.value,
          [e.target.PinSensor2]:e.target.value,
          [e.target.Tipo]:e.target.value
    
        })
      }
    
    
    
      handleSubmit = event => {
        event.preventDefault();
    
        const cor = {
          IdCortina: this.state.IdCortina,
          Pinmotor: this.state.Pinmotor,
          PinSensor1: this.state.PinSensor1,
          PinSensor2: this.state.PinSensor2,
          Tipo:this.state.Tipo,
          IdCuarto:this.state.IdCuarto,
          Nombre:this.state.Nombre
    
        };
    
        if (cor.Pinmotor == "" || cor.PinSensor1 == "" || cor.PinSensor2 == ""  )
        {
          alert("error de pines revisar porfavor")
        }
        else
        {
        
        let config = {headers: {'Access-Control-Allow-Origin': "*"}};
        let lin=ipFunc["ipapi"]+"/Cuarto/";
        lin=lin+cor.IdCuarto+"/Cortina/add";
        // console.log(lin,"este es el link ")
        axios.post(lin,  cor , config)
          .then(res => {
            //console.log(res);
            console.log(res.data);
            alert(res.data);
          })
        
        }
      }
render(){
    const { Cuartos } = this.state;
    const { PinLibreMotor } = this.state;
    const { PinLibreSen1 } = this.state;
    const { PinLibreSen2 } = this.state;
    
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
                                </div>
                               
                               <img  className="Logo" src={process.env.PUBLIC_URL + '/Images/Escudo.png'} alt='Escudo' width='60'/>
                 </nav>
      <header className="App-header">
        
      <img src={process.env.PUBLIC_URL + '/Images/Escudo.png'} alt='Escudo' width='400'/>

        <form onSubmit={this.handleSubmit} className="Formulario2">
        <h2>
          Formulario Cortina
        </h2>
         <div id="separador">

           <input  id="form" placeholder="ID Cortina" type="text" value={this.state.idCortina} name="IdCortina" onChange={this.onChange.bind(this)} />
           </div>
           <div id="separador">
           <select   id="form"  name="IdCuarto"  value={this.state.IdCuarto} onChange={this.onChange.bind(this)} >
            <option name="IdCuarto" value = ''>Id Cuarto</option>
           {
       Cuartos && Cuartos.length && Cuartos.map((p,index) => {
         return (<option key={index} name="IdCuarto"  value={p["idcuarto"]}  onChange={this.onChange.bind(this)} >{p["idcuarto"]}</option>)
         })
        }
          
           </select>
           </div>
           <div id="separador">
           <input id="form" placeholder="Nombre"  type="text" name="Nombre"   value={this.state.Nombre} onChange={this.onChange.bind(this)}/>
           </div>
           <div id="separador">
           <select   id="form"  name="Pinmotor"  value={this.state.Pinmotor} onChange={this.onChange.bind(this)} >
            <option name="Pinmotor" value = ''>Pinmotor</option>
           {
              PinLibreMotor && PinLibreMotor.length && PinLibreMotor.map((p,index) => {
                 return (<option key={index} name="Pinmotor"  value={p["PinLibre"]}  onChange={this.onChange.bind(this)} >{p["PinLibre"]}</option>)
                })
          }
          
           </select>
           {/* <input id="form" placeholder="Pin Motor" type="text" name="Pinmotor"   value={this.state.Pinmotor} onChange={this.onChange.bind(this)}/> */}
           </div>

            <div id="separador">   
            <select   id="form"  name="PinSensor1"  value={this.state.PinSensor1} onChange={this.onChange.bind(this)} >
            <option name="PinSensor1" value = ''>Pin Sensor 1</option>
           {
              PinLibreSen1 && PinLibreSen1.length && PinLibreSen1.map((p,index) => {
                 return (<option key={index} name="PinSensor1"  value={p["PinLibre"]}  onChange={this.onChange.bind(this)} >{p["PinLibre"]}</option>)
                })
          }
          
           </select>
           {/* <input id="form"  placeholder="Pin Sensor 1" type="text" name="PinSensor1"  value={this.state.PinSensor1} onChange={this.onChange.bind(this)} /> */}
           </div>

           <div id="separador">
           <select   id="form"  name="PinSensor2"  value={this.state.PinSensor2} onChange={this.onChange.bind(this)} >
            <option name="PinSensor2" value = ''>Pin Sensor 2</option>
           {
              PinLibreSen2 && PinLibreSen2.length && PinLibreSen2.map((p,index) => {
                 return (<option key={index} name="PinSensor2"  value={p["PinLibre"]}  onChange={this.onChange.bind(this)} >{p["PinLibre"]}</option>)
                })
          }
          
           </select>
           {/* <input id="form" placeholder="Pin Sensor 2"  type="text" name="PinSensor2"   value={this.state.PinSensor2} onChange={this.onChange.bind(this)}/> */}
           </div>
           <div id="separador">
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
      </header>
    </div>


    );

}
}

export default FormCortina