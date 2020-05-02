
import React  from 'react';
import axios from 'axios';
import '../App.css';
import ipFunc from "../ipFunc.json"
class ModCuartosVar extends React.Component {

    
    state = {
        idcuarto:this.props.match.params.date,
        nombre: '',
        fondo:'',
        contrasenha: '',
        Seleccion:'No',
        QuitarContra:"No",
        linkcuarto:'',
        NombreCuarto:'',
        linkfondonw:ipFunc["ipapi"]+"/Cuarto/Fondo"
      }

    componentDidMount(){
      let linkcuarto="/cuarto/"+this.props.match.params.date
      this.setState({linkcuarto})
      let linget=ipFunc["ipapi"]+"/Cuarto/"+this.props.match.params.date
      axios.get(linget)
      .then(response => {
        this.setState({NombreCuarto:response.data.nombre})
      })
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
    let lin=ipFunc["ipapi"]+'/Cuarto/'+this.state.idcuarto+'/mod'
        const c = new FormData();
        c.append('fondo',this.state.fondo)
        c.append('nombre',this.state.nombre)
        c.append('idcuarto',this.state.idcuarto)
        c.append('contrasenha',this.state.contrasenha)
        c.append("Seleccion",this.state.Seleccion)
        c.append("QuitarContra",this.state.QuitarContra)
        c.append("idcasa",1)
        
        let config = {headers: {'Access-Control-Allow-Origin': "*",'Content-Type': 'multipart/form-data' }};
        
        axios.put(lin,  c , config)
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

contra(E){
    
    if(this.state.QuitarContra="No")
    {
        this.setState({QuitarContra:"Si"})
    }
    else
    {
        this.setState({QuitarContra:"No"})
    }
}
render(){
  let linkfondonw=ipFunc["ipapi"]+"/Cuarto/Fondo"
    return (
      <div className="App">
       <nav className="navbar navbar-dark bg-dark"> 
        
                               
                               <div style={{ fontSize:" calc(10px + 2vmin)", color: "white"}}>
                               <a href="/main"><button type="button" className="btn btn-dark">Home </button></a>
                               <a href={this.state.linkcuarto}><button type="button" className="btn btn-dark">Regresar A Cuarto {this.state.NombreCuarto}  </button></a>
                                </div>
                               
                               <img  className="Logo" src={process.env.PUBLIC_URL + '/Images/Escudo.png'} alt='Escudo' width='60'/>
                 </nav>
      <header className="App-header">
        
      <img src={process.env.PUBLIC_URL + this.state.linkfondonw} alt='Escudo' width='400'/>
      
        <form onSubmit={this.handleSubmit} className="Formulario" encType = "multipart/form-data">
         <div >
         <h2>
          Modificar  Cuarto
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
           <div>
           <input type='checkbox'  onChange={this.contra.bind(this)} style={{width:25,height:25}}></input><label style={{color:"black"}}> Quitar Contra</label>
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

export default ModCuartosVar