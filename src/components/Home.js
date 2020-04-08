
// import React from 'react';
// import '../App.css';

// const Home = () => {
//     return (
//         <div>
//         <h1> Este va ser un como una constante </h1>
//         </div>
//     );

// }

// export default Home



import React from 'react';
import '../App.css';
class Home extends React.Component{
constructor(e){
    super(e);
    const people = [];

    for (let i = 0; i < 10; i++) {
        people.push({
            name: i
            
        });
    }

    this.state = { people };

   
    
}
componentDidMount(){
    console.log(this.state.people)
}

render(){
    return (
        <div className='App'>
            <header className="App-header">
            <img src={process.env.PUBLIC_URL + '/Images/Escudo.png'} alt='Escudo' width='400'/>
                <h1> Este va ser un como una constante </h1>
                <div>
                {this.state.people.map((person, index) => (
                    <p key = {person.name}>Hello, {person.name} !</p>
                        ))}
                </div>
               
            </header>
        </div>
    );

                }
}
export default Home