import React, { useDebugValue }  from 'react';
import axios from 'axios';
import cors from 'cors';
import Switch from "react-switch";

import ipFunc from "../ipFunc.json"

import '../App.css';

class FormInterruptor extends React.Component {
constructor (){
    super();


    this.state = {
        IdInterruptor: '',
        IdCuarto: '',
        Pin: '',
        Dimmer: 'No',
        Cuartos:undefined,
        checked:false,
        Nombre:'',
        PinesLibres:undefined
      };
this.switchchange = this.switchchange.bind(this);

    }

    
    

borrar()
{
    this.setState = {
        IdInterruptor: '',
        IdCuarto: '',
        Pin: '',
        Dimmer: ''
     }
}


    componentDidMount() {
        let Cuartos=[];
        const axx=[];
        let linknewcuarto= ipFunc["ipapi"]+"/Cuartos"
        axios.get(linknewcuarto)
          .then(response => {
      
             
              // console.log(response.data);
              axx.au=response.data;
             const b=JSON.stringify(axx.au.idcuarto);
              
             for (let i = 1; i < b.length; i=i+2) {
               Cuartos.push({idcuarto:parseInt((JSON.stringify(axx.au.idcuarto))[i])});
             }
             this.setState({ Cuartos });
          });

          let PinesLibres = []
          let linkpindisp= ipFunc["ipapi"]+"/PinInt"
          axios.get(linkpindisp)
          .then (response =>
            {
              if(response.data != undefined)
              {
                
                for (let i = 0 ; i < ipFunc["NroPinesInt"] ; i++)
                {
                  if (response.data[i] != undefined)
                  {
                    PinesLibres.push({PinLibre: response.data[i]})
                  }

                   
                }
                
                this.setState({ PinesLibres });
              } 
              
            })
      
      }
      onChange(e){
        
        this.setState({

          
        //   [e.target.IdInterruptor]:e.target.value,
          
        //   [e.target.Pin]:e.target.value,
        //   [e.target.Dimmer]:e.target.value,
        //   [e.target.IdCuarto]:e.target.value,
          [e.target.name]:e.target.value
    
        });

        
      }



      cuarts(e){
        //   var p
        // this.state.Cuartos.map(p,i =>{
        // return (<li key={i}> {p.idcuarto}</li>)
        // });
        console.log((this.state.Cuartos) ); 
        
        
        for(let i =0 ; i < (this.state.Cuartos.length); i++ )
        {
            console.log(this.state.Cuartos[i].idcuarto,"asii da");
            
        }
        
        // console.log((this.state.Cuartos[1]).idcuarto );
      }
    
  
    
    
      handleSubmit = event => {
        event.preventDefault();
    
        const Luz = {
          IdInterruptor: this.state.IdInterruptor,
          IdCuarto: this.state.IdCuarto,
          Pin: this.state.Pin,
          Dimmer: this.state.Dimmer,
          Nombre:this.state.Nombre
    
        };
    
        //AYUDA CON EL LUGAR DODNE SE PONDRA EL INTERRUPTOR 
        if(Luz.Pin == "" || Luz.Pin == " ")
        {
          alert("Error de Pin Seleccione un pin Valido")
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
      switchchange(checked) {
        // console.log(checked)
        this.setState({ checked });
        if (checked==true){
          this.setState({
            Dimmer:"Si"
          })
        }
        else
        {
          this.setState({
            Dimmer:"No"
          })
        }
        
      }

      leerstadotmr(){
        console.log(this.state.checked);
      }
render(){
    const { Cuartos } = this.state;
    const { PinesLibres } = this.state;
  
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
   
        <div  className="Formulario"> 
        <h2>
          Formulario Luz
        </h2>
        <form ref={form=>this.form=form} onSubmit={this.handleSubmit} >
         
            <div id='form'>
           <input  id="form" type="text"placeholder="ID del interruptor" value={this.state.IdInterruptor}  name="IdInterruptor" onChange={this.onChange.bind(this)} />
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
           <input  id="form" type="text" name="Nombre"  placeholder="Nombre" value={this.state.Nombre} onChange={this.onChange.bind(this)} />
           
           </div>
                
           <div id="separador">
           <select   id="form"  name="Pin"  value={this.state.Pin} onChange={this.onChange.bind(this)} >
            <option name="Pin" value = ''>Pin</option>
           {
       PinesLibres && PinesLibres.length && PinesLibres.map((p,index) => {
         return (<option key={index} name="Pin"  value={p["PinLibre"]}  onChange={this.onChange.bind(this)} >{p["PinLibre"]}</option>)
         })
        }
          
           </select>
           {/* <input  id="form" type="text" name="Pin"  placeholder="Pin" value={this.state.Pin} onChange={this.onChange.bind(this)} /> */}
           </div>
           <div id="separador">

           <label style={{color:"#7A7270"}}>Dimmer</label>
  
  <div>          <Switch onChange={this.switchchange}  checked={this.state.checked} /></div> 
           {/* <input id="form" type="text" name="Dimmer"  placeholder ="Dimmer" value={this.state.Dimmer} onChange={this.onChange.bind(this)}/> */}
           </div>
           <div >
            <input type="submit" value="Submit" className="button" onChange={this.onChange.bind(this)}   />
            </div>
            
            
        
            
        
      
            
            

            
          </form>
          </div>
          <div> 
              hola 
              {
       Cuartos && Cuartos.length && Cuartos.map(p => {
         return (<p key='s'>{p["idcuarto"]}</p>)
         })

         
        }

        {/*
             PinesLibres && PinesLibres.length && PinesLibres.map(p => {
              return (<p  >{p["PinLibre"]}</p>)
              })
            */}
     
   
                  
            
          </div>
          
      </header>
    </div>
    


    );

}
}

export default FormInterruptor