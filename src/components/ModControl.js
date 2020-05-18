import React  from 'react';
import axios from 'axios';

import Switch from "react-switch";
import ipFunc from '../ipFunc.json'

import '../App.css';
/* eslint-disable */
class ModControl extends React.Component {
    constructor (e){
        super(e);
    
    
        this.state = {
            IdControl:this.props.match.params.date2 ,
            IdCuarto: this.props.match.params.date,
            Pin:'',
            Tipo:'',
            Nombre:'',
            Existe:true,
            NombreCuarto:" ",
            linkcuarto:"",
            Control:undefined,
            PinLibre:undefined,
            Marcas:'',
            Marca:""
            ,Crear:false
          };
          
          this.switchchange = this.switchchange.bind(this);
        }
    componentDidMount() {
           
        let linget=ipFunc["ipapi"]+"/Cuarto/"+this.props.match.params.date
        let Control = undefined
        axios.get(linget)
        .then(response => {
            console.log("este es el cuarto ",response.data)
        this.setState({NombreCuarto:response.data.nombre})
        })

            let lin=ipFunc["ipapi"]+"/ControlIR/"+ this.props.match.params.date2
            axios.get(lin)
              .then(response => {
                console.log("respuestaaaaa",response.data)
                if (response.data == undefined || response.data == "No existe Lector con este ID" || response.data=="NO EXISTE")
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
                 
                    Control=response.data
                    this.setState({Control,Marca:Control.Marca})
                    console.log(Control)
                    if ( Control !=undefined)
              {
                let PinLibre;
                let linkMot=ipFunc["ipapi"]+"/CPU/"+Control.Dispositivo+"/"+Control.IdDisp+"/PinFree/ControlIR"
                        
                axios.get(linkMot)
                .then(response => {
                  if (response.data != undefined)
                    {
                      PinLibre=response.data
                    }      
                    console.log("los piens libres de motor son :",PinLibre)
                  this.setState({ PinLibre });
                })
                let Marcas;
                let linkMarc=ipFunc["ipapi"]+"/Marca"
                        
                axios.get(linkMarc)
                .then(response => {
                  if (response.data != undefined)
                    {
                      Marcas=response.data
                    }      
                    // console.log("Marcas",Marcas)
                  this.setState({ Marcas });
                })
           
        
              }
                }
          
              });



              
          
          }
switchchange(Crear) {

            this.setState({ Crear });
            
          }
onChange(e){
            var nam=e.target.name
            if (nam !="Tipo" )
            {
              this.setState({
              [e.target.name]:e.target.value
        
            });
            }
            else{
              var newcontrol=this.state.Control
              newcontrol.Tipo=e.target.value
              this.setState({
                [e.target.name]:e.target.value,
                Control:newcontrol
                      
              });

            }         
            
            
          }
    

    
    
        
      
        
        
handleSubmit = event => {
            event.preventDefault();
            var Cor
            if (this.state.Crear){
               Cor = {
                Pin:this.state.Pin,
                Tipo: this.state.Tipo,
                Nombre:this.state.Nombre,
                Marca:this.state.Marca,
                Create:1
              };
            }
            else{
               Cor = {
                Pin:this.state.Pin,
                Tipo: this.state.Tipo,
                Nombre:this.state.Nombre,
                Marca:this.state.Marca,
                Create:0
              };
            }
                        
            // console.log ("se enviara ", Cor)
            let config = {headers: {'Access-Control-Allow-Origin': "*"}};
            console.log("Modificando lo sig ",Cor , "id ",this.props.match.params.date2)
            let lin=ipFunc["ipapi"]+"/ControlIR/"+ this.props.match.params.date2+"/mod";
            axios.put(lin,  Cor , config)
              .then(res => {
               let MES="se modiicaron :"+res.data.CantidadCambios+"parametros : "+res.data.Message
                alert(MES);
              }) 
      
          }


EliminarBot(id,val)

{
  var s  =  "Desea Eliminar "+val+" del Control Y marca Asociada 'revisar la marca en el formulario derecho'"
  if (window.confirm(s)){
  let link = ipFunc ["ipapi"]+"/ControlIR/"+id+"/delCode/"+val
  axios.get(link).then(response=>{
    alert(response.data)
  })}
  
}
EliminarTodosBoot(id){
  if (window.confirm("Esta seguro de eliminar todos los codigos"))
  {
    let link = ipFunc["ipapi"] +"/ControlIR/"+id+"/delAllCodes"
    if (this.state.Control.Marca == "")
    {
      const dat = {
        Marca:false
      }
      axios.put(link,dat)
      .then(response=>
        {
          alert(response.data)
        })
    }
    else{
      var s = "Desea eliminar tambien la marca siempre que no sea de sistema"
      if (window.confirm(s))
      {
        const dat = {
          Marca:true
        }
        axios.put(link,dat)
        .then(response=>
          {
            alert(response.data)
          })
      }
      else {
        const dat = {
          Marca:false
        }
        axios.put(link,dat)
        .then(response=>
          {
            alert(response.data)
          })
      }
    }
  }
}
    
    render(){
      const { PinLibre } = this.state;
      var MarcaActiva=""
      var BotonesControlSEL=[]
      var RowControl=[]
      const {Marcas}=this.state
        var siexiste
        if (this.state.Existe == false)
        {
            siexiste=<h1>Error No Existe Cuarto O Id De Cortina</h1>
        }
        else{
          

          if (this.state.Control != undefined)
          {  
            MarcaActiva=this.state.Control.Marca
            if (this.state.Control != undefined){
               
              var Apagarpapu=false
              var imagenBoton="°"
              var pos=0
              var botonesNames=Object.keys(this.state.Control.Codigos)
              
              if (this.state.Control.Tipo != "TV"){
              for (let i = 0 ; i < botonesNames.length ;i++)
              {
                if (botonesNames[pos] != undefined){
                  for (let j = 0 ; j < 3 ; j ++)
                  {
                    if (botonesNames[pos] != undefined){
                      switch(botonesNames[pos])
                      {
                        case "ChUp":
                          imagenBoton=<img src={process.env.PUBLIC_URL + '/Images/btn-chup.png'} alt='Escudo' width='30'/>
                          break
                        case "ChDown":
                            imagenBoton=<img src={process.env.PUBLIC_URL + '/Images/btn-chdown.png'} alt='Escudo' width='30'/>
                            break
                        case "VolUp":
                            imagenBoton=<img src={process.env.PUBLIC_URL + '/Images/btn-volup.png'} alt='Escudo' width='30'/>
                            break
                        case "VolDown":
                            imagenBoton=<img src={process.env.PUBLIC_URL + '/Images/btn-voldown.png'} alt='Escudo' width='30'/>
                            break
                        case "Mute":
                          imagenBoton=<img src={process.env.PUBLIC_URL + '/Images/btn-mute.png'} alt='Escudo' width='30'/>
                          break
                        case "Up":
                            imagenBoton=<img src={process.env.PUBLIC_URL + '/Images/btn-flecha.png'} className="rotate270" alt='Escudo' width='30'/>
                            break
                        case "Down":
                          imagenBoton=<img src={process.env.PUBLIC_URL + '/Images/btn-flecha.png'} className="rotate90" alt='Escudo' width='30'/>
                            break
                        case "Right":
                          imagenBoton=<img src={process.env.PUBLIC_URL + '/Images/btn-flecha.png'}  alt='Escudo' width='30'/>
                            break
                        case "Left":
                          imagenBoton=<img src={process.env.PUBLIC_URL + '/Images/btn-flecha.png'} className="rotate180" alt='Escudo' width='30'/>
                              break   
                        case "ChDown":
                            imagenBoton=<img src={process.env.PUBLIC_URL + '/Images/btn-chdown.png'} alt='Escudo' width='30'/>
                            break
                        case "VolUp":
                            imagenBoton=<img src={process.env.PUBLIC_URL + '/Images/btn-volup.png'} alt='Escudo' width='30'/>
                            break
                        case "VolDown":
                            imagenBoton=<img src={process.env.PUBLIC_URL + '/Images/btn-voldown.png'} alt='Escudo' width='30'/>
                            break
                        case "Mute":
                          imagenBoton=<img src={process.env.PUBLIC_URL + '/Images/btn-mute.png'} alt='Escudo' width='30'/>
                          break
                        case "Up":
                            imagenBoton=<img src={process.env.PUBLIC_URL + '/Images/btn-flecha.png'} className="rotate270" alt='Escudo' width='30'/>
                            break
                        case "Down":
                          imagenBoton=<img src={process.env.PUBLIC_URL + '/Images/btn-flecha.png'} className="rotate90" alt='Escudo' width='30'/>
                            break
                        case "Right":
                          imagenBoton=<img src={process.env.PUBLIC_URL + '/Images/btn-flecha.png'}  alt='Escudo' width='30'/>
                            break
                        case "Left":
                          imagenBoton=<img src={process.env.PUBLIC_URL + '/Images/btn-flecha.png'} className="rotate180" alt='Escudo' width='30'/>
                              break
                              
                              
                          case "Ok":
                            imagenBoton="Ok"
                            break
                        case "PreChanel":
                            imagenBoton="PreCh"
                            break
                        case "Menu":
                            imagenBoton=<img src={process.env.PUBLIC_URL + '/Images/btn-menu.png'} alt='Escudo' width='30'/>
                            break
                        case "Sleep":
                          imagenBoton=<img src={process.env.PUBLIC_URL + '/Images/btn-sleep.png'} alt='Escudo' width='30'/>
                          break
                        case "Tools":
                            imagenBoton=<img src={process.env.PUBLIC_URL + '/Images/btn-tools.png'}  alt='Escudo' width='30'/>
                            break
                        case "Source":
                          imagenBoton=<img src={process.env.PUBLIC_URL + '/Images/btn-source.png'} alt='Escudo' width='30'/>
                            break
                        case "Return":
                          imagenBoton=<img src={process.env.PUBLIC_URL + '/Images/btn-return.png'}  alt='Escudo' width='30'/>
                            break
                        case "Smart Hub":
                          imagenBoton=<img src={process.env.PUBLIC_URL + '/Images/btn-smart.png'}  alt='Escudo' width='30'/>
                              break
                        default:
                          imagenBoton="°"
                      }
                      if (botonesNames[pos] == "Apagar" ||botonesNames[pos] == "Off" ||botonesNames[pos] == "On" ||botonesNames[pos] == "Encender" )
                      {
                        Apagarpapu=true
                      }
                      else{
                        Apagarpapu=false
                      }
                      let elstrinkey="cols de btn"+ String(pos)
                      
                        BotonesControlSEL.push(<div className="col-4" key={elstrinkey}>
          
                        { Apagarpapu == false  && 
                        <div> 
                          <button className="btn btn-secondary" onClick={this.EliminarBot.bind(this,this.state.Control.IdControl,botonesNames[pos])} value= {botonesNames[pos]}style={{fontSize:"20px",width:"80px"}}> {imagenBoton}</button><p>{botonesNames[pos]}</p></div> }
                        { Apagarpapu==true   && 
                        <div>
                          <button className="btn btn-danger"  onClick={this.EliminarBot.bind(this,this.state.Control.IdControl,botonesNames[pos])} value= {botonesNames[pos]} style={{fontSize:"20px",width:"80px"}}> <img src={process.env.PUBLIC_URL + '/Images/btn-off.png'} alt='Escudo' width='30'/> </button><p>{botonesNames[pos]}</p> </div>}
                        
                         </div>)
                      
                      
          
                    }
                    else{
                      break
                    }
                    pos=pos+1
                    
                  }
                  let elStrinMayor="rows divs"+String(i)
                  RowControl.push(<div className = "row" key = {elStrinMayor}> {BotonesControlSEL}</div>)
                  BotonesControlSEL=[]
                }
                else{
                  break
                }
                  
              }}
              else {
                // console.log("botones names",botonesNames , "y control es ",this.state.Control.Codigos)
                BotonesControlSEL=[]
                RowControl=(<div className="container" key="Conrolaso">
                  <div className = "row justify-content-between">
                    < div className="col-md-auto">
                      { this.state.Control.Codigos["Off"] != undefined &&
                        <div>
                          <button onClick={this.EliminarBot.bind(this,this.state.Control.IdControl,"Off")} className="btn btn-danger" id="btnControl" value="Off"> <img src={process.env.PUBLIC_URL + '/Images/btn-off.png'} alt='Off' width='30'/> </button> 
                          <p style ={{display :this.state.Visibility}}>Apagar</p> 
                          </div>
                      }
                    </div>
                    < div className="col-md-auto">
                    { this.state.Control.Codigos["Source"] != undefined &&
                        <div><button  onClick={this.EliminarBot.bind(this,this.state.Control.IdControl,"Source")} className="btn btn-secondary" id="btnControl" value="Soure"> <img src={process.env.PUBLIC_URL + '/Images/btn-source.png'} alt='Source' width='30'/> </button> <p style ={{display :this.state.Visibility}}>Source</p> </div>
                      }
                    </div>
                  </div>
                  <div className = "row justify-content-center">
                    <div className ="col-md-auto" >
                    { this.state.Control.Codigos["VolUp"] != undefined &&
                        <div><button  onClick={this.EliminarBot.bind(this,this.state.Control.IdControl,"VolUp")} className="btn btn-light"  id="btnControl" value="VolUp"> <img src={process.env.PUBLIC_URL + '/Images/btn-volup.png'} alt='Vup' width='30'/> </button> <p style ={{display :this.state.Visibility}} className="App">V+</p> </div>
                      }
                    </div>
                    <div className ="col-md-auto">
                    { this.state.Control.Codigos["ChUp"] != undefined &&
                        <div><button  onClick={this.EliminarBot.bind(this,this.state.Control.IdControl,"ChUp")} className="btn btn-light" id="btnControl" value="ChUp"> <img src={process.env.PUBLIC_URL + '/Images/btn-chup.png'} alt='CHup' width='30'/> </button> <p className="App" style ={{display :this.state.Visibility}}>CH+</p> </div>
                      }
                    </div>
                    <div className="w-100"></div>
                    <div className ="col-md-auto">
                    { this.state.Control.Codigos["VolDown"] != undefined &&
                        <div><button  onClick={this.EliminarBot.bind(this,this.state.Control.IdControl,"VolDown")} className="btn btn-light" id="btnControl" value="VolDown"> <img src={process.env.PUBLIC_URL + '/Images/btn-voldown.png'} alt='VDown' width='30'/> </button> <p className="App" style ={{display :this.state.Visibility}}>V-</p> </div>
                      }
                    </div>
                    <div className ="col-md-auto">
                    { this.state.Control.Codigos["ChDown"] != undefined &&
                        <div><button  onClick={this.EliminarBot.bind(this,this.state.Control.IdControl,"ChDown")} className="btn btn-light" id="btnControl" value="ChDown"> <img src={process.env.PUBLIC_URL + '/Images/btn-chdown.png'} alt='CHDown' width='30'/> </button> <p className="App" style ={{display :this.state.Visibility}}>CH-</p> </div>
                      }
                    </div>
                    <div className="w-100"></div>
                    <div className ="col-md-auto">
                    { this.state.Control.Codigos["Mute"] != undefined &&
                        <div><button  onClick={this.EliminarBot.bind(this,this.state.Control.IdControl,"Mute")} className="btn btn-secondary" id="btnControl" value="Mute"> <img src={process.env.PUBLIC_URL + '/Images/btn-mute.png'} alt='Mute' width='30'/> </button> <p className="App" style ={{display :this.state.Visibility}}>V-</p> </div>
                      }
                    </div>
                    <div className ="col-md-auto">
                    { this.state.Control.Codigos["PreChanel"] != undefined &&
                        <div><button  onClick={this.EliminarBot.bind(this,this.state.Control.IdControl,"PreChanel")} className="btn btn-secondary" id="btnControl" value="PreChanel" style={{fontSize:"15px",height:"48px"}}> PRE-CH </button> <p className="App" style ={{display :this.state.Visibility}}>Pre Ch</p> </div>
                      }
                    </div>
                  </div>
                  <div className = "row justify-content-center">
                    <div className ="col-md-auto" >
                    { this.state.Control.Codigos["Smart Hub"] != undefined &&
                        <div><button  onClick={this.EliminarBot.bind(this,this.state.Control.IdControl,"Smart Hub")} className="btn btn-secondary"  id="btnControl" value="Smart Hub"> <img src={process.env.PUBLIC_URL + '/Images/btn-smart.png'} alt='Smart' width='30'/> </button> <p className="App" style ={{display :this.state.Visibility}}>SmartHub</p> </div>
                      }
                    </div>
                    <div className ="col-md-auto" >
                    { this.state.Control.Codigos["Menu"] != undefined &&
                        <div><button  onClick={this.EliminarBot.bind(this,this.state.Control.IdControl,"Menu")} className="btn btn-secondary"  id="btnControl" value="Menu"> <img src={process.env.PUBLIC_URL + '/Images/btn-menu.png'} alt='menu' width='30'/> </button> <p className="App" style ={{display :this.state.Visibility}}>Menu</p> </div>
                      }
                    </div>
                    <div className ="col-md-auto" >
                    { this.state.Control.Codigos["Return"] != undefined &&
                        <div><button   onClick={this.EliminarBot.bind(this,this.state.Control.IdControl,"Return")}className="btn btn-secondary"  id="btnControl" value="Return"> <img src={process.env.PUBLIC_URL + '/Images/btn-return.png'} alt='return' width='30'/> </button> <p className="App" style ={{display :this.state.Visibility}}>Return</p> </div>
                      }
                    </div>
                  </div>
                  <div className = "row justify-content-center">
                    <div className ="col-md-auto" >
                    { this.state.Control.Codigos["Up"] != undefined &&
                        <div><button   onClick={this.EliminarBot.bind(this,this.state.Control.IdControl,"Up")} className="btn btn-light"  id="btnControl" value="Up"> <img className="rotate270" src={process.env.PUBLIC_URL + '/Images/btn-flecha.png'} alt='up' width='30'/> </button> <p className="App" style ={{display :this.state.Visibility}}>Up</p> </div>
                      }
                    </div>
                  
                  </div>
                  <div className = "row justify-content-center">
                    <div className ="col-md-auto" >
                    { this.state.Control.Codigos["Left"] != undefined &&
                        <div><button  onClick={this.EliminarBot.bind(this,this.state.Control.IdControl,"Left")} className="btn btn-light"  id="btnControl" value="Left"> <img className="rotate180" src={process.env.PUBLIC_URL + '/Images/btn-flecha.png'} alt='Left' width='30'/> </button> <p className="App" style ={{display :this.state.Visibility}}>Left</p> </div>
                      }
                    </div>
                    <div className ="col-md-auto" >
                    { this.state.Control.Codigos["Ok"] != undefined &&
                        <div><button  onClick={this.EliminarBot.bind(this,this.state.Control.IdControl,"Ok")} className="btn btn-secondary"  id="btnControl" value="Ok"> OK </button> <p className="App" style ={{display :this.state.Visibility}}>Ok</p> </div>
                      }
                    </div>
                    <div className ="col-md-auto" >
                    { this.state.Control.Codigos["Right"] != undefined &&
                        <div><button  onClick={this.EliminarBot.bind(this,this.state.Control.IdControl,"Right")} className="btn btn-light"  id="btnControl" value="Right"> <img  src={process.env.PUBLIC_URL + '/Images/btn-flecha.png'} alt='Right' width='30'/> </button> <p className="App" style ={{display :this.state.Visibility}}>Right</p> </div>
                      }
                    </div>
                  
                  </div>
                  <div className = "row justify-content-center">
                    <div className ="col-md-auto" >
                      { this.state.Control.Codigos["Down"] != undefined &&
                        <div><button  onClick={this.EliminarBot.bind(this,this.state.Control.IdControl,"Down")} className="btn btn-light"  id="btnControl" value="Down"> <img className="rotate90" src={process.env.PUBLIC_URL + '/Images/btn-flecha.png'} alt='Down' width='30'/> </button> <p className="App" style ={{display :this.state.Visibility}}>Down</p> </div>
                      }
                    </div>
                  
                  </div>    
                  <div className = "row justify-content-between">
                    < div className="col-md-auto">
                      { this.state.Control.Codigos["Tools"] != undefined &&
                        <div><button  onClick={this.EliminarBot.bind(this,this.state.Control.IdControl,"Tools")} className="btn btn-secondary" id="btnControl" value="Tools"> <img src={process.env.PUBLIC_URL + '/Images/btn-tools.png'} alt='Tools' width='30'/> </button> <p style ={{display :this.state.Visibility}}>Tools</p> </div>
                      }
                    </div>
                    < div className="col-md-auto">
                    { this.state.Control.Codigos["Sleep"] != undefined &&
                        <div><button  onClick={this.EliminarBot.bind(this,this.state.Control.IdControl,"Sleep")} className="btn btn-secondary" id="btnControl" value="Sleep"> <img src={process.env.PUBLIC_URL + '/Images/btn-sleep.png'} alt='Sleep' width='30'/> </button> <p style ={{display :this.state.Visibility}}>Sleep</p> </div>
                      }
                    </div>
                  </div>
                </div>)
                
          
              }
          // si no genera nada entonces
              if (botonesNames[0] == undefined)
              {     
                  RowControl=[]
                  BotonesControlSEL=[]
                  RowControl.push(<div key="Vacio" style={{color:"red"}}>
                    <p >No Existen Codigos registrados en este control elija una marca creada  </p>
                   
          
                    <p>O agregue codigos</p>
                  </div>)
              }
            }
          }



        // ###################Formulariooo#################3
        siexiste= 
        <div className = "container">
          
        {this.state.Control != undefined &&
          <div className ="row">
            <div className="col" style={{backgroundColor:"#daeeff",borderRadius:"20px"}}>
              <h1 style={{color:"black"}}>Vista Actual Y eliminacion de botones de Control</h1>
              <button className ="btn btn-danger" onClick={this.EliminarTodosBoot.bind(this,this.state.Control.IdControl)}> Eliminar todos los codigos</button>
            {RowControl}
            </div>
            <div className = "col">
              <form onSubmit={this.handleSubmit} className="Formulario" style={{color:"#AEA8A7"}}>
                <h2>
                  Formulario Control
                  </h2>
              
                <div id="separador">
                <span >Nombre </span>
                <input id="form" placeholder={this.state.Control.Nombre}  type="text" name="Nombre"   value={this.state.Nombre} onChange={this.onChange.bind(this)}/>
                </div>
                
                <span >Pin</span>
                <select   id="form"  name="Pin"  value={this.state.Pin} onChange={this.onChange.bind(this)} >
                  {this.state.Control != undefined &&<option name="Pin" value = ''>{this.state.Control.Pin}</option>}
                {
                    PinLibre && PinLibre.length && PinLibre.map((p,index) => {
                      return (<option key={index} name="Pin"  value={p}  onChange={this.onChange.bind(this)} >{p}</option>)
                      })
                }
                
                </select>
                
                

                <div  id = "separador">
                <div>       <span>Crear Marca</span>  <Switch onChange={this.switchchange}  checked={this.state.Crear} /></div> 
                <span >Marca</span>
                { this.state.Crear == false &&
                  <select id="form" name="Marca" value={this.state.Marca} onChange={this.onChange.bind(this)}>
                    {/* <option name ="Marca" value={this.state.Control.Marca}> {this.state.Control.Marca}</option> */}
                    <option name ="Marca" value = "" >Sin Marca</option>
                    
                    {
                    Marcas["Marca"] && Marcas["Marca"].length && Marcas["Marca"].map((p,index) => {
                      return (<option key={index} name="Marca"  value={p}  onChange={this.onChange.bind(this)} >{p}</option>)
                      })
                }
                  </select>}
                  {this.state.Crear == true && 
                  <input id="form" placeholder={this.state.Control.Marca}  type="text" name="Marca"   value={this.state.Marca} onChange={this.onChange.bind(this)}/>}
                </div>
                
                <div>
                { this.state.Control != undefined &&
                <span> Pines del Dispositivo: <b style={{color:"black"}}>{this.state.Control.Dispositivo}</b> con el id: {this.state.Control.IdDisp} .</span>}

                <span>si desea cambiar el dispositvio o el cuarto eliminar y agregar uno nuevo</span>
                </div>
                <div id="separador">
                <span >Tipo </span>
                <select   id="form"  name="Tipo"  value={this.state.Tipo} onChange={this.onChange.bind(this)} >
                <option name="Tipo" value = ''>{this.state.Control.Tipo}</option>
                <option name="Tipo" value = 'TV'>Tv</option>
                <option name="Tipo" value = 'Normal'>Sin Tipo</option>
                </select>


                {/* <input id="form" placeholder="Tipo"  type="text" name="Tipo"   value={this.state.Tipo} onChange={this.onChange.bind(this)}/> */}
                </div>
                  <div id="separador">
                  <input className="button" type="submit" value="Submit"  className="button" onChange={this.onChange}/>
                  </div>
              </form>
            </div>
          </div>}
          </div>
          
        
        
        
        
        
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
export default ModControl