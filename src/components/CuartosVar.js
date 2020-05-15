
import React  from 'react';
import axios from 'axios';
 import cors from 'cors';

import SocketIOClient from 'socket.io-client'
import io from 'socket.io-client'

import ipFunc from '../ipFunc.json';
import '../App.css';
import Axios from 'axios';





class CuartosVar extends React.Component{

  constructor(e){
    
    super(e);
    
this.state={
      Cuarto:undefined,
      idcuarto:this.props.match.params.date,
      Luces:undefined,
      Cortinas:undefined,
      Controles:undefined,
      cantLuces:undefined,
      cantCortinas:undefined,
      cantControles:undefined,
      Existe:"",
      ComprobarContra:"",
      ContraIngresada:"",
      Fondo:'/Images/Escudo.png',
      Modif:false,
      Dispositivos:'',
      IdControlActivo:undefined,
      ListaMarcas:undefined,
      AsociarMarcaControl:{
        Marca:undefined,
        IdControl:undefined,
        Guardar:false
      },
      LecIR:undefined,
      ModControl:false,
      LecIRSELEC:"",
      Visibility:"none"
}  
this.time=undefined
// this.repeat = this.repeat.bind(this)
    
}
on(Id,Estado,Val){
  if(Estado=="Abierto" && Val!="Arriba" || Estado=="Cerrado" && Val!="Abajo" || Estado=="Semi"){
      this.repeat(Id,Estado,Val)
  }
  else{
    var msg="Ya esta "+Estado;

    alert(msg);
  }
  
}
repeat(Id,Estado,Val){
  this.time = setTimeout(this.repeat.bind(this,Id,Estado,Val),300)
  this.CambioCortina(Id,Estado,Val)
}
off(){
  clearTimeout(this.time)
}
 
defcuarto= async() =>{

  var lin =ipFunc["ip"]+"/API/Cuarto/";
  lin=lin+(this.state.idcuarto);
  var a;
  
  let _this=this;
  
  let Cortinas=[];
  let Luces=[];
  let Controles=[];
  let LecIR=[]
  // var controlescopia;
  var corcopia;
  var luzcopia;
  io.connect(ipFunc["ip"], { transports: ['websocket'] });
  const socket = SocketIOClient(ipFunc["ip"]);
  // console.log(lin)
  await axios.get(lin)
 
          .then(response => {
            
            a=response.data;
            
            this.setState({
              Cuarto:response.data,
              Dispositivos:response.data.NDispositivos
             
            })
            if (response.data.contrasenha == "" || response.data.contrasenha == " " ){

              this.setState({ComprobarContra:""})
              
            }
            else{
              this.setState({ComprobarContra:response.data.contrasenha})
              
            }
            
          });


          

          if (a != "no existe Cuarto"){
            let linNew =ipFunc["ip"]+"/API/Luces"
           await axios.get(linNew)
            .then(response => {
              
              if (response.data != "No Existen"){
              for (let  i = 0 ; i < response.data.IdCuarto.length ; i++){
              if (response.data.IdCuarto[i]==this.state.idcuarto){
                    Luces.push({
                      IdCuarto:response.data.IdCuarto[i],
                      IdInterruptor:response.data.IdInterruptor[i],
                      Estado:response.data.Estado[i],
                      Pin:response.data.Pin[i],
                      Dimmer:response.data.Dimmer[i],
                      Nombre:response.data.Nombre[i]});
  
                      this.setState({ Luces });
               }
               luzcopia=Luces;
              
               
              
              }
            }
            
              //console.log("Luces finally", this.state.Luces);
              
              this.setState({ cantLuces:Luces.length });
    
            

              

            
            });
            let linCorts=ipFunc["ip"]+"/API/Cortinas"
           await axios.get(linCorts)
              .then(response =>{
                
                
                
                if(response.data.IdCuarto!= undefined && response.data !="No Existen"  ){
                for (let  i = 0 ; i < response.data.IdCuarto.length ; i++){
                if (response.data.IdCuarto[i]==this.state.idcuarto){
                      Cortinas.push({
                        IdCuarto:response.data.IdCuarto[i],
                        IdCortina:response.data.IdCortina[i],
                        Estado:response.data.Estado[i],
                        Pinmotor:response.data.Pinmotor[i],
                        PinSensor1:response.data.PinSensor1[i],
                        PinSensor2:response.data.PinSensor2[i],
                        Tipo:response.data.Tipo[i],
                        Nombre:response.data.Nombre[i]});
                        this.setState({ Cortinas });
                        
                 }
                
                }
                //AQUI MANDAMOS LEER SENSORES ! DORECTO CON ID CUARTO ASI MANDA EL ARRAY 
                socket.emit("Estado_Cortinas_Cuarto",(response.data.IdCuarto,response.data.IdCortina))

              }
                corcopia=Cortinas;
              // if (this.state.Cortinas.length =! undefined){
                this.setState({ cantCortinas:Cortinas.length });
                
              // }
              // else{
              //   this.setState({ cantCortinas:0 });
              // }
                
                
              })
              let linContr=ipFunc["ip"]+"/API/Controles"
              await axios.get(linContr)
                 .then(response =>{
                   
                   
                   
                   if(response.data.IdCuarto!= undefined && response.data !="No Existen"  ){
                   for (let  i = 0 ; i < response.data.IdCuarto.length ; i++){
                   if (response.data.IdCuarto[i]==this.state.idcuarto){
                         Controles.push({
                           IdCuarto:response.data.IdCuarto[i],
                           IdControl:response.data.IdControl[i],
                           Nombre:response.data.Nombre[i],
                           Codigos:response.data.Codigos[i],
                           Marca:response.data.Marca[i],
                           Tipo:response.data.Tipo[i],
                          })

                           this.setState({ Controles });
                           
                    }
                   
                   }
                  //  *******************************Para los valorees ********************************
                  //  console.log("Controles",Controles[0].Codigos)
                  //  console.log(Object.keys(Controles[0].Codigos))
                  
                 }
                   
                   this.setState({ cantControles:Controles.length });
                 })
                 let linLecIR=ipFunc["ip"]+"/API/LecIRS"
                 await axios.get(linLecIR)
                    .then(response =>{
                      if(response.data.IdLec!= undefined && response.data !="No Existen"  ){
                            LecIR=response.data
                              this.setState({ LecIR });
                    }
                      
                      
                    })   
                 
            }
            else{
              alert("No Existe Cuarto");
              this.setState({
                Existe:"No"
              })
              
            }

        socket.on("CortinaCambio",function(id,Estado){
                  
                  
                  for (let i =0 ; i <Cortinas.length; i++){
                    
                    let ids = Cortinas[i].IdCortina;
                    if(ids == id){

                      console.log("Socketeando:","id : ", id , "Estado: ", Estado);
         
                      corcopia[i].Estado=Estado;     
                                
                    }
                  }
       
                  _this.setState({Cortinas:corcopia});
                  corcopia=Cortinas;
                  
                });

                socket.on("LuzCambio",function(id,Estado){
                  
                  
                  for (let i =0 ; i <Luces.length; i++){
                    
                    let ids = Luces[i].IdInterruptor;
                    if(ids == id){

                      console.log("Socketeando luz :","id : ", id , "Estado: ", Estado);
         
                      luzcopia[i].Estado=Estado;     
                      
                    }
                  }
       
                  _this.setState({Luces:luzcopia});
                  luzcopia=Luces;
                  
                });

  
  
}

componentDidMount(){
  
  this.defcuarto(); 
  let linkMarca=ipFunc["ipapi"]+"/Marca"
  axios.get(linkMarca)
  .then(response=>{
    this.setState({ListaMarcas:response.data})
  })

}


click(e){
  console.log("Cuarto:",this.state.Cuarto);
if (this.state.Cuarto != "no existe Cuarto"){
  this.state.Luces.map((p,index)=>{
    console.log( "da?",p.Pin)
    //posi
  })

  let lin =ipFunc["ip"]+"/API/Cuarto/";
  lin=lin+this.state.idcuarto+"/Luz/1/Estado";
  axios.get(lin)
  .then(response =>{
    console.log(response.data);
  })

}}
CambioCortina(Id,Estado,Val,param){
  console.log("value: " , Val  , "Id:",Id ,"Estado",Estado);
  var datos={Cambiar:undefined,
          Estado:undefined,
          EstadoAntiguo:undefined,
          Accion:undefined};
  let lin = ipFunc["ip"]+"/API/Cuarto/"+this.state.idcuarto+"/Cortina/"+Id+"/Estado";

  if (Estado=="Abierto" ){
        if (Val == "Arriba"){
          alert("Ya esta Abierto");
        }
        if (Val == "Abajo"){
          console.log("Bajando");
          datos.Cambiar="Si";
          datos.Estado="Semi";
          datos.EstadoAntiguo=Estado;
          datos.Accion=Val;
          axios.post(lin,datos);
          
        }
        if (Val == "Todo"){
          //bajas hasta el fond
          console.log("Bajar todo ");
          datos.Cambiar="Si";
          datos.Estado="Cerrado";
          datos.EstadoAntiguo=Estado;
          datos.Accion=Val;
          axios.post(lin,datos);
          
        }
    
  }

  if (Estado=="Cerrado" ){
        if (Val == "Arriba"){
          console.log("Subiendo");
          datos.Cambiar="Si";
          datos.Estado="Semi";
          datos.EstadoAntiguo=Estado;
          datos.Accion=Val;
          axios.post(lin,datos);
          
          

        }
        if (Val == "Abajo"){
          alert("Ya esta Cerrado");
        }
        if (Val == "Todo"){
          console.log("Subiendo completamente");
          datos.Cambiar="Si";
          datos.Estado="Abierto";
          datos.EstadoAntiguo=Estado;
          datos.Accion=Val;
          axios.post(lin,datos);
        }
    
  }
  if (Estado=="Semi" ){
    if (Val == "Arriba"){
      console.log("Subiendo");
      datos.Cambiar="No";
        datos.Estado="Semi";
        datos.EstadoAntiguo=Estado;
        datos.Accion=Val;
        axios.post(lin,datos);
    }
    if (Val == "Abajo"){
      console.log("Subiendo");
      datos.Cambiar="No";
      datos.Estado="Semi";
      datos.EstadoAntiguo=Estado;
      datos.Accion=Val;
      axios.post(lin,datos);
    }  
    if (Val == "Todo"){
      if (param == "Subir")
      {
        console.log("Subiendo Completamente");
        datos.Cambiar="Si";
        datos.Estado="Abierto";
        datos.EstadoAntiguo=Estado;
        datos.Accion=Val;
        axios.post(lin,datos);
      }
      else
      {
        datos.Cambiar="Si";
        datos.Estado="Cerrado";
        datos.EstadoAntiguo=Estado;
        datos.Accion=Val;
        axios.post(lin,datos);
        console.log("Bajando Completamente");
      }
    } 
  }
  
}

ModifPress(e){
  
  if (this.state.Modif==false)
  {
    this.setState({Modif:true});
  }
  else{
    if(e.target.name == 'salir'){
      window.location.reload(false);
    }
    this.setState({Modif:false});
  }
}


CambioLuz(val,id,pos)
{
  let lin =ipFunc["ipapi"]+"/Cuarto/";
  lin=lin+this.state.idcuarto+"/Luz/"+id+"/Estado";
  var Estado={"Estado":0}
  let config = {headers: {'Access-Control-Allow-Origin': "*" }};
  console.log("este es el valor de este :",val ,"y su id : ",id);
  

  
  if (val== "Apagado"){
    Estado.Estado=1
    axios.post(lin,Estado,config);

 
  }
  if (val== "Encendido"){
    Estado.Estado=0
    axios.post(lin,Estado,config);
    
  }}

  CambioDimmer(e){
    let val=parseInt([e.target.value])
    let pos= parseInt( [e.target.name])
    let id=this.state.Luces[pos].IdInterruptor
    let lin =ipFunc["ipapi"]+"/Cuarto/";

    lin=lin+this.state.idcuarto+"/Luz/"+id+"/Estado";
    var Estado={"Estado":val}
    let config = {headers: {'Access-Control-Allow-Origin': "*" }};
    
    if (val % 20 == 0)
    {
      axios.post(lin,Estado)
        .catch(err=>
          {
            console.log(err)
          });
    }
    // 
    
  }
  
  Contrapress(e){
    console.log(e.key);
    if(e.key=='Enter')
    {
      
      this.setState({
      [e.target.name]:e.target.value
    })
    if (this.state.ContraIngresada==this.state.Cuarto.contrasenha){
      this.setState({
        ComprobarContra:""
      })
  }
  else{
    alert("Contraseha erronea")
  }

  
  }

  }
  Contra(e){
    
    this.setState({
      [e.target.name]:e.target.value
    })
  }
  compro(p){
    if (p==this.state.Cuarto.contrasenha){
        this.setState({
          ComprobarContra:""
        })
    }
    else{
      alert("Contraseha erronea")
    }
  }
  onChange(e)
  {
    this.setState({
      [e.target.name]:e.target.value
    })
  }
  check(e)
  {
    var {AsociarMarcaControl}=this.state
    
    // console.log("antes del despute es ", e.target.value)
    if (e.target.value==false || e.target.value=='false')
    {
      AsociarMarcaControl.Guardar=true
    
    }
    else{
      
      AsociarMarcaControl.Guardar=false
    }
    // console.log("despues del despute es ", AsociarMarcaControl.Guardar)
    this.setState({AsociarMarcaControl})
    
  }
  OnChageNewMarca(e)
{
  let {AsociarMarcaControl}=this.state
  AsociarMarcaControl.Marca=e.target.value
  this.setState({
    AsociarMarcaControl
  })
}

  eliminarFuncCortina(ID,nombre)
  {
    var a ;
    let no="Esta Seguro de Elimianar La Cortina "+nombre +" ID:"+ID;
    let lin=ipFunc["ip"]+"/API/Cuarto/"+this.state.idcuarto+"/Cortina/"+ID+"/del"
    a=window.confirm( no);
    
    if(a==true){
        axios.delete(lin)
        
    }
    else{
        console.log("NO Confirmo")
    }
  }
  seleccionarContronId(ID,Selecciono)
  {
    
    if (Selecciono == 1 || Selecciono==true)
    {
      this.setState({
      IdControlActivo:ID,
      ModControl:false
      
    })
    
  }
  else{
    this.setState({
      IdControlActivo:undefined,
      ModControl:false
    })
    
    }
    
    }
  VerTxT(){
    if(this.state.Visibility =="none")
    {
      
      this.setState({Visibility:""})
    }
    else{
      console.log("Cambiando")
      this.setState({Visibility:"none"})
    }
  }
eliminarFuncLuz(ID,nombre)
{
    var a ;
    let no="Esta Seguro de Elimianar El foco "+nombre+" ID:"+ID;
    let lin=ipFunc["ip"]+"/API/Cuarto/"+this.state.idcuarto+"/Luz/"+ID+"/del"
    a=window.confirm( no);
    
    if(a==true){
        axios.delete(lin)
        window.location.reload(false);
    }
    else{
        console.log("NO Confirmo")
    }

}
CopiarMarcas(ID)
{
  let link = ipFunc["ipapi"]+"/ControlIR/"+ID+"/copyMarca"
  let sed={
    Marca:this.state.AsociarMarcaControl["Marca"]
  }
axios.post(link,sed)
.then(response=>
  {
    alert(response.data)
  }
)
}
eliminarFunControl(control){

let lineli=ipFunc["ipapi"]+"/ControlIR/"+control.IdControl
let mes=" desea elimnar control id:"+control.IdControl;
let c1=window.confirm(mes)


if (c1){
  let mes2="Desea Eliminar la marca siempre y cuando no sea de sistema,acept=si,cancelar=No"
  let c2 = window.confirm(mes2)
  if(c2){
    lineli=lineli+"/1/del"
    
  }
  else{
    
    lineli=lineli+"/0/del"
  }
  axios.delete(lineli)
    .then(response=>
      {
        alert(response.data)
      })
}
else{
  alert("No eliminado")
}

} 
agregarCodigo(id)
{
  if (this.state.LecIRSELEC != "")
  {
    var s =window.prompt("Ingrese un nombre para el Futuro Codigo");
    if (s == null || s == "") {
     
      alert("Ingrese Nombre para leer el codigo")
    } else {
      var mes = "Leyendo codigo con , el futuro nombre: "+s+" y con el lector:"+this.state.LecIRSELEC
      alert(mes)
      let lin = ipFunc["ipapi"]+"/ControlIR/"+id+"/LecIR/"+this.state.LecIRSELEC+"/"+s
      axios.get(lin)
      .then(response=>
        {
          alert(response.data)
        })
    }
  }
  else{
    alert("Seleccione un id de lector Valido")
  }
}
EnviarCodigo(id,nameCodigo)
{
  
  let link= ipFunc["ipapi"]+"/ControlIR/"+id+"/send/"+nameCodigo
  axios.get(link)
  .then(response=>
    {
      console.log(response.data)
    })
}
  render(){
    
    
    const linkmodificacionCuarto="/mod/"+this.state.idcuarto
    const linkagregarluz="/formI/"+this.state.idcuarto
    const linkagregarcortina="/formC/"+this.state.idcuarto
    const linkagregarControl="/formControl/"+this.state.idcuarto
    var linkfondo=ipFunc['ip']+"/API/Cuarto/"+this.state.idcuarto+"/Fondo";
    var nombre;
    var VariableModificacion=<h1 > {nombre}</h1>
    const { cantLuces } = this.state;
    const contenedorLuces=[];
    const auxLUZ=[];
    const contenedorDisp=[];
    const contenedorCortinas=[];
    const auxCOR=[];
    const {cantCortinas}=this.state;
    const contenedorControles=[];
    const auxCONTROLES=[];
    const { cantControles } = this.state;
    var MarcaActiva='';
    
      if (this.state.Cuarto != undefined  && this.state.Cuarto != "no existe Cuarto"){
          nombre=this.state.Cuarto.nombre;
      }
      else 
      {
        nombre=" ";
      }
//*************************************************************************************************** var Modal para Control ******************************************//
var BotonesControlSEL=[]
var RowControl=[]
if (this.state.IdControlActivo != undefined)
{
  var controlActivo=undefined
  for (let i =0 ; i <cantControles ; i++)
  {
    if (this.state.Controles[i].IdControl ==this.state.IdControlActivo )
    {
      controlActivo=this.state.Controles[i]
      MarcaActiva=this.state.Controles[i].Marca
      break
    }

  }

  
  if (controlActivo != undefined){
     
    var Apagarpapu=false
    var imagenBoton="°"
    var pos=0
    var botonesNames=Object.keys(controlActivo.Codigos)
    console.log("el control activo es",controlActivo," y la longitud es",botonesNames.length)
    if (controlActivo.Tipo != "TV"){
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
              <div> <button className="btn btn-secondary" onClick={this.EnviarCodigo.bind(this,controlActivo.IdControl,botonesNames[pos])} value= {botonesNames[pos]}style={{fontSize:"20px",width:"80px"}}> {imagenBoton}</button><p>{botonesNames[pos]}</p></div> }
              { Apagarpapu==true   && 
              <div>
                <button className="btn btn-danger" onClick={this.EnviarCodigo.bind(this,controlActivo.IdControl,botonesNames[pos])} value= {botonesNames[pos]} style={{fontSize:"20px",width:"80px"}}> <img src={process.env.PUBLIC_URL + '/Images/btn-off.png'} alt='Escudo' width='30'/> </button><p>{botonesNames[pos]}</p> </div>}
              
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
      // console.log("botones names",botonesNames , "y control es ",controlActivo.Codigos)
      BotonesControlSEL=[]
      RowControl=(<div className="container" key="Conrolaso">
        <div className = "row justify-content-between">
          < div className="col-md-auto">
            { controlActivo.Codigos["Apagar"] != undefined &&
              <div>
                <button  onClick={this.EnviarCodigo.bind(this,controlActivo.IdControl,"Apagar")} className="btn btn-danger" id="btnControl" value="Apagar"> <img src={process.env.PUBLIC_URL + '/Images/btn-off.png'} alt='Off' width='30'/> </button> 
                <p style ={{display :this.state.Visibility}}>Apagar</p> 
                </div>
            }
          </div>
          <div className="col-md-autp"> <button className="btn btn-warning" onClick={this.VerTxT.bind(this)}>Texto</button></div>
          < div className="col-md-auto">
          { controlActivo.Codigos["Source"] != undefined &&
              <div><button onClick={this.EnviarCodigo.bind(this,controlActivo.IdControl,"Source")} className="btn btn-secondary" id="btnControl" value="Soure"> <img src={process.env.PUBLIC_URL + '/Images/btn-source.png'} alt='Source' width='30'/> </button> <p style ={{display :this.state.Visibility}}>Source</p> </div>
            }
          </div>
        </div>
        <div className = "row justify-content-center">
          <div className ="col-md-auto" >
          { controlActivo.Codigos["VolUp"] != undefined &&
              <div><button onClick={this.EnviarCodigo.bind(this,controlActivo.IdControl,"VolUp")} className="btn btn-light"  id="btnControl" value="VolUp"> <img src={process.env.PUBLIC_URL + '/Images/btn-volup.png'} alt='Vup' width='30'/> </button> <p style ={{display :this.state.Visibility}} className="App">V+</p> </div>
            }
          </div>
          <div className ="col-md-auto">
          { controlActivo.Codigos["ChUp"] != undefined &&
              <div><button  onClick={this.EnviarCodigo.bind(this,controlActivo.IdControl,"ChUp")} className="btn btn-light" id="btnControl" value="ChUp"> <img src={process.env.PUBLIC_URL + '/Images/btn-chup.png'} alt='CHup' width='30'/> </button> <p className="App" style ={{display :this.state.Visibility}}>CH+</p> </div>
            }
          </div>
          <div className="w-100"></div>
          <div className ="col-md-auto">
          { controlActivo.Codigos["VolDown"] != undefined &&
              <div><button onClick={this.EnviarCodigo.bind(this,controlActivo.IdControl,"VolDown")} className="btn btn-light" id="btnControl" value="VolDown"> <img src={process.env.PUBLIC_URL + '/Images/btn-voldown.png'} alt='VDown' width='30'/> </button> <p className="App" style ={{display :this.state.Visibility}}>V-</p> </div>
            }
          </div>
          <div className ="col-md-auto">
          { controlActivo.Codigos["ChDown"] != undefined &&
              <div><button onClick={this.EnviarCodigo.bind(this,controlActivo.IdControl,"ChDown")} className="btn btn-light" id="btnControl" value="ChDown"> <img src={process.env.PUBLIC_URL + '/Images/btn-chdown.png'} alt='CHDown' width='30'/> </button> <p className="App" style ={{display :this.state.Visibility}}>CH-</p> </div>
            }
          </div>
          <div className="w-100"></div>
          <div className ="col-md-auto">
          { controlActivo.Codigos["Mute"] != undefined &&
              <div><button onClick={this.EnviarCodigo.bind(this,controlActivo.IdControl,"Mute")} className="btn btn-secondary" id="btnControl" value="Mute"> <img src={process.env.PUBLIC_URL + '/Images/btn-mute.png'} alt='Mute' width='30'/> </button> <p className="App" style ={{display :this.state.Visibility}}>V-</p> </div>
            }
          </div>
          <div className ="col-md-auto">
          { controlActivo.Codigos["PreChanel"] != undefined &&
              <div><button onClick={this.EnviarCodigo.bind(this,controlActivo.IdControl,"PreChanel")} className="btn btn-secondary" id="btnControl" value="PreChanel" style={{fontSize:"15px",height:"48px"}}> PRE-CH </button> <p className="App" style ={{display :this.state.Visibility}}>Pre Ch</p> </div>
            }
          </div>
        </div>
        <div className = "row justify-content-center">
          <div className ="col-md-auto" >
          { controlActivo.Codigos["Smart Hub"] != undefined &&
              <div><button onClick={this.EnviarCodigo.bind(this,controlActivo.IdControl,'Smart Hub')} className="btn btn-secondary"  id="btnControl" value="Smart Hub"> <img src={process.env.PUBLIC_URL + '/Images/btn-smart.png'} alt='Smart' width='30'/> </button> <p className="App" style ={{display :this.state.Visibility}}>SmartHub</p> </div>
            }
          </div>
          <div className ="col-md-auto" >
          { controlActivo.Codigos["Menu"] != undefined &&
              <div><button onClick={this.EnviarCodigo.bind(this,controlActivo.IdControl,"Menu")} className="btn btn-secondary"  id="btnControl" value="Menu"> <img src={process.env.PUBLIC_URL + '/Images/btn-menu.png'} alt='menu' width='30'/> </button> <p className="App" style ={{display :this.state.Visibility}}>Menu</p> </div>
            }
          </div>
          <div className ="col-md-auto" >
          { controlActivo.Codigos["Return"] != undefined &&
              <div><button onClick={this.EnviarCodigo.bind(this,controlActivo.IdControl,"Return")} className="btn btn-secondary"  id="btnControl" value="Return"> <img src={process.env.PUBLIC_URL + '/Images/btn-return.png'} alt='return' width='30'/> </button> <p className="App" style ={{display :this.state.Visibility}}>Return</p> </div>
            }
          </div>
        </div>
        <div className = "row justify-content-center">
          <div className ="col-md-auto" >
          { controlActivo.Codigos["Up"] != undefined &&
              <div><button onClick={this.EnviarCodigo.bind(this,controlActivo.IdControl,"Up")} className="btn btn-light"  id="btnControl" value="Up"> <img className="rotate270" src={process.env.PUBLIC_URL + '/Images/btn-flecha.png'} alt='up' width='30'/> </button> <p className="App" style ={{display :this.state.Visibility}}>Up</p> </div>
            }
          </div>
        
        </div>
        <div className = "row justify-content-center">
          <div className ="col-md-auto" >
          { controlActivo.Codigos["Left"] != undefined &&
              <div><button onClick={this.EnviarCodigo.bind(this,controlActivo.IdControl,"Left")} className="btn btn-light"  id="btnControl" value="Left"> <img className="rotate180" src={process.env.PUBLIC_URL + '/Images/btn-flecha.png'} alt='Left' width='30'/> </button> <p className="App" style ={{display :this.state.Visibility}}>Left</p> </div>
            }
          </div>
          <div className ="col-md-auto" >
          { controlActivo.Codigos["Ok"] != undefined &&
              <div><button onClick={this.EnviarCodigo.bind(this,controlActivo.IdControl,"Ok")} className="btn btn-secondary"  id="btnControl" value="Ok"> OK </button> <p className="App" style ={{display :this.state.Visibility}}>Ok</p> </div>
            }
          </div>
          <div className ="col-md-auto" >
          { controlActivo.Codigos["Right"] != undefined &&
              <div><button onClick={this.EnviarCodigo.bind(this,controlActivo.IdControl,"Right")} className="btn btn-light"  id="btnControl" value="Right"> <img  src={process.env.PUBLIC_URL + '/Images/btn-flecha.png'} alt='Right' width='30'/> </button> <p className="App" style ={{display :this.state.Visibility}}>Right</p> </div>
            }
          </div>
        
        </div>
        <div className = "row justify-content-center">
          <div className ="col-md-auto" >
            { controlActivo.Codigos["Down"] != undefined &&
              <div><button onClick={this.EnviarCodigo.bind(this,controlActivo.IdControl,"Down")} className="btn btn-light"  id="btnControl" value="Down"> <img className="rotate90" src={process.env.PUBLIC_URL + '/Images/btn-flecha.png'} alt='Down' width='30'/> </button> <p className="App" style ={{display :this.state.Visibility}}>Down</p> </div>
            }
          </div>
        
        </div>    
        <div className = "row justify-content-between">
          < div className="col-md-auto">
            { controlActivo.Codigos["Tools"] != undefined &&
              <div><button onClick={this.EnviarCodigo.bind(this,controlActivo.IdControl,"Tools")} className="btn btn-secondary" id="btnControl" value="Tools"> <img src={process.env.PUBLIC_URL + '/Images/btn-tools.png'} alt='Tools' width='30'/> </button> <p style ={{display :this.state.Visibility}}>Tools</p> </div>
            }
          </div>
          < div className="col-md-auto">
          { controlActivo.Codigos["Sleep"] != undefined &&
              <div><button onClick={this.EnviarCodigo.bind(this,controlActivo.IdControl,"Sleep")} className="btn btn-secondary" id="btnControl" value="Sleep"> <img src={process.env.PUBLIC_URL + '/Images/btn-sleep.png'} alt='Sleep' width='30'/> </button> <p style ={{display :this.state.Visibility}}>Sleep</p> </div>
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
          <select    name="AsociarMarcaControl['Marca']" val={this.state.AsociarMarcaControl.Marca} onChange={this.OnChageNewMarca.bind(this)} >
                        <option value ="" name="" onChange={this.OnChageNewMarca.bind(this)}>Sin Codigos Predifinidos </option>

         {this.state.ListaMarcas["Marca"] && this.state.ListaMarcas["Marca"].length && this.state.ListaMarcas["Marca"].map((p,index) => {
                    return (<option key={index} name="AsociarMarcaControl['Marca']"  value={p}  onChange={this.OnChageNewMarca.bind(this)} >{p}</option>)
                    
                    })}
          </select>
          <button className="bnt btn-secondary" onClick={this.CopiarMarcas.bind(this,controlActivo.IdControl)}>Copair Marca a control</button>

          <p>O agregue codigos</p>
        </div>)
    }
  }
}


var ModalControl=<div  key ="modal loco"className="modal fade" id="ModalControl" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" >
<div className="modal-dialog modal-dialog-centered"  role="document">
  <div className="modal-content" style={{color:"black",borderRadius:"50px",backgroundColor:"#a7a4a4"}}>
    
    <div style={{alignContent:"flex-end",marginRight:"24px",marginTop:"10px"}}>
      <button   onClick={this.seleccionarContronId.bind(this,undefined,false)} type="button" className="close" data-dismiss="modal" aria-label="Close"  >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div className="modal-body">
      <div className="container">
        {RowControl}
      </div>
    </div>
    <div className="modal-footer">
     <div className="row align-items-start" >
    
      
      {/* <label>Asociar con marca </label><input className="form-check-input" type="radio" name="" checked={this.state.AsociarMarcaControl.Guardar}   value={this.state.AsociarMarcaControl.Guardar} onClick={this.check.bind(this)} ></input> */}
      <label>Asociado con Marca: {MarcaActiva} </label>

      <select onChange={this.onChange.bind(this)} value={this.state.LecIRSELEC} name="LecIRSELEC">
        <option value="" onChange={this.onChange.bind(this)} name="LecIRSELEC">Seleccione Id de lector</option>
        
        {this.state.LecIR != undefined && this.state.LecIR["IdLec"] && this.state.LecIR["IdLec"].length && this.state.LecIR["IdLec"].map((p,index) => {
                    return (<option key={index} onChange={this.onChange.bind(this)} name="LecIRSELEC" value={p}  >{p}</option>)
                    
                    })}
      </select>{controlActivo != undefined &&
      <button type="button" className="btn btn-primary" onClick={this.agregarCodigo.bind(this,controlActivo.IdControl)}>Agregar Codigos</button>}
      <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={this.seleccionarContronId.bind(this,undefined,false)}>Close</button>
      </div> 
      
      </div>
    </div>
  </div>
</div>


//*************************************************************************************************** Loop for para luces ******************************************//
    for (let i =0 ; i <cantLuces ; i++){
      let linkmodluz=this.state.idcuarto +"/ModLuz/"+this.state.Luces[i].IdInterruptor
      if (this.state.Luces[i].Dimmer == false)
        {if(this.state.Luces[i].Estado == "Apagado"){

        
          auxLUZ.push(<div key={i} className="col-md-auto"> <img onClick={this.CambioLuz.bind(this,this.state.Luces[i].Estado,this.state.Luces[i].IdInterruptor,i)} src={process.env.PUBLIC_URL + '/Images/luzApagada.png'} alt='Escudo' width='150' style={{'cursor':"pointer"}}/> <h3 style={{color:"#65CAE7",textAlign:"center"}}>{this.state.Luces[i].Nombre}</h3>  </div>)
        }
        if(this.state.Luces[i].Estado == "Encendido"){
          auxLUZ.push(<div key={i} className="col-md-auto"> <img  onClick={this.CambioLuz.bind(this,this.state.Luces[i].Estado,this.state.Luces[i].IdInterruptor,i)} src={process.env.PUBLIC_URL + '/Images/luzEncendida.png'} alt='Escudo' width='150' style={{'cursor':"pointer"}} /> <h3 style={{color:"#65CAE7",textAlign:"center"}}>{this.state.Luces[i].Nombre}</h3></div>)
          }
        if (this.state.Modif==true)
        {
          auxLUZ.push(<div   className='col sm-4' key ={"modluz"+i}> <a href={linkmodluz}> <button  className ="btn btn-warning" style={{color:"#fff"}}>Modificar</button></a> <button className='btn btn-danger'  onClick={this.eliminarFuncLuz.bind(this,this.state.Luces[i].IdInterruptor,this.state.Luces[i].Nombre)}>Eliminar</button></div>)
        }}
        else{
          let imgDimmer
          if(this.state.Luces[i].Estado == 0){
            imgDimmer= '/Images/luzApagada.png'
            
          }
          if(this.state.Luces[i].Estado >0 &&this.state.Luces[i].Estado <45  ){
            imgDimmer='/Images/luzSemiMenos.png'
          }
          if(this.state.Luces[i].Estado >=45 &&this.state.Luces[i].Estado <70  ){
            imgDimmer= '/Images/luzSemi.png'
          }
          if(this.state.Luces[i].Estado >=70 &&this.state.Luces[i].Estado <100  ){
            imgDimmer= '/Images/luzSemiMas.png'
          }
          if(this.state.Luces[i].Estado ==100  ){
            imgDimmer='/Images/luzEncendida.png'
          }
          
          auxLUZ.push(<div key={i} className="col-4" > 
            <div className ="container">            
            <div className="row">
              <div style={{float:"right"}}>
              
              
              <img  src={process.env.PUBLIC_URL+imgDimmer} alt='Luz Apagada' width='150' style={{'cursor':"pointer"}} style={{float:"left"}} /> 
              </div>
              {/* className="slider-wrapper" */}
              
            <div  className="slider-wrapper" style={{float:"left",marginLeft:"150px" ,position:"absolute"}}>
          <input type="range"  className="slider" min='0' max='100' step='20'  name={i} onChange={this.CambioDimmer.bind(this)} value ={this.state.Luces[i].Estado}  list="tickmarks"/>
          </div>  
          <datalist id="tickmarks">
            <option value="0"   label="0%">  </option>
            <option value="10" ></option>
            <option value="20"></option>
            <option value="30"></option>
            <option value="40"></option>
            <option value="50" label="50%"></option>
            <option value="60"></option>
            <option value="70"></option>
            <option value="80"></option>
            <option value="90"></option>
            <option value="100" label="100%"></option>
            </datalist>
            
            
            
            </div>
            </div>

          <h3 style={{color:"#65CAE7"}}>{this.state.Luces[i].Nombre}</h3>
          </div>)
          if (this.state.Modif==true)
          {
            auxLUZ.push(<div   className='col sm-4' key ={"modluz"+i}> <a href={linkmodluz}> <button  className ="btn btn-warning" style={{color:"#fff"}}>Modificar</button></a> <button className='btn btn-danger'  onClick={this.eliminarFuncLuz.bind(this,this.state.Luces[i].IdInterruptor,this.state.Luces[i].Nombre)}>Eliminar</button></div>)
          }
        }
        
    }
    contenedorLuces.push( <div key="s"  className="container" >  <div className="row">{auxLUZ}</div> </div>);
//*************************************************************************************************** Loop for para controles ******************************************//
    for (let i =0 ; i <cantControles ; i++){
      let linkmodControl=this.state.idcuarto +"/ModControl/"+this.state.Controles[i].IdControl
       

        
          auxCONTROLES.push(<div key={i} className="col"> 
          {/* onClick={this.CambioLuz.bind(this,this.state.Luces[i].Estado,this.state.Luces[i].IdInterruptor,i)} */}
          <img  src={process.env.PUBLIC_URL + '/Images/Control.png'} alt='Control' width='100' style={{'cursor':"pointer"}} data-toggle="modal" data-target="#ModalControl" onClick={this.seleccionarContronId.bind(this,this.state.Controles[i].IdControl,true)}/>
           <h3 style={{color:"#65CAE7"}}>{this.state.Controles[i].Nombre}</h3>  </div>)
        
        
          
          
        if (this.state.Modif==true)
        {
          auxCONTROLES.push(<div   className='col sm-4' key ={"modcontrol"+i}> <a href={linkmodControl}> <button  className ="btn btn-warning" style={{color:"#fff"}}>Modificar</button></a> 
          {/* del button eliminar onClick={this.eliminarFuncLuz.bind(this,this.state.Luces[i].IdInterruptor,this.state.Luces[i].Nombre)} */}
          <button className='btn btn-danger' onClick={this.eliminarFunControl.bind(this,this.state.Controles[i])} >Eliminar</button></div>)
        }
        
    }
    contenedorControles.push( <div key="C"  className="container" >  <div className="row">{auxCONTROLES}</div> </div>);

    //*************************************************************************************************** Loop for para cortinas ******************************************//
    for (let i =0 ; i <cantCortinas ; i++){
      let linkmodcor=this.state.idcuarto +"/ModCor/"+this.state.Cortinas[i].IdCortina
      let ids = this.state.Cortinas[i].IdCortina;
      let estado=this.state.Cortinas[i].Estado;
      if (this.state.Cortinas[i].Estado == "Abierto"){
    
        auxCOR.push( <div className="row" key = {i}><div key = {i} id="CortinaAbierto" className="col-md-auto">  
        <img   src={process.env.PUBLIC_URL + '/Images/CortinaAbierta.png'} alt='Cortina' width='150' />  </div> 
        <div className="col-md-auto"> 
        <div className='container'>
        <div className='col'> <button className="button2"  onMouseDown={this.on.bind(this,ids,estado,"Arriba")} onMouseUp={this.off.bind(this)}>🢁</button> </div>
        <div className='col'> <button className="button2" onMouseDown={this.on.bind(this,ids,estado,"Abajo")} onMouseUp={this.off.bind(this)}>🢃</button> </div>
        <div className='col'> <button className="button2"  onClick={this.CambioCortina.bind(this,ids,estado,"Todo") } >start </button></div>
        <p style={{color:"#65CAE7"}}>{this.state.Cortinas[i].Nombre}</p>
          </div>
          </div>
          </div> )
          //nombre en las luces subir imagen , y acrulizar estados , coenctarse desde otros lados  ,MODAL , socket io 
      }
      if (this.state.Cortinas[i].Estado == "Semi"){
        auxCOR.push( <div className="row" key = {i}> <div key = {i} className="col-md-auto" id="CortinaSemi">
           <img   src={process.env.PUBLIC_URL + '/Images/CortinaSemi.png'} alt='Cortina' width='150' />  </div> 
        <div className="col-md-auto"> 
        <div className='container'>
        <div className='col'> <button className="button2"  onMouseDown={this.on.bind(this,ids,estado,"Arriba")} onMouseUp={this.off.bind(this)}>🢁</button> </div>
        <div className='col'> <button className="button2" onMouseDown={this.on.bind(this,ids,estado,"Abajo")} onMouseUp={this.off.bind(this)}>🢃</button> </div>
        <div className='col'> <button className="button2"   type="button" data-toggle="modal" data-target="#ModalCortina" >start </button></div>
        <p style={{color:"#65CAE7"}}>{this.state.Cortinas[i].Nombre}</p>
          </div>
          </div>
                      <div className="modal fade" id="ModalCortina" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog" role="document">
                          <div className="modal-content">
                            <div className="modal-header">
                              <h5 className="modal-title" id="exampleModalLabel" style={{color:"black"}}>Cuarto de {nombre}</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                 <span aria-hidden="true">&times;</span>
                                 </button>
                            </div>
                            <div className="modal-body" style={{color:"rgb(94, 100, 105)"}}>
                              Desea Abir Totalmente la Cortina o  Cerrarla completamente
                            </div>
                            <div style={{textAlign:"center"}}>
                              <button type="button" className="button2" data-dismiss="modal" onClick={this.CambioCortina.bind(this,ids,estado,"Todo","Subir") }>Subir</button>
                              <button type="button" className="button2" data-dismiss="modal" onClick={this.CambioCortina.bind(this,ids,estado,"Todo","Bajar") }>Bajar</button>
                            </div>
                          </div>
                        </div>
                      </div>
          </div>
        
         )
      }
      if (this.state.Cortinas[i].Estado == "Cerrado"){
 
        auxCOR.push(<div className="row" key = {i}> <div key = {i} id="CortinaCerrado" className="col-md-auto">  
        
        <img   src={process.env.PUBLIC_URL + '/Images/CortinaCerrada.png'} alt='Cortina' width='150' />  </div> 
        <div className="col-md-auto"> 
        <div className='container'>
        <div className='col'> <button className="button2"  onMouseDown={this.on.bind(this,ids,estado,"Arriba")} onMouseUp={this.off.bind(this)}>🢁</button> </div>
        <div className='col'> <button className="button2" onMouseDown={this.on.bind(this,ids,estado,"Abajo")} onMouseUp={this.off.bind(this)}>🢃</button> </div>
        <div className='col'> <button className="button2"  onClick={this.CambioCortina.bind(this,ids,estado,"Todo") } >start </button></div>
      <p style={{color:"#65CAE7"}}>{this.state.Cortinas[i].Nombre}</p>

          </div>
          </div>

        
        
        </div>)
      }
      if (this.state.Modif==true)
      {
        auxCOR.push(<div className='col sm-4' key ={"modcontrol"+i}><a href={linkmodcor}><button className ="btn btn-warning" key="M" style={{color:"#fff"}}>Modificar</button></a> <button key="E" className='btn btn-danger' onClick={this.eliminarFuncCortina.bind(this,this.state.Cortinas[i].IdCortina,this.state.Cortinas[i].Nombre)} >Eliminar</button></div>); 
      }
      else
      {
         VariableModificacion=<h1> {nombre}</h1>
      }
    }

    if (this.state.Modif==true)
  {
    VariableModificacion=<button key="Change" type="button" className="btn btn-light" name='salir' style={{fontSize:55}}  onClick={this.ModifPress.bind(this)} >Salir</button>;
  }
  contenedorCortinas.push(<div key="cor" className="container"> <div className="row"> {auxCOR}</div>  </div>)




      return(
        <div >
             
     
   
        {this.state.Existe=="" && this.state.ComprobarContra==""&&
<div id="CuartoMenu" >



<nav className="navbar navbar-dark bg-dark"> 
            <div className="dropdown">
               
                <div className="dropdown-menu" id="bg-dark" aria-labelledby="dropdownMenuButton">
                    <div className="bg-dark p-4">
                        <h4 className="text-white">Menu</h4>
                            
                       <a href={linkmodificacionCuarto}> <button type="button" className="btn btn-light">Modificar  Cuarto</button>  </a>
                            <a href={linkagregarluz}><button type="button" className="btn btn-dark"   >Agregar Luz</button></a>
                            <a href={linkagregarcortina}><button type="button" className="btn btn-light">Agregar Cortina</button>  </a>
                            <a href={linkagregarControl}><button type="button" className="btn btn-dark">Agregar Control</button>  </a>
                            <button type="button" className="btn btn-light" onClick={this.ModifPress.bind(this)}>Modificar  dispositivos</button>
                    </div>
                </div>
                 
                 <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        
                            <span className="navbar-toggler-icon"></span>
                               </button>

                               </div>
                               <a href="/main"><button type="button" className="btn btn-dark">Home </button></a>
                               
                               <img  className="Logo" src={process.env.PUBLIC_URL + '/Images/Escudo.png'} alt='Escudo' width='60'/>
                 </nav>
          
                



          
                 
      <div className="container" style={{marginLeft:"0px",marginRight:"0px"}} >

      
        
      
      
        <div className="row" >
          <div className="col-sm-4" >
            <div className="container" id='height' style={{textAlign:"center",marginTop:"0px"}}>
              <div className="row align-items-start" style={{justifyContent:"center"}} id="Foto">
                <div className="col">
                <img src={process.env.PUBLIC_URL + linkfondo} alt='Fondo'  className="rounded-circle" width='200'/>
                </div>
                <div className="w-100"></div>
                
              </div>
              <div className="dropdown-divider"></div>
              <div className="row align-items-center" style={{justifyContent:"center"}} id="opciones">
                {/* <h1>hola  llegaste cuarto :<div style={{float:"right"}}><h2 style={{color:"rgb(172, 37, 60)"}}>{nombre}</h2> </div></h1> */}
                <div className="w-100"></div>
                <div><h2 style={{fontSize:35,color:"#97faf2"}}>opciones:</h2></div>
                <div className="w-100"></div>
                <h3>Id:</h3><h3 style={{color:"red"}} onClick={this.click.bind(this)} >   {this.props.match.params.date}</h3> 
                <p>4Opciones ,Temporizador,Alarma (hora de encendidoApagado),Encender Todo,Apagar todo  muy aparte tendra el cuarto camaras y un sonos por cuarto</p>
              </div>
              <div className="dropdown-divider"></div>
              
          
              <div className="row align-items-end" id="Estados-Disp" style={{justifyContent:"center"}}>
                <h5 style={{fontSize:35,color:"black"}}>estados dispositivos:</h5>
                {/* importante el w100 */}
                
                <div className="col">
                <p># De Dispositivos :{this.state.Dispositivos }</p>
                
                </div>
                
                <li>con map pones aqui los focos y cortinas abeirtos y etc </li>
          
              </div>
            </div>
          </div>
        
        
        
        {/* <div className="row justify-content-start"> */}
        <div className="col" style={{justifyContent:"center",alignItems:"center"}}>
        <div className="App">{VariableModificacion}</div>
        {contenedorLuces}
        {contenedorCortinas}
        {contenedorControles}
        {ModalControl}
        {/* </div> */}
        </div>
        </div>
        </div>
        </div>
  
        
        
        }
        {this.state.Existe==""&& this.state.ComprobarContra!="" && 
        
        <div className="CuartoMenu"> 
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" style={{color:"black"}}>Ingrese Contrasenha</h5>
            </div>
            <div className="modal-body">
              <input type="password" name="ContraIngresada"  onChange={this.Contra.bind(this)} onKeyPress={this.Contrapress.bind(this)} value={this.state.ContraIngresada} >
                
              </input>
              <button className="button"  onClick={this.compro.bind(this,this.state.ContraIngresada)}>Entrar</button>

            </div>
            
          </div>
        </div>
        </div>
      
        }
        {this.state.Existe=="No"&&<h2 style={{color:"red"}}>No existe Cuarto</h2>}
      
    

      
        
        </div>
      )
    }
  }

  export default CuartosVar;