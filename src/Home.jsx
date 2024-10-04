import React from 'react';
import AddTask from './AddTask';
import'./Home.css';

function Home() {

    return (

        <div className="col-12 background">
            <div className="row" style={{ margin: 0 }}>
                <div className="col-12 " style={{minHeight:'100vh'}}>

                    <AddTask/>


                </div>
             
            </div>
        </div>


    )

}

export default Home;