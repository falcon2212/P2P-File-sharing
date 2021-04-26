import React, { useState, useEffect, Component } from "react";

function Home() {
    const [response, setResponse] = useState("Phuckkkkk");
    // setResponse("Phuckkkk");

    return (
        <p>
            It's <time dateTime={response}>{response}</time>
        </p>
    );
}

export {Home};