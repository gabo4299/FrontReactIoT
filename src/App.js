//import React from 'react';
import axios from 'axios';
import cors from 'cors';
import Routes from './Routes'
import React ,{Component} from 'react';
import logo from './logo.svg';
import './App.css';


class App extends Component{
  render(){
    return(
      <Routes/>
    )
  }
}
export default App;
/*export default class App extends React.Component {
  state = {
    idcuarto: '',
    nombre: '',
    fondo: '',
    contrasenha: ''
  }

  onChange(e){
    this.setState({
      [e.target.idcuarto]:e.target.value,
      [e.target.name]:e.target.value,
      [e.target.fondo]:e.target.value,
      [e.target.contrasenha]:e.target.value

    })
  }



  handleSubmit = event => {
    event.preventDefault();

    const Cuarto = {
      idcuarto: this.state.idcuarto,
      nombre: this.state.nombre,
      fondo: this.state.fondo,
      contrasenha: this.state.contrasenha

    };

    
    
    let config = {headers: {'Access-Control-Allow-Origin': "*"}};
    axios.post('http://localhost:5000/API/Cuarto/add',  Cuarto , config)
      .then(res => {
        //console.log(res);
        console.log(res.data);
      })
  }

  render() {
    return (
      <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Formulario Cuarto
        </p>
        <form onSubmit={this.handleSubmit} className="Formulario">
         <div>
         <label className="Formulario">
           Id Cuarto:
          
           </label>
           <input type="text" value={this.state.idcuarto} name="idcuarto" onChange={this.onChange.bind(this)} />
           </div>
           <div>
           <label className="Formulario">
           Nombre:
          
           </label>
           <input type="text" name="nombre"   value={this.state.nombre} onChange={this.onChange.bind(this)}/>
           </div>

           <label>
           Fondo:
          
           </label>
           <input type="text" name="fondo"  value={this.state.fondo} onChange={this.onChange.bind(this)} />
           <div>
           <label className="Formulario">
             Contraseña:
           </label>
           <input type="password" name="contrasenha"   value={this.state.contrasenha} onChange={this.onChange.bind(this)}/>
           </div>
             <div>
            <input type="submit" value="Submit" onChange={this.onChange}/>
            </div>
          </form>
      </header>
    </div>
    )
  }
}*/

//export default App; no da porque ya tines arriba gilsito 
