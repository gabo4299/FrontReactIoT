import React  from 'react';
import axios from 'axios';
import ipFunc from '../ipFunc.json'

import '../App.css';

class ModInt extends React.Component {
    constructor (e){
        super(e);
    
    
        this.state = {
            IdInterruptor:this.props.match.params.date2 ,
            IdCuarto: this.props.match.params.date,
            Pin: '',
            Cuarto:undefined,
            Luz:undefined,
            Nombre:'',
            Existe:true,
            NombreCuarto:"",
            linkcuarto:"",
            PinesLibres:undefined
          };
        
    
        }
    componentDidMount() {
           
        let linget=ipFunc["ipapi"]+"/Cuarto/"+this.props.match.params.date
        let Cuarto
        let Luz
        axios.get(linget)
        .then(response => {
        this.setState({NombreCuarto:response.data.nombre})
        Cuarto=response.data
        this.setState({Cuarto})
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
                        
                        linkcuarto:aux
                    })
                    Luz=response.data
                    
                    this.setState({Luz})
                    if (Luz != undefined && Luz!= "NO EXISTE INTERRUPTOR"){
                      let PinesLibres = []
                      console.log("Luz",Luz)
                      let linkpindisp= ipFunc["ipapi"]+"/CPU/"+Luz.Dispositivo+"/"+Luz.IdDisp+"/PinFree/Luz"
                      axios.get(linkpindisp)
                      .then (response =>
                        {
                          if(response.data != undefined)
                          {
                            PinesLibres=response.data
                            console.log("pines,",PinesLibres)
                            this.setState({ PinesLibres });
                          }
                            
                            
                           })}
                }
          
              });
              
        
          
          }
onChange(e){
            
            this.setState({
              [e.target.name]:e.target.value
        
            });
    
}
    
    
        
      
        
        
handleSubmit = event => {
            event.preventDefault();
        
            const Luz = {
              Pin: this.state.Pin,
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

          Eliminar(){
            if (window.confirm("Esta seguro de Elimianr esta Luz"))
            {
              let link=ipFunc["ipapi"]+"/Cuarto/"+this.state.IdCuarto+"/Luz/"+this.state.IdInterruptor+"/del"
                axios.delete(link)
                .then(
                  response=>
                  {
                    alert(response.data)
                  }
                )
            }
            
          }

    
    render(){
      const {PinesLibres}=this.state
        var siexiste=  <div>
        { this.state.Luz!= undefined && <div  className="Formulario" style={{color:"#AEA8A7"}}> 
                        <h2>
                        Formulario Luz
                        </h2>
                        <form ref={form=>this.form=form} onSubmit={this.handleSubmit} >
                        
                            
                        
                        <div id="separador">
                        <span >Nombre</span>
                        <input  id="form" type="text" name="Nombre"  placeholder={this.state.Luz.Nombre} value={this.state.Nombre} onChange={this.onChange.bind(this)} />
                        
                        </div>
                                
                        <div id="separador">
                        <span >Pin</span>
                        <select name ="Pin" value={this.state.Pin} onChange={this.onChange.bind(this)}>
                          <option name="Pin" value='' onChange={this.onChange.bind(this)}>{this.state.Luz.Pin}</option>
                          {
                PinesLibres && PinesLibres.length && PinesLibres.map((p,index) => {
                    return (<option key={index} name="Pin"  value={p}  onChange={this.onChange.bind(this)} >{p}</option>)
                    })
                    }

                    

                        </select>
                  {this.state.Luz != undefined && <span> de Dispositivo: <b style={{color:"black"}}>{this.state.Luz.Dispositivo}</b> Id : {this.state.Luz.IdDisp}</span>}
                        <div>
                        <span> Para Cambiar de Dispositivo o Dimmer elimine Luz  </span>
                        </div>
                    
                        </div>
                        <div id="separador">

                        </div>
                        <div >
                            <input type="submit" value="Submit" className="button" onChange={this.onChange.bind(this)}   />
                            </div>  
                            <button className ="btn btn-danger" onClick={this.Eliminar.bind(this)}>Eliminar</button>
                        </form>
                        </div> }

                        </div>
        if (this.state.Existe == false)
        {
            siexiste=<h1>Error No Existe Cuarto O Id De Luz</h1>
        }
      
        return (
    
    
            
          <div className="App">
            <nav className="navbar navbar-dark bg-dark"> 
                
                                   
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