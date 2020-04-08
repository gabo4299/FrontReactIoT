import React  from 'react';
import axios from 'axios';
import cors from 'cors';
import Switch from "react-switch";
import ipFunc from '../ipFunc.json'

import '../App.css';

class ModInt extends React.Component {
    constructor (e){
        super(e);
    
    
        this.state = {
            IdInterruptor:this.props.match.params.date2 ,
            IdCuarto: this.props.match.params.date,
            Pin: '',
            Dimmer: 'No',
            checked:false,
            Nombre:'',
            Existe:true,
            NombreCuarto:"",
            linkcuarto:"",
            PinesLibres:undefined
          };
          this.switchchange = this.switchchange.bind(this);
    
        }
    componentDidMount() {
           
        let linget=ipFunc["ipapi"]+"/Cuarto/"+this.props.match.params.date
        axios.get(linget)
        .then(response => {
        this.setState({NombreCuarto:response.data.nombre})
        })

            let lin=ipFunc["ipapi"]+"/Cuarto/"+this.props.match.params.date+"/Luz/"+ this.props.match.params.date2
            axios.get(lin)
              .then(response => {
                if (response.data == undefined || response.data == "error de cuarto" || response.data=="NO EXISTE INTERRUPTOR")
                {
                    
                    this.setState({Existe:false})
                }
                else
                {
                    let aux="/cuarto/"+this.props.match.params.date
                    this.setState({
                        Pin: response.data.Pin,
                        Nombre:response.data.Nombre,
                        linkcuarto:aux
                    })
                    if (response.data.Dimmer=="Si")
                    {
                        this.setState({checked:true})
                    }
                }
          
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
                  } })
        
          
          }
onChange(e){
            
            this.setState({
              [e.target.name]:e.target.value
        
            });
    
}
    
    
        
      
        
        
handleSubmit = event => {
            event.preventDefault();
        
            const Luz = {
              IdInterruptor: this.state.IdInterruptor,
              IdCuarto:"",
              Pin: this.state.Pin,
              Dimmer: this.state.Dimmer,
              Nombre:this.state.Nombre
            };            
            
            let config = {headers: {'Access-Control-Allow-Origin': "*"}};
            let lin=ipFunc["ipapi"]+"/Cuarto/"+ this.props.match.params.date+"/Luz/"+ this.props.match.params.date2+"/mod";
            axios.put(lin,  Luz , config)
              .then(res => {
                console.log(res.data);
                alert(res.data);
              })
      
          }



    switchchange(checked) {
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
    
    render(){
      const {PinesLibres}=this.state
        var siexiste= <div  className="Formulario"> 
                        <h2>
                        Formulario Luz
                        </h2>
                        <form ref={form=>this.form=form} onSubmit={this.handleSubmit} >
                        
                            <div id='form'>
                            <span style={{color:"#AEA8A7"}}>Id Interruptor</span>
                        <input  id="form" type="text"placeholder="ID del interruptor" value={this.state.IdInterruptor}  name="IdInterruptor" onChange={this.onChange.bind(this)} />
                        </div>
                        <div id="separador">
                        
                        <span style={{color:"#AEA8A7"}}>Id Cuarto</span>
                        <input  type="text"  id="form"  name="IdCuarto"  value={this.state.IdCuarto}  ></input>
                        </div>
                        <div id="separador">
                        <span style={{color:"#AEA8A7"}}>Nombre</span>
                        <input  id="form" type="text" name="Nombre"  placeholder="Nombre" value={this.state.Nombre} onChange={this.onChange.bind(this)} />
                        
                        </div>
                                
                        <div id="separador">
                        <span style={{color:"#AEA8A7"}}>Pin</span>
                    
                        <select   id="form"  name="Pin"  value={this.state.Pin} onChange={this.onChange.bind(this)} >
                        <option name="Pin" value={this.state.Pin}>{this.state.Pin}</option>
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
                        
                
                            <div>
                                        <Switch onChange={this.switchchange}  checked={this.state.checked} /></div> 
                        </div>
                        <div >
                            <input type="submit" value="Submit" className="button" onChange={this.onChange.bind(this)}   />
                            </div>  
                        </form>
                        </div>
        if (this.state.Existe == false)
        {
            siexiste=<h1>Error No Existe Cuarto O Id De Luz</h1>
        }
      
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
       
           {siexiste}
              
          </header>
        </div>
        
    
    
        );
    
    }    












}
export default ModInt