import React from 'react';
import '../App.css';

import axios from 'axios';
import cors from 'cors';
import ipFunc from '../ipFunc.json'
import {
    BrowserRouter as Router,
    Switch,
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
    mod:false
}

   
    
}
componentDidMount(){
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
         console.log(cant,"cantidad");
         
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

render(){
    const { divs } = this.state;
    const contenedores=[];
    var pos=0;
    var linFondo="";
    var vareliminar=[];

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
                    auxCuadros.push( <div key={pos}  style={{textAlign:"center"}} className="col align-self-start">   <img style={{cursor:"pointer"}} src={process.env.PUBLIC_URL + linFondo} alt='Escudo' width='200' className="rounded-circle"></img>  <h3   style={{color: "red"}}>{this.state.Cuartos.nombre[pos]}</h3> <a href={linmodif}><button type="button" class="btn btn-warning"  style={{color:"#fff"}}>Editar</button></a> <button type="button" onClick={this.eliminarFunc.bind(this,this.state.Cuartos.idcuarto[pos],nombre)} class="btn btn-danger">Eliminar</button>  </div> );
                } 
                else
                {
                    auxCuadros.push( <div key={pos}  style={{textAlign:"center"}} className="col align-self-start"> <Link to ={lin}>  <img style={{cursor:"pointer"}} src={process.env.PUBLIC_URL + linFondo} alt='Escudo' width='200' className="rounded-circle"></img> </Link> <h3  >{this.state.Cuartos.nombre[pos]}</h3>   </div> );

                }
            
            pos=pos+1;
            }
        }

    contenedores.push( <div key={i-1} className="container" style={{padding:"50px"}}>  <div className="row"    >   {auxCuadros} </div></div>)
    }

    if (this.state.mod==true)
    {
        vareliminar= <button type="button" class="btn btn-light" style={{fontSize:55}} key='F' onClick={this.modfunc.bind(this)} id="F">Salir</button>
    }
    else
    {
        vareliminar=<h1  style={{textAlign:"center",color:"white"}} >    Casa  </h1>
    }

    return (
        
        <div  >
     
                {/* Puedes Cambair el App-Header2 por App-header2-1,2,3,4 */}
            <header  className="App-header2-3">
            <nav class="navbar navbar-dark bg-dark"> 
            <div class="dropdown">
               
                <div class="dropdown-menu" id="bg-dark" aria-labelledby="dropdownMenuButton">
                    <div class="bg-dark p-4">
                        <h4 class="text-white">Menu</h4>
                            
                       <a href="/form"> <button type="button" class="btn btn-light">Agregar Cuarto</button>  </a>
                            <button type="button" class="btn btn-dark"  onClick={this.modfunc.bind(this)} id="T">Modificar Cuarto</button>
                            <button type="button" class="btn btn-light"onClick={this.modfunc.bind(this)}  id="T">Eliminar Cuarto</button>  
                    </div>
                </div>
                 
                 <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        
                            <span class="navbar-toggler-icon"></span>
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
    );

                } 
}
export default MainHome