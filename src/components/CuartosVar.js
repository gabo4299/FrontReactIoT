
import React  from 'react';
import axios from 'axios';
 import cors from 'cors';

import SocketIOClient from 'socket.io-client'
import io from 'socket.io-client'

import ipFunc from '../ipFunc.json';
import '../App.css';





class CuartosVar extends React.Component{

  constructor(e){
    
    super(e);
    
this.state={
      Cuarto:undefined,
      idcuarto:this.props.match.params.date,
      Luces:undefined,
      Cortinas:undefined,
      cantLuces:undefined,
      cantCortinas:undefined,
      Existe:"",
      ComprobarContra:"",
      ContraIngresada:"",
      Fondo:'/Images/Escudo.png',
      Modif:false,
      Dispositivos:''
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
              
              if (response.data != "No Existen Luces"){
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
            
              console.log("Luces finally", this.state.Luces);
              
              this.setState({ cantLuces:Luces.length });
    
            

              

            
            });
          let linCorts=ipFunc["ip"]+"/API/Cortinas"
           await axios.get(linCorts)
              .then(response =>{
                
                
                
                if(response.data.IdCuarto!= undefined){
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
              }
                corcopia=Cortinas;
              // if (this.state.Cortinas.length =! undefined){
                this.setState({ cantCortinas:Cortinas.length });
                
              // }
              // else{
              //   this.setState({ cantCortinas:0 });
              // }
                
                
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
  // console.log(this.state.Cuarto,"Este es el cuarto ");
  

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
  
  render(){
    
    
    const linkmodificacionCuarto="/mod/"+this.state.idcuarto
    const linkagregarluz="/formI/"+this.state.idcuarto
    const linkagregarcortina="/formC/"+this.state.idcuarto
    
      var linkfondo=ipFunc['ip']+"/API/Cuarto/"+this.state.idcuarto+"/Fondo";
    
      var nombre;
      if (this.state.Cuarto != undefined  && this.state.Cuarto != "no existe Cuarto"){
          nombre=this.state.Cuarto.nombre;
      }
      else 
      {
        nombre=" ";
      }
      var VariableModificacion=<h1 > {nombre}</h1>
        const { cantLuces } = this.state;
        const contenedorLuces=[];
        
        const auxLUZ=[];
        const contenedorDisp=[];
        const contenedorCortinas=[];
        const auxCOR=[];
        const {cantCortinas}=this.state;

    for (let i =0 ; i <cantLuces ; i++){
      let linkmodluz=this.state.idcuarto +"/ModLuz/"+this.state.Luces[i].IdInterruptor
        if(this.state.Luces[i].Estado == "Apagado"){

        
          auxLUZ.push(<div key={i} className="col"     > <img onClick={this.CambioLuz.bind(this,this.state.Luces[i].Estado,this.state.Luces[i].IdInterruptor,i)} src={process.env.PUBLIC_URL + '/Images/luzApagada.png'} alt='Escudo' width='150' style={{'cursor':"pointer"}}/> <h3 style={{color:"#65CAE7"}}>{this.state.Luces[i].Nombre}</h3>  </div>)
        }
        if(this.state.Luces[i].Estado == "Encendido"){
          auxLUZ.push(<div key={i} className="col"     > <img  onClick={this.CambioLuz.bind(this,this.state.Luces[i].Estado,this.state.Luces[i].IdInterruptor,i)} src={process.env.PUBLIC_URL + '/Images/luzEncendida.png'} alt='Escudo' width='150' style={{'cursor':"pointer"}} /> <h3 style={{color:"#65CAE7"}}>{this.state.Luces[i].Nombre}</h3></div>)
          }
        if (this.state.Modif==true)
        {
          auxLUZ.push(<div   className='col sm-4'> <a href={linkmodluz}> <button  className ="btn btn-warning" style={{color:"#fff"}}>Modificar</button></a> <button className='btn btn-danger'  onClick={this.eliminarFuncLuz.bind(this,this.state.Luces[i].IdInterruptor,this.state.Luces[i].Nombre)}>Eliminar</button></div>)
        }
        
    }
    contenedorLuces.push( <div key="s"  className="container" >  <div className="row">{auxLUZ}</div> </div>);


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
        auxCOR.push(<div className='col sm-4'><a href={linkmodcor}><button className ="btn btn-warning" key="M" style={{color:"#fff"}}>Modificar</button></a> <button key="E" className='btn btn-danger' onClick={this.eliminarFuncCortina.bind(this,this.state.Cortinas[i].IdCortina,this.state.Cortinas[i].Nombre)} >Eliminar</button></div>); 
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





  
// const si = [<div className="container">
        
// <div className="row" style={{textAlign:"center",justifyContent:"center"}}>
// <h1 style={{color:"#97faf2"}}> {nombre}</h1>
// </div>
// <div className="row justify-content-between ">
//   <div className="col-4">
//     <div className="container" id="Foto">
// <img src={process.env.PUBLIC_URL + '/Images/Escudo.png'} alt='Escudo' width='300'/></div>
// <div className="container" id="opciones">
// <h1>hola  llegaste cuarto :  <div style={{float:"right"}}><h2 style={{color:"rgb(172, 37, 60)",float:"right"}}>{nombre}</h2> </div></h1>
// <h2 style={{color:"red"}} onClick={this.click.bind(this)} >{this.props.match.params.date}</h2></div>

// <div className="container" id="Estados-Disp" style={{justifyContent:"center"}}>
//   <h5>estados dispositivos</h5>

// </div>
// </div>



// {/* <div className="row justify-content-start"> */}
// <div className="col" style={{justifyContent:"center",alignItems:"center"}}>
// {contenedorLuces}
// {contenedorCortinas}
// {/* </div> */}
// </div>
// </div>
// </div>
// ]


      return(
        <div className="App">
             
     
   
        {this.state.Existe=="" && this.state.ComprobarContra==""&&
<div className="App">



<nav className="navbar navbar-dark bg-dark"> 
            <div className="dropdown">
               
                <div className="dropdown-menu" id="bg-dark" aria-labelledby="dropdownMenuButton">
                    <div className="bg-dark p-4">
                        <h4 className="text-white">Menu</h4>
                            
                       <a href={linkmodificacionCuarto}> <button type="button" className="btn btn-light">Modificar  Cuarto</button>  </a>
                            <a href={linkagregarluz}><button type="button" className="btn btn-dark"   >Agregar Luz</button></a>
                            <a href={linkagregarcortina}><button type="button" className="btn btn-light">Agregar Cortina</button>  </a>
                            <button type="button" className="btn btn-dark" onClick={this.ModifPress.bind(this)}>Modificar  dispositivos</button>
                    </div>
                </div>
                 
                 <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        
                            <span className="navbar-toggler-icon"></span>
                               </button>

                               </div>
                               <a href="/main"><button type="button" className="btn btn-dark">Home </button></a>
                               
                               <img  className="Logo" src={process.env.PUBLIC_URL + '/Images/Escudo.png'} alt='Escudo' width='60'/>
                 </nav>
          
                

<div className="CuartoMenu"> 

          

      <div id="containerprincipal" >

      <div>{VariableModificacion}</div>
        
      
        <div className="row" style={{textAlign:"center",justifyContent:"center"}}>
          
        </div>
        <div className="row justify-content-between " >
          <div className="col-4">
            <div className="container" id='height100' style={{textAlign:"center"}}>
              <div className="row align-items-start" style={{justifyContent:"center"}} id="Foto">
                <img src={process.env.PUBLIC_URL + linkfondo} alt='Fondo'  className="rounded-circle" width='200'/>
              </div>
              
              <div className="row align-items-center" style={{justifyContent:"center"}} id="opciones">
                <h1>hola  llegaste cuarto :<div style={{float:"right"}}><h2 style={{color:"rgb(172, 37, 60)"}}>{nombre}</h2> </div></h1>
                <div><h2 style={{fontSize:35,color:"black"}}>opciones:</h2></div>
                <div className="w-100"></div>
                <h3>Id:</h3><h3 style={{color:"red"}} onClick={this.click.bind(this)} >   {this.props.match.params.date}</h3> 
              </div>
              <div className="w-100"></div>
          
              <div className="row align-items-end" id="Estados-Disp" style={{justifyContent:"center"}}>
                <h5 style={{fontSize:35,color:"black"}}>estados dispositivos:</h5>
                {/* importante el w100 */}
                <div className="w-100"></div>
                
                <p># De Dispositivos :{this.state.Dispositivos }</p>
                
                <li>con map pones aqui los focos y cortinas abeirtos y etc </li>
          
              </div>
            </div>
          </div>
        
        
        
        {/* <div className="row justify-content-start"> */}
        <div className="col" style={{justifyContent:"center",alignItems:"center"}}>
        {contenedorLuces}
        {contenedorCortinas}
        {/* </div> */}
        </div>
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