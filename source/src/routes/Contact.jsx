import React from "react";
import {Link } from "react-router-dom";

const Contact = () => {
    return (
        <div>
            <h1>Contato</h1>
            <p>
                <Link to ="/contato/1"> Forma de contato 1</Link>
            </p>
            <p>
                <Link to ="/contato/2"> Forma de contato 2</Link>
            </p>
            <p>
                <Link to ="/contato/3"> Forma de contato 3</Link>
            </p>
        </div>
    );
};

export default Contact;