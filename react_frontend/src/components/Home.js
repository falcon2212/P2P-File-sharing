import React, { useState, useEffect, Component } from "react";
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:3080";

function Home() {
    const [response, setResponse] = useState("Phuckkkkk");
    // setResponse("Phuckkkk");

    useEffect(() => {
        const socket = socketIOClient.connect(ENDPOINT, {reconnect: true});
        socket.on("FromAPI", data => {
            setResponse(data);
        });
    }, []);

    return (
        <p>
            It's <time dateTime={response}>{response}</time>
        </p>
    );
}

export {Home};