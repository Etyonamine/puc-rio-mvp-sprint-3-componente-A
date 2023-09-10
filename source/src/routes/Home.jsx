import React from "react";
 

function Home() {
    return (
        <div>
            <small>Você está executando a aplicação no ambiente de <b>{process.env.NODE_ENV}</b> modo.</small>                 
        </div>
    );
}

export default Home;