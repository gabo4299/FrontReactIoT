import React from 'react';
import '../App.css';
import Switch from "react-switch";
import axios from 'axios';

import ipFunc from '../ipFunc.json'
import {
    BrowserRouter as Router,
    Route,
    Link,
    useParams
  }from "react-router-dom";
import { relative } from 'path';

class MainHome extends React.Component{
constructor(e){
    super(e);
    
this.state={
    Cuartos:[],
    NroCuartos:0,
    divs:0,
    mod:false,
    Casa:0,
    IdCasa:1,IdRasp:1,Conf:false,IoT:0,CantPWM:0,CantLuz:0,NombreCasa:"",
    P1:"",P2:"",P3:"",P4:"",P5:"",P6:"",P7:"",P8:"",P9:"",P10:"",P11:"",L1:"",L2:"",
    err1:0,err2:0,err3:0,
    Rasps:undefined,
    Nodes:undefined,
    Esp32s:undefined,
    Lectores:undefined,
    Descripcion:undefined
}
this.switchchange = this.switchchange.bind(this);

   
    
}

EliminarCasa(){
   var  s="Desea Eliminar la casa y todos sus Configuraciones?"
    if (window.confirm(s))
    {
        
        let lin=ipFunc["ipapi"]+"/Casa/1/del";
        axios.delete(lin)
        .then(res=>{
            alert(res.data)
            if (res.data =="Eliminado Satisfactoriamente"){
                
                this.setState({
                    Casa:"No Existe Casa"
                })
            }
        })
    }
    else{
        alert("Ok")
    }
}
componentDidMount(){
    let linkCasa =ipFunc["ipapi"]+"/Casa/1"
    axios.get(linkCasa)
    .then (response =>
        {
            const  a=JSON.stringify(response.data);
        var aux = 0;
         console.log("Casa",response.data);
    
            console.log("Casa");
            this.setState({
                Casa:response.data
             });
         


         
        })
    let linkget =ipFunc["ipapi"]+"/Cuartos"
    axios.get(linkget)
     .then(response => {
            
        const  a=JSON.stringify(response.data);
        var aux = 0;
         console.log(response.data);
         if (response.data.idcuarto != undefined)
         {
            var aux=response.data.idcuarto.length;
         }
         
         
        //console.log(5%4 , "modulo") 

        
        this.setState({
            Cuartos:response.data,
            NroCuartos:aux
         });

         
         
         var cant = ((this.state.NroCuartos)/3) ; 
        //  console.log(cant,"cantidad");
         
         if  (cant <= 1 && cant!=0){
             this.setState({
                 divs:1
             })
         }
         else {
             if (cant > 1 ){
                 var redondeo=Math.round(cant);

                 //si redondeo cant < redondeo  se pone la cantidad de redndeo sino redondeo +1 

                 if (cant<=redondeo)
                 {
                     this.setState({
                         divs:(redondeo)
                     })
                 }
                 else{
                     if (cant>redondeo)
                     {
                        this.setState({
                            divs:(redondeo+1)
                        })
                     }
                 }
             }
     
         }
      
})
    let Rasps=[]
    let Nodes=[]
    let Esp32s=[]
    let Lectores=[]
    let linkNodes=ipFunc["ipapi"]+"/CPU/Nodes"
    let linkRasps=ipFunc["ipapi"]+"/CPU/Rasps"
    let linkEsp32=ipFunc["ipapi"]+"/CPU/Esp32s"
    let linkLecs=ipFunc["ipapi"]+"/LecIRS"
    axios.get(linkRasps)
    .then(response =>
        {
            console.log(response.data)
            var x=0
            if(response.data.IdCasa!= undefined){
                
                for (let  i = 0 ; i < response.data.IdCasa.length ; i++){
                    Rasps.push({
                        IdRasp:response.data.IdRasp[i],
                        Cant:response.data["Cantidad Pines Ocupados"][i],
                        Descripcion:response.data.Descripcion[i] ,
                    })
                    
                }
                
                this.setState({Rasps})
            }
        })
        axios.get(linkNodes)
        .then(response =>
            {
                var x=0
                if(response.data.IdCasa!= undefined){
                    for (let  i = 0 ; i < response.data.IdCasa.length ; i++){
                        Nodes.push({
                            IdNode:response.data.IdNode[i],                            
                            Cant:response.data["Cantidad Pines Ocupados"][i],
                            Descripcion:response.data.Descripcion[i] ,
                        })
                        
                    }
                    
                    
                    this.setState({Nodes})
                }
            })
            axios.get(linkEsp32)
            .then(response =>
                {
                    var x=0
                    if(response.data.IdCasa!= undefined){
                        for (let  i = 0 ; i < response.data.IdCasa.length ; i++){
                            Esp32s.push({
                                IdEsp32:response.data.IdEsp32[i],  
                                Cant:response.data["Cantidad Pines Ocupados"][i] ,
                                Descripcion:response.data.Descripcion[i] ,
                            })
                            
                        }
                        
                        
                        this.setState({Esp32s})
                    }
                })
    

            axios.get(linkLecs)
            .then(response =>
                {
                    
                    var x=0
                    
                    if(response.data.IdCasa!= undefined){
                        
                        for (let  i = 0 ; i < response.data.IdCasa.length ; i++){
                            Lectores.push({
                                IdLec:response.data.IdLec[i],
                                Dispositivo:response.data.Dispositivo[i],
                                IdDisp:response.data.IdDisp[i],
                                Pin:response.data.Pin[i]
                                
                            })
                            
                        }
                        console.log("Lectores",response.data)
                        
                        this.setState({Lectores})
                    }
                })

}
onChange(e){
    if (e.target.name == "CantPWM" || e.target.name == "CantLuz" )
    {
        console.log("El valor es :" , e.target.value)
    }
    this.setState({
      [e.target.name]:e.target.value
    });
  }



modfunc(e)
{
    console.log("Cambio el id es ",e.target.id)
    if (e.target.id=="T")
    {
        console.log("Cambio tru")
        this.setState({mod:true})
    }
    if (e.target.id=="F")
    {
        console.log("Cambio fal")
        this.setState({mod:false})
    }
}

eliminarFunc(ID,nombre)
{
    var a ;
    let no="Esta Seguro de Elimianar el cuarto "+nombre;
    let lin=ipFunc["ipapi"]+"/Cuarto/"+ID+"/del"
    a=window.confirm( no);
    
    if(a==true){
        axios.delete(lin)
        window.location.reload(false);
    }
    else{
        console.log("NO Confirmo")
    }

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
 handleSubmit = event => {
    event.preventDefault();
    var IoTs
    if (this.state.err1 == 0 && this.state.err2==0 && this.state.err3 ==0 )
    {
        if (this.state.P1 != "" && this.state.P2 != "" && this.state.P3 !="" )
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
                  console.log("SI entras a la condicion")
                
                    IoTs=[ parseInt (this.state.P1), parseInt (this.state.P2), parseInt (this.state.P3)]
                
              }
          }
          else 
          {
            IoTs=0
              
          }
    }
    var str="El modulo IoT es :" + IoTs  +"Cantidad de pines" +IoTs.length + " y la cantidad de luces : "+this.state.CantLuz +" PWM: "+this.state.CantPWM
    if (window.confirm(str)){
    const Casa = {
      IdCasa: this.state.IdCasa,
      IdRasp:this.state.IdRasp,
      Nombre:this.state.NombreCasa,
      IoT:IoTs,
      CantidadPWM:this.state.CantPWM,
      CantidadLuz:this.state.CantLuz,
      Descripcion:this.state.Descripcion

    };
    let config = {headers: {'Access-Control-Allow-Origin': "*"}};
        let lin=ipFunc["ipapi"]+"/Casa/add";
        let lin2=ipFunc["ipapi"]+"/CPU/Rasp/add";
        
        axios.post(lin,  Casa , config)
          .then(res => {
            //console.log(res);
            console.log(res.data);
            alert(res.data);
            if (res.data == "Creado Satisfactoriamente"){
                this.setState({
                    Casa:1
                })
            }
          })
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
DeleteRasp(e){
    let lin = ipFunc["ipapi"]+"/CPU/Rasp/"+e.target.value+"/del";
    
    var s="Desea Elimianar Raspberry con "+this.state.Rasps[e.target.name].Cant+" pines ocupados"
            if (window.confirm(s))
            {
                axios.delete(lin)
                .then(response=>
                    {
                        
                        alert(response.data)
                    })
            }
    
}
DeleteEsp32(e){
    let lin = ipFunc["ipapi"]+"/CPU/Esp32/"+e.target.value+"/del";
    var s="Desea Elimianar Esp32 con "+this.state.Esp32s[e.target.name].Cant+" pines ocupados"
    if (window.confirm(s))
    {    axios.delete(lin)
        .then(response=>
            {
                alert(response.data)
            })}
}
DeleteNode(e){
    let lin = ipFunc["ipapi"]+"/CPU/Node/"+e.target.value+"/del";
    var s="Desea Elimianar Node con "+this.state.Nodes[e.target.name].Cant+" pines ocupados"
    if (window.confirm(s))
    {    axios.delete(lin)
        .then(response=>
            {
                alert(response.data)
            })}
}
DeleteLec(e)
{
    let lin = ipFunc["ipapi"]+"/LecIR/"+e.target.value+"/del";
    axios.delete(lin)
        .then(response=>
            {
                alert(response.data)
            })
}
showAlert(e)
{
    console.log( "El iot es ",this.state.IoT)
    alert( "El iot es ",this.state.IoT)
}
render(){
    const casista = this.state.Casa;
    var IoTcomp;
    const { divs } = this.state;
    
    var rasps=[]
    var nodes=[]
    var esp32s=[]
    var lectores=[]
    if (this.state.Rasps != undefined)
    {
        
        for (let i = 0 ; i <this.state.Rasps.length; i++ ){
            var id = this.state.Rasps[i].IdRasp
            if (this.state.Rasps[i].IdRasp !=1)
            {
               
                rasps.push(<div key={i} className="col" > <div><img  src={process.env.PUBLIC_URL + '/Images/Rasp.png'}  width='50'/> <button className="btn-danger" name={i} value={id} onClick={this.DeleteRasp.bind(this)}> Eliminar</button></div><div> <li style={{color:"black"}}> Raspbery Id:{this.state.Rasps[i].IdRasp} {this.state.Rasps[i].Descripcion}</li></div> </div>)
            }
        }
    }
    if (this.state.Nodes != undefined)
    {
        
        for (let i = 0 ; i <this.state.Nodes.length; i++ ){
            var id = this.state.Nodes[i].IdNode
          
                         
                nodes.push(<div key={i} className="col" > <div><img  src={process.env.PUBLIC_URL + '/Images/Node.jpg'}  width='100'/> <button className="btn-danger" name={i} value={id} onClick={this.DeleteNode.bind(this)}> Eliminar</button></div><div> <li style={{color:"black"}}> Node Id:{this.state.Nodes[i].IdNode} {this.state.Nodes[i].Descripcion} </li></div> </div>)
        }
    }
    if (this.state.Esp32s != undefined)
    {
        
        for (let i = 0 ; i <this.state.Esp32s.length; i++ ){
            var id = this.state.Esp32s[i].IdEsp32
          
                         
                esp32s.push(<div key={i} className="col" > <div><img  src={process.env.PUBLIC_URL + '/Images/Esp32.png'}  width='150'/> <button className="btn-danger" name={i} value={id} onClick={this.DeleteEsp32.bind(this)}> Eliminar</button></div><div> <li style={{color:"black"}}> Esp32 Id:{this.state.Esp32s[i].IdEsp32} {this.state.Esp32s[i].Descripcion}</li></div> </div>)
        }
    }
    if (this.state.Lectores != undefined)
    {
        
        for (let i = 0 ; i <this.state.Lectores.length; i++ ){
            var id = this.state.Lectores[i].IdLec
            
                lectores.push(<div key={i} className="col" > <div><img  src={process.env.PUBLIC_URL + '/Images/Lector.jpg'}  width='100'/> <button className="btn-danger" name={i} value={id} onClick={this.DeleteLec.bind(this)}> Eliminar</button></div><div> <li style={{color:"black"}}> Lector en {this.state.Lectores[i].Dispositivo}  id : {this.state.Lectores[i].IdDisp} en pin: {this.state.Lectores[i].Pin}  </li></div> </div>)
        }
    }
    var modalDelDisp=<div className="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
    <div className="modal-dialog modal-dialog-centered" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title" id="exampleModalLongTitle" style={{color:"black"}} >Eliminar</h5>
          <button type="button" className="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
            <div className ="container">
          <div  className= "row">
              <div className= "col">
                <h6 style={{color:"black"}}> Raspberrys</h6>
                
                    {rasps}
                    </div>
                
                <div className="col">
                <h6 style={{color:"black"}}> Nodes </h6>
                    {nodes}
                </div>
                <div className="col">
                <h6 style={{color:"black"}}> Esp32</h6>
                    {esp32s}
                </div>          
                <div className="col">
                <h6 style={{color:"black"}}> Lectores IR</h6>
                    {lectores}
                </div>                      
              
          </div>
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
          
        </div>
      </div>
    </div>
  </div>
    const contenedores=[];
    var pos=0;
    var linFondo="";
    var vareliminar=[];
    var E1;
    var E2;
    var E3;
    if (this.state.err1 == 1 )
    {
        E1=<li style={{color:"red"}}>Error Pines Iguales Revisar porfavor</li>
    }
    else 
    {
        E1=<h1 style ={{display:"none"}}></h1>
    }
    if (this.state.err2 == 1 )
    {
        E2=<li style={{color:"red"}}>Error Pines Iguales Revisar porfavor</li>
    }
    else 
    {
        E2=<h1 style ={{display:"none"}}></h1>
    }
    if (this.state.err3 == 1 )
    {
        E3=<li style={{color:"red"}}>Error Pines Iguales Revisar porfavor</li>
    }
    else 
    {
        E3=<h1 style ={{display:"none"}}></h1>
    }
    var Existe_casa = <div></div>;
    for (let i =1 ; i <=divs ; i++){
        const auxCuadros=[];
        for (let j =0 ; j <3 ; j++){
            if (this.state.Cuartos.nombre[pos]!=undefined)
            {
                var nombre=this.state.Cuartos.nombre[pos];
                var linFondo=ipFunc["ipapi"]+"/Cuarto/"+this.state.Cuartos.idcuarto[pos]+"/Fondo";
                var lin="cuarto/"
                lin=lin+this.state.Cuartos.idcuarto[pos];
                var linmodif="/mod/"+this.state.Cuartos.idcuarto[pos];
                //aqui ayuda co el text aling center

                if(this.state.mod==true)
                {
                    auxCuadros.push( <div key={pos}  style={{textAlign:"center"}} className="col align-self-start">   <img style={{cursor:"pointer"}} src={process.env.PUBLIC_URL + linFondo} alt='perfil' width='200' className="img-thumbnail"></img>  <h3   style={{color: "red"}}>{this.state.Cuartos.nombre[pos]}</h3> <a href={linmodif}><button type="button" className="btn btn-warning"  style={{color:"#fff"}}>Editar</button></a> <button type="button" onClick={this.eliminarFunc.bind(this,this.state.Cuartos.idcuarto[pos],nombre)} className="btn btn-danger">Eliminar</button>  </div> );
                } 
                else
                {
                    auxCuadros.push( <div key={pos}  style={{textAlign:"center"}} className="col align-self-start"> <Link to ={lin}>  <img style={{cursor:"pointer"}} src={process.env.PUBLIC_URL + linFondo} alt='perfil' width='200' className="rounded-circle"></img> </Link> <h3  >{this.state.Cuartos.nombre[pos]}</h3>   </div> );

                }
            
            pos=pos+1;
            }
        }

    contenedores.push( <div key={i-1} className="container" style={{padding:"50px"}}>  <div className="row"    >   {auxCuadros} </div></div>)
    }
    
    if (this.state.mod==true)
    {
        vareliminar= <button type="button" className="btn btn-light" style={{fontSize:55}} key='F' onClick={this.modfunc.bind(this)} id="F">Salir</button>
    }
    else
    {
        vareliminar=<h1  style={{textAlign:"center",color:"white"}} >    {casista["Nombre"]} </h1>
    }
    if (this.state.Conf == 0)
    {
        IoTcomp=<h4>Sin Modulo IoT</h4>
    }
    else{
        IoTcomp=<div className="row"> <div className="col"><img  src={process.env.PUBLIC_URL + '/Images/Rasp.png'}  width='250' /></div>
        <div className = "col">
            <h3>Raspberry Central</h3>

           <div className="col"> 
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
            <div className="col">
                {/* <input  id="form2" placeholder="# Puertos de PWM IoT" type="text" value={this.CantPWM} name="CantPWM" onChange={this.onChange.bind(this)} /> */}
                <h6># Puertos de PWM IoT</h6>
                <select   id="form2"  name="CantPWM"  value={this.state.CantPWM} onChange={this.onChange.bind(this)} >            
            <option name="CantPWM" value = "16">16</option>
            <option name="CantPWM" value = "32">32</option>
            <option name="CantPWM" value = "48">48</option>
            </select>
            </div>
            <div className="col">
                    <h4>Pines IoT</h4> <h5>minimamente elegir 3  a excepcion del pin 2 y 3 </h5>
            </div>
            <div className="col">
                        <div><span style ={{fontSize:"15px"}}>Shift Reg</span></div>
                    <input id="formIoT"   min="0" placeholder="Pin 1 IoT " type="number" value={this.P1} name="P1" onChange={this.defIoT.bind(this)} />
                    <input id="formIoT"   min="0" placeholder="Pin 2 IoT" type="number" value={this.P2} name="P2" onChange={this.defIoT.bind(this)} />
                    <input id="formIoT"   min="0" placeholder="Pin 3 IoT" type="number" value={this.P3} name="P3" onChange={this.defIoT.bind(this)} />
                    
                    {E1}
                    </div>
             <div className="col">   
                    <div><span style ={{fontSize:"15px"}}>Lectores 1</span></div>
                    <input id="formIoT" min="0" placeholder="Pin 4 IoT" type="number" value={this.P4} name="P4" onChange={this.defIoT.bind(this)} />
                    <input id="formIoT" min="0" placeholder="Pin 5 IoT" type="number" value={this.P5} name="P5" onChange={this.defIoT.bind(this)} />
                    <input id="formIoT" min="0" placeholder="Pin 6 IoT" type="number" value={this.P6} name="P6" onChange={this.defIoT.bind(this)} />
                    <input id="formIoT"   min="0" placeholder="Pin 7 IoT" type="number" value={this.P7} name="P7" onChange={this.defIoT.bind(this)} />
                    <input id="formIoT"   min="0" placeholder="Lec 1 IoT" type="number" value={this.L1} name="L1" onChange={this.defIoT.bind(this)} />
                    {E2}</div>
             <div className="col">   
                    <div><span style ={{fontSize:"15px"}}>Lectores 2</span></div>
                    <input id="formIoT" min="0" placeholder="Pin 8 IoT" type="number" value={this.P8} name="P8" onChange={this.defIoT.bind(this)} />
                    <input id="formIoT" min="0" placeholder="Pin 9 IoT" type="number" value={this.P9} name="P9" onChange={this.defIoT.bind(this)} />
                    <input id="formIoT" min="0" placeholder="Pin 10 IoT" type="number" value={this.P10} name="P10" onChange={this.defIoT.bind(this)} />
                    <input id="formIoT"   min="0" placeholder="Pin 11 IoT" type="number" value={this.P11} name="P11" onChange={this.defIoT.bind(this)} />
                    <input id="formIoT"   min="0" placeholder="Lec 2 IoT" type="number" value={this.L2} name="L2" onChange={this.defIoT.bind(this)} />
                    {E3}</div>
        </div>
        </div>
    }
    if (this.state.Casa != "No Existe Casa" )
    {
        // console.log("valor casas:",this.state.Casa)
     Existe_casa= <div>
            
            {/* Puedes Cambair el App-Header2 por App-header2-1,2,3,4 */}
           
        <header  className="App-header2-3">
        <nav className="navbar navbar-dark bg-dark"> 
        <div className="dropdown">
           
            <div className="dropdown-menu" id="bg-dark" aria-labelledby="dropdownMenuButton">
                <div className="bg-dark p-4">
                    <h4 className="text-white">Menu</h4>
                        
                   <a href="/form"> <button type="button" className="btn btn-light">Agregar Cuarto</button>  </a>
                        <div  className = "row"><button type="button" className="btn btn-dark"  onClick={this.modfunc.bind(this)} id="T">Modificar Cuarto</button></div>
                        <a href="/formDisp"><button type="button" className="btn btn-light"  >Agregar Dispositivo</button></a>
                        <a href="/formLect"><button type="button" className="btn btn-dark"  >Agregar Lector IR</button></a>
                        <button type="button" className="btn btn-light" data-toggle="modal" data-target="#exampleModalCenter"  >Eliminar Dispositivo</button>
                        
                        
                     
                        <div style ={{padding:"5px"}}></div>
                        <button type="button" className="btn btn-danger"onClick={this.EliminarCasa.bind(this)}  id="T">Eliminar Casa</button>  
                </div>
            </div>
            {modalDelDisp}
             <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    
                        <span className="navbar-toggler-icon"></span>
                           </button>

                           </div>
                           <a href="/main"><button type="button" className="btn btn-dark">Home </button></a>
                           
                           <img  className="Logo" src={process.env.PUBLIC_URL + '/Images/Escudo.png'} alt='Escudo' width='60'/>
             </nav>
        
        
            {vareliminar}
        
        
        <div id = "separador" ></div>
        <div>
       {contenedores}
        </div>

        

        <div className="container">

        </div>

        
           
        </header> 
    </div>
    }
    else 
    {
        Existe_casa = 
        <div>
            
            
                
                <div className = "row" style={{textAlign:"center"}}>
                    <div className="container">
                        <div className = "col" >
                <h1>No se registro Casa </h1>
                <h2>Agregue Una</h2>
                </div>
                <form ref={form=>this.form=form} onSubmit={this.handleSubmit} > 
                <div className = "col">
                
                <input  id="form" placeholder="Nombre" type="text" value={this.NombreCasa} name="NombreCasa" onChange={this.onChange.bind(this)}/>
                </div>
                <div className="col">
                <input  id="form" placeholder="Descripcion Rasp" type="text" value={this.Descripcion} name="Descripcion" onChange={this.onChange.bind(this)}/> 
                </div>
                <div className="col" style={{padding: "40px"}}>
                <label> IoT <Switch onChange={this.switchchange}  checked={this.state.Conf} /></label></div>    
                {IoTcomp}
                <div className = "col">
                 <input className="button" type="submit" value="Submit"  className="button" onChange={this.onChange.bind(this)} /> 
                </div>
                </form>
                </div>
                
                </div>
                
                        
            
            </div>
        
    }
    return (
        <header  className="App-header2-3"> 
        {Existe_casa}
        </header>
    );

                } 
}
export default MainHome