import React, { useState, useEffect, Component } from "react";
import "./dashboard.css";
import socketIOClient from "socket.io-client";

const ENDPOINT = "http://127.0.0.1:3080";
const MAXIMUM_MESSAGE_SIZE = 65535;
const END_OF_FILE_MESSAGE = 'EOF';
const {arrayBufferWithMime,arrayBufferMimeDecouple} = require('arraybuffer-mime');
const arrayBufferConcat = require('arraybuffer-concat')

class FAQ extends Component {
    constructor(props) {
        super(props);
        this.state = {
            configuration : {
                'iceServers': [{
                    'urls': 'stun:stun.l.google.com:19302'
                }]
            },
            room:null,
            link : null,
            chunks : [],
            clientList: [],
            isInitiator: null,
            clientId: null,
            dest_id: null,
            dataChannel: null,
            peerConn: null,
            connections : {},
            datachannels : {},
            alias: null,
            online: null,
            memberList: [],
            file:null,
            socket:null,
            downloadList:null,
        };
    }

    renderClients (){
        console.log("Function: renderClients")
        var currentState = this.state;
        currentState.online = "online";
        currentState.memberList = 'memberList';

        var onlineUsers = ((currentState.clientList.length === 0) ? 0 : (currentState.clientList.length - 1) );

        currentState.online = 'Users online (' + (onlineUsers) +   ')';

        var html = [];
        //console.log(clientList);
        if(currentState.clientList.length === 1)
        {
            html.push(<li>No members online</li>);
            currentState.memberList = html;
            this.setState(currentState);
            return;
        }

        for(var i=0; i<currentState.clientList.length; i++)
        {
            var element = currentState.clientList[i];
            if(element === currentState.clientId) continue;
            html.push(<li><small>{element}<button className="demo-chat-send btn btn-success" onClick={() => this.sendFile(element)}>Send</button></small></li>);
            currentState.memberList = html;

        }
        this.setState(currentState);
        console.log("Function finished renderClients",this.state);
    }

    allConnect (){
        console.log("Function: allConnect")
        var currentState = this.state;
        currentState.connections = {};
        currentState.datachannels = {};
        this.setState(currentState);
        for(let i = 0;i<currentState.clientList.length;i++){
            var element = currentState.clientList[i];
            if(element === currentState.clientId) continue;
            this.sendConnect(element);
        }
        console.log("Function finished allConnect",this.state);
    }

    async sendConnect (id){
        console.log("Function: sendConnect")
        var currentState = this.state;
        //socket.emit('reset', room);
        currentState.dest_id = id;
        currentState.isInitiator = true;
        //createPeer();
        //console.log("HERE inside sendConnect");
        currentState.socket.emit('sendConnect', currentState.dest_id, currentState.clientId, currentState.room);
        console.log("Function finished allConnect",this.state);
        return true;
        //console.log(id);
    }

    t(){
        console.log(Date.now());
    }

    createPeer(id){
        console.log("Function: createPeer")
        var currentState = this.state;
        console.log(this.state);
        //console.log(id);

        //var connect = document.getElementById('connect');
        //connect.style.display = 'block';

        console.log('Creating Peer connection as initiator?');
        currentState.connections[id] = new RTCPeerConnection(currentState.configuration);
        this.setState(currentState);
        console.log(this.state);

        currentState.connections[id].onicecandidate = (event) => {
            console.log('icecandidate event:', event);
            if (event.candidate) {
                this.sendMessage({
                    type: 'candidate',
                    label: event.candidate.sdpMLineIndex,
                    id: event.candidate.sdpMid,
                    candidate: event.candidate.candidate
                },id);
            } else {
                console.log('End of candidates.');
            }
        };
        this.setState(currentState);
        console.log(this.state);

        if (currentState.isInitiator) {
            console.log('Creating Data Channel');
            currentState.datachannels[id] = currentState.connections[id].createDataChannel('files');
            currentState.datachannels[id].binaryType = 'arraybuffer';
            this.setState(currentState);
            this.onDataChannelCreated(currentState.datachannels[id]);

            console.log('Creating an offer');
            currentState.connections[id].createOffer().then((offer) => {
                return currentState.connections[id].setLocalDescription(offer);
            })
                .then(() => {
                    console.log('sending local desc:', currentState.connections[id].localDescription);
                    this.sendMessage(currentState.connections[id].localDescription, id);
                })
                .catch(this.logError);

        } else {
            //console.log(peerConn);
            //console.log("Inside else");
            currentState.connections[id].ondatachannel = (event) => {
                console.log('ondatachannel:', event.channel);
                currentState.datachannels[id] = event.channel;
                currentState.datachannels[id].binaryType = 'arraybuffer';
                this.setState(currentState);
                this.onDataChannelCreated(currentState.datachannels[id]);
            };
            this.setState(currentState);
        }
        //senders[id]=[peerConn, dataChannel];
            console.log("Function finished createPeer",this.state);
    }

    sendMessage (message, id) {
        console.log("Function: sendMessage")
        console.log('Client sending message: ', message);
        this.state.socket.emit('message', message, id, this.state.clientId);
            console.log("Function finished sendMessage",this.state);
    }

    onDataChannelCreated (channel){
        console.log("Function: onDataChannelCreated")
        var currentState = this.state;

        console.log('onDataChannelCreated:', channel);
        console.log(channel.readyState);
        channel.onopen = () => {
            console.log('CHANNEL opened!!!');
            //sendBtn.disabled = false;
        };

        channel.onclose = () => {
            console.log('Channel closed.');
            currentState.sendBtn = false;
            this.setState(currentState);
        }

        channel.onmessage = async (event) => {
            const { data } = event;
            try {
                //console.log(data);
                if (data !== END_OF_FILE_MESSAGE) {
                    //console.log("DATA");
                    currentState.chunks.push(data);
                    this.setState(currentState);
                } else {
                    //console.log("ASSEMBLY");
                    let abWithMime = currentState.chunks.reduce((acc, arrayBuffer) => {
                        const tmp = new Uint8Array(acc.byteLength + arrayBuffer.byteLength);
                        tmp.set(new Uint8Array(acc), 0);
                        tmp.set(new Uint8Array(arrayBuffer), acc.byteLength);
                        return tmp;
                    }, new Uint8Array());
                    const {mime, arrayBuffer} = arrayBufferMimeDecouple(abWithMime)
                    const blob = new Blob([arrayBuffer], {type : mime});
                    console.log(mime);
                    this.render1(blob, "download");
                    //channel.close();
                }
            } catch (err) {
                console.log(err);
                console.log('File transfer failed');
            }
        };
            console.log("Function finished onDataChannelCreated",this.state);
    };

    logError (err) {
        console.log("Function: logError")
        if (!err) return;
        if (typeof err === 'string') {
            console.warn(err);
        } else {
            console.warn(err.toString(), err);
        }
            console.log("Function finished logError",this.state);
    }

    render1 (blob, fileName){
        console.log("Function: render1")
        var currentState = this.state;
        var html;
        const url = window.URL.createObjectURL(blob);
        if(url)
        {
            console.log(blob.type);
            html = <li><small><a href={url} download={fileName}>download now</a></small></li> ;
        }
        else
        {
            html = <li>No files available here</li>;
        }
        currentState.downloadList = html;
        currentState.chunks = []
        this.setState(currentState);
            console.log("Function finished render1",this.state);
    }

    signalingMessageCallback (message, id) {
        console.log("Function: signalingMessageCallback")
        var currentState = this.state;
        if (message.type === 'offer') {
            console.log('Got offer. Sending answer to peer.');
            //console.log(message)
            //var temp = new RTCSessionDescription(message);
            //console.log(peerConn);
            //peerConn.setRemoteDescription(temp).then(() => {}).catch(logError);
            console.log(id);
            currentState.connections[id].setRemoteDescription(new RTCSessionDescription(message), () => {},
                this.logError);
            currentState.connections[id].createAnswer().then((answer) => {
                this.onLocalSessionCreated(answer,id);
            }).catch(this.logError);
            this.setState(currentState);
        } else if (message.type === 'answer') {
            console.log('Got answer.');
            currentState.connections[id].setRemoteDescription(new RTCSessionDescription(message), () => {},
                currentState.logError);
            this.setState(currentState);
        } else if (message.type === 'candidate') {
            console.log("Candidate");
            currentState.connections[id].addIceCandidate(new RTCIceCandidate({
                candidate: message.candidate,
                sdpMLineIndex: message.label,
                sdpMid: message.id
            }));
            this.setState(currentState);
        }
            console.log("Function finished signalingMessageCallback",this.state);
    }

    onLocalSessionCreated (desc,id) {
        console.log("Function: onLocalSessionCreated")
        var currentState = this.state;
        console.log('local session created:', desc);
        currentState.connections[id].setLocalDescription(desc).then(() => {
            console.log('sending local desc:', currentState.connections[id].localDescription);
            this.sendMessage(currentState.connections[id].localDescription, id);
        }).catch(this.logError);
        this.setState(currentState);
            console.log("Function finished onLocalSessionCreated",this.state);
    }

    async sendFile(id){
        console.log("Function: sendFile")
        var currentState = this.state;
        var fileInput = document.getElementById('file')
        var file = fileInput.files[0];
        //console.log(id);

        if(file){
            let arrayBuffer = await file.arrayBuffer();
            let mime = file.type;
            let abWithMime = arrayBufferWithMime(arrayBuffer, mime)
            console.log(arrayBuffer, mime, abWithMime);
            let dataChannel = currentState.datachannels[id];

            for (let i = 0; i < abWithMime.byteLength; i += MAXIMUM_MESSAGE_SIZE) {
                //console.log(dataChannel.readyState);
                dataChannel.send(abWithMime.slice(i, i + MAXIMUM_MESSAGE_SIZE));
            }
            //console.log("OUTSIDE");
            dataChannel.send(END_OF_FILE_MESSAGE);
            //console.log(dataChannel.readyState);
        }
        //fileInput.type = "text";
        //fileInput.type = "file";
            console.log("Function finished sendFile",this.state);
    }

    arrayBufferWithMime(arrayBuffer, mime) {
        console.log("Function: arrayBufferWithMime")
        const len = mime.length
        const uint8 = new Uint8Array(len + 1)

        uint8[0] = len

        for (var i = 0; i < len; i++) {
            var n = mime[i].charCodeAt(0)
            uint8[i+1] = n
        }

        const ab = arrayBufferConcat(uint8, arrayBuffer)

        console.log("Function finished arrayBufferWithMime",this.state);
        return ab
    }

    arrayBufferMimeDecouple(arrayBufferWithMime) {
        console.log("Function: arrayBufferMimeDecouple")
        const uint8 = new Uint8Array(arrayBufferWithMime)
        var mime = ''
        const len = uint8[0]

        for (var i = 0; i < len; i++) {
            var char = uint8[i+1]

            mime += String.fromCharCode(char)
        }

        var arrayBuffer = uint8.slice(len+1).buffer

        console.log("Function finished arrayBufferMimeDecouple",this.state);
        return {
            mime: mime,
            arrayBuffer: arrayBuffer
        }
    }

    componentDidMount() {
        let currentState = this.state;
        if (!currentState.room) {
            currentState.room = window.location.hash = "1";
            //console.log("HERE"+room)
        }
        currentState.socket = socketIOClient.connect(ENDPOINT, {reconnect: true});
        this.setState(currentState);

        currentState.socket.emit('create or join', currentState.room);

        currentState.socket.on('Display clients', (clientsInRoom) => {
            console.log("Listener: Display Clients")
            console.log(this.state);
            currentState.clientList = clientsInRoom;
            this.setState(currentState);
            this.renderClients();
            this.allConnect();
            //console.log(senders);
            //console.log(clientList);
            console.log("Listener finished Display clients",this.state);
        });

        currentState.socket.on('ready', (dest_Id) => {
            console.log("Listener: ready")
            console.log("Inside ready");
            console.log(dest_Id);
            this.t();
            this.createPeer(dest_Id);
            this.t();
                    console.log("Listener finished ready",this.state);
            });

        currentState.socket.on('reset', () => {
            console.log("Listener: reset")
            window.location.reload();
                    console.log("Listener finished reset",this.state);
            });

        currentState.socket.on('sendConnect', (dest_Id) => {
            console.log("Listener: sendConnect")
            console.log("Current State", currentState);
            console.log("this State", this.state);
            currentState.dest_id = dest_Id
            currentState.isInitiator = false;
            this.setState(currentState);
            console.log(this.state);
            this.t();
            console.log(currentState.dest_id);
            this.createPeer(currentState.dest_id);
            this.t();
            currentState.socket.emit('ready', currentState.dest_id, currentState.clientId);
            console.log("Listener finished sendConnect",this.state);
            return true;
            });

        currentState.socket.on('socketid', (id) => {
            console.log("Listener: socketid")
            currentState.clientId = id;
            this.setState(currentState);
            console.log("Received clientid" + currentState.clientId);
                    console.log("Listener finished socketid",this.state);
            });

        currentState.socket.on('log', (array) => {
            console.log("Listener: log")
            console.log.apply(console, array);
                    console.log("Listener finished log",this.state);
            });

        currentState.socket.on('message', (message, id) => {
            console.log("Listener: message")
            console.log('Client received message:', message);
            console.log(id);
            this.signalingMessageCallback(message, id);
                    console.log("Listener finished message",this.state);
            });
    }

    render() {
        // var memberList = <ul id="memberList">No members</ul>;
        // if(this.state.memberList !== ""){
        //     memberList.innerHTML = this.state.memberList;
        // }
        return(
            <div>
                <h3>File Upload</h3>
                <div className="container-fluid">
                    <div className="container" id="members">
                        <h4 id="online">{this.state.online}</h4>
                        <ul id="memberList">{this.state.memberList}</ul>
                    </div>
                    <div className="container" id="connect">
                           <input type="file" id="file" className="form-control"/>
                           <ul id="downloadList">{this.state.downloadList}</ul>
                    </div>
                </div>
            </div>
        );
    }
}

export {FAQ};