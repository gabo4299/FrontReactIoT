import React from 'react';
import '../App.css';
import axios from 'axios';
import ipFunc from '../ipFunc.json';    
class potencia extends React.Component{
constructor(e){
    super(e);


    this.state = { Estado:0 };

   
    
}
componentDidMount(){
    console.log("HI")
}
On_Off(val){
    let lin=ipFunc["ip"]+"/API/Potencia/"
    
    if (val== 100){

        this.setState({
            Estado:val
          })
    }
    else{
        if (val == 0)
        {
            this.setState({
                Estado:val
              })
        }
    }
    axios.post(lin,val)

}
Dimm(e)
{
    let lin=ipFunc["ip"]+"/API/Potencia/"
    let val=parseInt([e.target.value])
    console.log(val)
    this.setState({
        Estado:val
      })
      axios.post(lin,val)

}

render(){
    var imagen
    if (this.state.Estado == 100)
    {
        imagen =<img   src={process.env.PUBLIC_URL + '/Images/luzEncendida.png'} alt='Escudo' width='300' style={{'cursor':"pointer"}} />
    }
    else{
        if (this.state.Estado == 0)
    {
        imagen =<img   src={process.env.PUBLIC_URL + '/Images/luzApagada.png'} alt='Escudo' width='300' style={{'cursor':"pointer"}} />
    }
    else{
        imagen =<img   src={process.env.PUBLIC_URL + '/Images/luzSemi.png'} alt='Escudo' width='300' style={{'cursor':"pointer"}} />
    }

    }
    
    return (
        <div className='CuartoMenu' style={{textAlign:"center",marginRight:"0px"}}>
            
            
            <h1> Dimmer y control  </h1>
            
            <div className="container"  >
            
            <div  className="col-md-auto">
            {imagen}
            
            <button className="btn btn-light" onClick={this.On_Off.bind(this,100)}>Encender</button>
            
            <button className="btn btn-danger" onClick={this.On_Off.bind(this,0)}>Apagar</button>
            </div>
            <div  className="col-md-auto">
            <input type="range" id="vol" name="vol" min="0" max="100" onChange={this.Dimm.bind(this)} ></input>
            
            </div>
            
            
            </div>
            
               
            
            
        </div>
    );

                }
}
export default potencia