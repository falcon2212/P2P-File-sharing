import React, { useState, useEffect, Component } from "react";
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:3080";

function Dashboard() {
    const [response, setResponse] = useState("Phuckkkkk");
    // setResponse("Phuckkkk");

    useEffect(() => {
        const socket = socketIOClient.connect(ENDPOINT, {reconnect: true});
        var configuration = {
            'iceServers': [{
                'urls': 'stun:stun.l.google.com:19302'
            }]
        };
        var link = null;
        var chunks = [];
        var clientList;
        var isInitiator;
        var clientId;
        var dest_id;
        var dataChannel;
        var peerConn;
        var room = window.location.hash.substring(1);
        var sendBtn = document.getElementById('send');
        var online = document.getElementById('online');
        var connect = document.getElementById('connect');
        var connections = {};
        var datachannels = {};
        var alias;
        if (!room) {
            room = window.location.hash = randomToken();
        }

    }, []);

    return (
        <p>
            It's <time dateTime={response}>{response}</time>
        </p>
    );
}

export {Dashboard};