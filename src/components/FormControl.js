import React  from 'react';
import axios from 'axios';

import ipFunc from "../ipFunc.json"
import Switch from "react-switch";

import '../App.css';

class FormControl extends React.Component {
constructor(e){
    super(e);
    this.state = {
        IdCuarto:this.props.match.params.id,
        IdControl:undefined,
        Pin: undefined,
        Marca: undefined,
        Dispositivo:"Rasp",
        IdDisp:undefined,
        Cuartos:undefined,
        Nombre:undefined,
        PinsLibres:undefined,
        IDsDisponibles:undefined,
        Cuarto:undefined,
        Guardar:false,
        Marca:"",
        Marcas:undefined,
        NewMarca:"",
        linkcuarto:"",
        Tipo:""
        
        

      }
      this.switchchange = this.switchchange.bind(this);
}
switchchange(Guardar) {
    // console.log(checked)
    this.setState({ Guardar });

    if (Guardar == true){
        alert ("A futuro las acciones a realizar en el control tambien afectara a la marca ,siempre y cuando no sea una marca de sistema")
    
    }
    else{
        // this.setState({
        //     CantPWM:0,
        //     CantLuz:0
        // })
        console.log("no se guarda")
    
    }
  }
componentDidMount(){
    var regresaraCuarto="/cuarto/"+this.state.IdCuarto
    this.setState({
        linkcuarto:regresaraCuarto
    })
    let linkCasa =ipFunc["ipapi"]+"/Cuarto/"+this.state.IdCuarto
    axios.get(linkCasa)
    .then (response =>
        {
            console.log("Cuarto:",response.data)
            this.setState({
                Cuarto:response.data
             });
        })

    let linkDisp =ipFunc["ipapi"]+"/CPU/Rasps"
    axios.get(linkDisp)
    .then (response =>
        {
            // console.log( "ids rasps",response.data.IdRasp)
            this.setState({
                IDsDisponibles:response.data.IdRasp
             });
        })
    
    let linkMarcas = ipFunc["ipapi"]+"/Marca"
    axios.get(linkMarcas)
    .then (response =>
        {
            console.log( "Marcas",response.data , "len" , response.data.Marca.length)
            this.setState({
                Marcas:response.data
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
if (e.target.name == "Pin" ||e.target.name == "Nombre"||e.target.name == "Marca"||e.target.name == "NewMarca" ||e.target.name == "Tipo"){
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

  handleSubmit= event => {
    event.preventDefault();
    let linkAdd=ipFunc["ipapi"]+"/ControlIR/add"
    let Control
    if (this.state.Pin != undefined && this.state.Pin != ""  ){
        if (this.state.Marca != ""){
            Control={
                IdDisp:this.state.IdDisp,
                IdCuarto:this.state.IdCuarto,
                Dispositivo:this.state.Dispositivo,
                Pin:this.state.Pin,
                Nombre:this.state.Nombre,
                Marca:this.state.Marca,
                Guardar:this.state.Guardar,
                Tipo:this.state.Tipo
            } 
        }
        else {
            Control={
                IdDisp:this.state.IdDisp,
                IdCuarto:this.state.IdCuarto,
                Dispositivo:this.state.Dispositivo,
                Pin:this.state.Pin,
                Nombre:this.state.Nombre,
                Marca:this.state.NewMarca,
                Guardar:this.state.Guardar,
                Tipo:this.state.Tipo
            } 
            
    }
    axios.post(linkAdd,Control)
            .then(response =>{
                alert(response.data)
            })
}
else{
    alert("Seleccione un Pin Valido")
}
    
}
  
    
  
render(){
const { IDsDisponibles } = this.state;
const {PinesSLibres}= this.state;
const {Marcas}=this.state
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
      Formulario Control
    </h2>
    <img src={process.env.PUBLIC_URL + "/Images/Control.png"}  width='160'/>
        <div className="col">
        <input  id="form" placeholder="Nombre" type="text" value={this.state.Nombre} name="Nombre" onChange={this.onChange.bind(this)} />
        </div>
        <div id = "separador">
       <b style={{color:"black"}}>Dispositivo:</b> <select  id = "form" value={this.state.Dispositivo} name="Dispositivo" onChange={this.onChange.bind(this)} >
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
                    
                
                     <div className = "col">
                         <select  id = "form" value={this.state.Pin} name="Pin" onChange={this.onChange.bind(this)} >
                         
                            <option value ="" name = "Pin">Eliga el pin a usar en {this.state.Dispositivo}</option>

                            
                            {
                            PinesSLibres && PinesSLibres.length && PinesSLibres.map((p,index) => {
                    return (<option key={index} name="Pin"  value={p}  onChange={this.onChange.bind(this)} >{p}</option>)
                    })
                    }

                     </select>
                     <div id= "col">
                        {/* <input  id="form" placeholder="Marca" type="text" value={this.state.Nombre} name="Marca" onChange={this.onChange.bind(this)} /> */}
                        <label style={{color:"black",fontSize: "15px"}}> Seleccione si desea heredar codigos de alguna marca</label>
                        <select  id = "form" value={this.state.Marca} name="Marca" onChange={this.onChange.bind(this)} >
                        <option value ="" name = "Marca">Sin Codigos Predifinidos </option>
                        {Marcas["Marca"] && Marcas["Marca"].length && Marcas["Marca"].map((p,index) => {
                    return (<option key={index} name="Marca"  value={p}  onChange={this.onChangeid.bind(this)} >{p}</option>)
                    
                    })}
                    </select>
                    <div id="separador">
                        <select id = "form" value={this.state.Tipo} name="Tipo" onChange={this.onChange.bind(this)} >
                            <option value='' name="Tipo" onChange={this.onChange.bind(this)}>Normal</option>
                            <option value="TV" name="Tipo" onChange={this.onChange.bind(this)}>Control de Televicion</option>
                        </select>
                    </div>
                    {/* <p style={{  fontSize: "15px" , color:"brown"}}> Si desea registrar un nuevo control y guardar los codigos para futuros controles no seleccione ninguna marca y seleciones Guardar Marca posteriormte coloquele un nombre</p>  */}
                    <label style={{color:"black"}}> Relacionar Control y Marca <Switch onChange={this.switchchange}  checked={this.state.Guardar} /></label>    
                    { this.state.Guardar == true && this.state.Marca == "" &&
                    <div >
                        <input  id="form" placeholder="Marca" type="text" value={this.state.NewMarca} name="NewMarca" onChange={this.onChange.bind(this)} />
                        </div>}
                     </div>
                     
                     </div>
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
    {this.state.Cuarto != undefined && 
    <a href={this.state.linkcuarto}><button type="button" className="btn btn-dark">Regresar A Cuarto {this.state.Cuarto.nombre}</button></a>}
    
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

export default FormControl