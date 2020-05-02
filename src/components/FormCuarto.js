import React  from 'react';
import axios from 'axios';
import cors from 'cors';

import ipFunc from "../ipFunc.json"
import logo from '../logo.svg';
import '../App.css';

class FormCuarto extends React.Component {

    
    state = {
        idcuarto: '',
        nombre: '',
        fondo:'No',
        contrasenha: '',
        Seleccion:'No',
        linkfondonw:ipFunc["ipapi"]+"/Cuarto/Fondo"
      }
    
      onChange(e){
        this.setState({  [e.target.name]:e.target.value });
      }
   
    
      handleSubmit = event => {
        event.preventDefault();
    
        const Cuarto = {
          idcuarto: this.state.idcuarto,
          nombre: this.state.nombre,
          fondo: this.state.fondo,
          contrasenha: this.state.contrasenha
    
        };
    
        const c = new FormData();
        c.append('fondo',this.state.fondo)
        c.append('nombre',this.state.nombre)
        c.append('idcuarto',this.state.idcuarto)
        c.append('contrasenha',this.state.contrasenha)
        c.append("Seleccion",this.state.Seleccion)
        c.append("idcasa",1)
        
        let config = {headers: {'Access-Control-Allow-Origin': "*",'Content-Type': 'multipart/form-data' }};
        let linknew=ipFunc["ipapi"]+"/Cuarto/add"
        axios.post(linknew,  c , config)
          .then(res => {
            //console.log(res);
            console.log(res.data);
            alert(res.data);
          })

        
      }
dose(e){
  console.log("data",e.target.files[0])
  if(e.target.files[0]!=undefined){
  this.setState({fondo:e.target.files[0],
                  Seleccion:'Si'

  })
}
}
render(){
  let linkfondoimg=ipFunc["ipapi"]+'/Cuarto/Fondo'
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
        
      <img src={process.env.PUBLIC_URL + this.state.linkfondonw} alt='Escudo' width='400'/>
      
        <form onSubmit={this.handleSubmit} className="Formulario" encType = "multipart/form-data">
         <div >
         <h2>
          Formulario Cuarto
        </h2>
    
           <input  id = "form" placeholder="ID Cuarto" type="text" value={this.state.idcuarto} name="idcuarto" onChange={this.onChange.bind(this)} />
           </div>
           <div id="separador">

           <input id="form" placeholder="Nombre" type="text" name="nombre"   value={this.state.nombre} onChange={this.onChange.bind(this)}/>
           </div>


           {/* <input id = "form" placeholder="Fondo" type="text" name="fondo"  value={this.state.fondo} onChange={this.onChange.bind(this)} /> */}
           <div id="separador">

           <input id = "form" placeholder="Contrasenha" type="password" name="contrasenha"   value={this.state.contrasenha} onChange={this.onChange.bind(this)}/>
           </div>
           
           <div  style={{justifyContent:"center"}}>

         <input type = "file"  name="fondo"   accept="image/png, .jpeg, .jpg, image/gif" onChange={this.dose.bind(this)}/>

      </div>
           

             <div id="separador">
            <input className="button" type="submit" value="Submit" className="button" onChange={this.onChange}/>
            </div>
            
          </form>

          
      </header>
    </div>


    );

}
}

export default FormCuarto