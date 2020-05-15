import React from 'react';
import {Switch , Route} from 'react-router-dom';
import Home from './components/Home';
import FormCuarto from './components/FormCuarto';
import FormInterruptor from './components/FormInterruptor';
import FormCortina from './components/FormCortina';
import MainHome from './components/MainHome';
import CuartosVar from './components/CuartosVar';
import Prueba from './components/pruebas';
import ModCuartosVar from './components/ModCuartoVar';
import FormInterruVar from './components/FormInterruVar'
import FormCorVar from './components/FormCorVar';
import ModInt from './components/ModInt';
import ModCor from './components/ModCor';
import FormDisp from './components/FormDisp';
import FormLecIR from './components/FormLecIR';
import FormControl from './components/FormControl';
import ModControl from './components/ModControl';
import SocketIOClient from 'socket.io-client'
import ipFunc from './ipFunc.json'
const socket = SocketIOClient(ipFunc["ip"]);


const Routes = () => {
    return(

    <Switch>
        <Route exact path='/' component ={Home} />
        <Route  path='/formDisp' component ={FormDisp} />
        <Route  path='/formLect' component ={FormLecIR} />
        <Route  path='/formControl/:id' component ={FormControl} />
        <Route  path='/form' component ={FormCuarto} />
        <Route  path='/formInt' component ={FormInterruptor} />
        <Route  path='/formCor' component ={FormCortina} />
        <Route  path='/Main' component ={MainHome} />
        <Route exact path="/Cuarto/:date" component={CuartosVar}   />
        {/*   */}
        <Route path='/Prueba' component={Prueba}/>
        <Route path='/mod/:date' component={ModCuartosVar}/>
        <Route path='/formI/:date' component={FormInterruVar}/>
        <Route path='/formC/:date' component={FormCorVar}/>
        <Route  path="/Cuarto/:date/ModLuz/:date2" component={ModInt} />
        <Route  path="/Cuarto/:date/ModCor/:date2" component={ModCor} />
        <Route  path="/Cuarto/:date/ModControl/:date2" component={ModControl} />
        
    </Switch>
    )

}

export default Routes;