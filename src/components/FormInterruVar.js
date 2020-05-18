import React  from 'react';
import axios from 'axios';

import Switch from "react-switch";
import ipFunc from "../ipFunc.json"


import '../App.css';
/* eslint-disable */
class FormInterruVar extends React.Component {
constructor (e){
    super(e);


    this.state = {
        IdCuarto:this.props.match.params.date,
        Dispositivo: 'Rasp',
        IdDisp:undefined,
        Pin: "",
        
        Cuartos:undefined,
        Dimmer:false,
        linkcuarto:"",
        NombreCuarto:"",
        Nombre:'',
        PinsLibres:undefined,
        IDsDisponibles:undefined,
      };
this.switchchange = this.switchchange.bind(this);

    }

    
    

   

    componentDidMount() {
        let linkcuarto="/cuarto/"+this.props.match.params.date
        this.setState({linkcuarto})
        // console.log("el id es ",this.state.IdCuarto)
        let linget=ipFunc["ipapi"]+"/Cuarto/"+this.props.match.params.date
        axios.get(linget)
        .then(response => {
        this.setState({NombreCuarto:response.data.nombre})
        })
        let Cuartos=[];
        const axx=[];
        let linknewcuartos=ipFunc["ipapi"]+"/Cuartos"
        axios.get(linknewcuartos)
          .then(response => {
      
             
              console.log(response.data);
              axx.au=response.data;
             const b=JSON.stringify(axx.au.idcuarto);
              console.log("aqui estas" )
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
    if (e.target.name == "Pin" ||e.target.name == "Nombre"||e.target.name == "Marca"||e.target.name == "NewMarca" ){
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
            let linkPins=ipFunc["ipapi"]+"/CPU/"+this.state.Dispositivo+"/"+e.target.value+"/PinFree/Luz"
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
        event.preventDefault();
    
        const Luz = {
          IdCuarto: this.state.IdCuarto,
          Pin: this.state.Pin,
          Dimmer: this.state.Dimmer,
          Nombre:this.state.Nombre,
          Dispositivo:this.state.Dispositivo,
          IdDisp:this.state.IdDisp
    
        };

        
    
        //AYUDA CON EL LUGAR DODNE SE PONDRA EL INTERRUPTOR 
        if(Luz.Pin == "" || Luz.Pin == " "   || Luz.IdDisp == '' || Luz.IdDisp == undefined)
        {
          alert("Error de Pin Seleccione un pin  o id Valido")
        }
        else
        {
        
          
        let config = {headers: {'Access-Control-Allow-Origin': "*"}};
        let lin=ipFunc["ipapi"]+"/Cuarto/";
        lin=lin+Luz.IdCuarto+"/Luz/add";
        console.log(lin,"este es el link ")
        axios.post(lin,  Luz , config)
          .then(res => {
            //console.log(res);
            console.log(res.data);
            alert(res.data);
          })

        }
          
          
      }


      switchchange(Dimmer) {

        this.setState({ Dimmer });
        
      }

      
render(){
    
  var Form;
    const { IDsDisponibles } = this.state;
const {PinesSLibres}= this.state;
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
            {this.state.Dimmer == false && <option value ="IoT">
              IoT</option>}

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
                    
                
                     <div className = "col">
                         <select  id = "form" value={this.state.Pin} name="Pin" onChange={this.onChange.bind(this)} >
                         
                            <option value ="" name = "Pin">Eliga el pin a usar en {this.state.Dispositivo}</option>

                            
                            {
                            PinesSLibres && PinesSLibres.length && PinesSLibres.map((p,index) => {
                    return (<option key={index} name="Pin"  value={p}  onChange={this.onChange.bind(this)} >{p}</option>)
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
                               <a href={this.state.linkcuarto}><button type="button" className="btn btn-dark">Regresar A Cuarto {this.state.NombreCuarto} </button></a>
                                </div>
                               
                               <img  className="Logo" src={process.env.PUBLIC_URL + '/Images/Escudo.png'} alt='Escudo' width='60'/>
                 </nav>
      <header className="App-header">
      <img src={process.env.PUBLIC_URL + '/Images/Escudo.png'} alt='Escudo' width='400'/>
   
        <div  className="FormularioLecIr"> 
        <h2>
          Formulario Luz
        </h2>
        <form ref={form=>this.form=form} onSubmit={this.handleSubmit} >
         
            <div id='form'>
           
           </div>
          
           <div id="separador">
           <input  id="form" type="text" name="Nombre"  placeholder="Nombre" value={this.state.Nombre} onChange={this.onChange.bind(this)} />
           
           </div>
           
           
           <label style={{color:"#7A7270"}}>Dimmer</label>
  
  <div>          <Switch onChange={this.switchchange}  checked={this.state.Dimmer} /></div> 
           
           
           {Form}
           <div >
            <input type="submit" value="Submit" className="button" onChange={this.onChange.bind(this)}   />
            </div>
            
            
        
            
        
      
            
            

            
          </form>
          </div>
          <div> 
       
     
   
                  
            
          </div>
          
      </header>
    </div>
    


    );

}
}

export default FormInterruVar