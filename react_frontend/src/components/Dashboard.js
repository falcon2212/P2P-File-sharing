import React, { useState, useEffect, Component } from "react";
import "./dashboard.css";
import socketIOClient from "socket.io-client";

const ENDPOINT = "http://127.0.0.1:3080";
const MAXIMUM_MESSAGE_SIZE = 65535;
const END_OF_FILE_MESSAGE = 'EOF';
const {arrayBufferWithMime,arrayBufferMimeDecouple} = require('arraybuffer-mime');

// function Dashboard() {
//     const [response, setResponse] = useState("Phuckkkkk");
//     // setResponse("Phuckkkk");
//
//     useEffect(() => {
//         const socket = socketIOClient.connect(ENDPOINT, {reconnect: true});
//         var configuration = {
//             'iceServers': [{
//                 'urls': 'stun:stun.l.google.com:19302'
//             }]
//         };
//         var link = null;
//         var chunks = [];
//         var clientList;
//         var isInitiator;
//         var clientId;
//         var dest_id;
//         var dataChannel;
//         var peerConn;
//         var room = window.location.hash.substring(1);
//         var sendBtn = document.getElementById('send');
//         var online = document.getElementById('online');
//         var connect = document.getElementById('connect');
//         var connections = {};
//         var datachannels = {};
//         var alias;
//         if (!room) {
//             room = window.location.hash = randomToken();
//         }
//
//     }, []);
//
//     return (
//         <p>
//             It's <time dateTime={response}>{response}</time>
//         </p>
//     );
// }

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            configuration : {
                'iceServers': [{
                    'urls': 'stun:stun.l.google.com:19302'
                }]
            },
            link : null,
            chunks : [],
            clientList: [],
            isInitiator: "",
            clientId: "",
            dest_id: "",
            dataChannel: "",
            peerConn: "",
            connections : {},
            datachannels : {},
            alias: "",
            online: "",
            memberList: "",
            socket:null,
            downloadList:"",
        }
    }

    renderClients  = function (){
        var currentState = this.state;
        currentState.online = "online";
        currentState.memberList = 'memberList';

        var onlineUsers = ((currentState.clientList.length === 0) ? 0 : (currentState.clientList.length - 1) );

        currentState.online = 'Users online (' + (onlineUsers) +   ')';

        // var html;
        // //console.log(clientList);
        // if(currentState.clientList.length === 1)
        // {
        //     html = "<li>No members online</li>";
        //     currentState.memberList = html;
        //     this.setState(currentState);
        //     return;
        // }
        //
        // for(var i=0; i<currentState.clientList.length; i++)
        // {
        //     var element = currentState.clientList[i];
        //     if(element === currentState.clientId) continue;
        //     html += '<li><small>element<button class="demo-chat-send btn btn-success" onClick = alias("'+element+'")>Send</button></small></li>';
        // }
        // currentState.memberList.innerHTML = html;

        this.setState(currentState);
    }

    allConnect = function (){
        var currentState = this.state;
        currentState.connections = {};
        currentState.datachannels = {};
        this.setState(currentState);
        for(let i = 0;i<currentState.clientList.length;i++)
        {
            var element = currentState.clientList[i];
            if(element === currentState.clientId) continue;
            this.sendConnect(element);
        }
    }

    sendConnect = async function(id){
        var currentState = this.state;
        //socket.emit('reset', room);
        currentState.dest_id = id;
        currentState.isInitiator = true;
        //createPeer();
        //console.log("HERE inside sendConnect");
        currentState.socket.emit('sendConnect', currentState.dest_id, currentState.clientId, currentState.room);
        return true;
        //console.log(id);
    }

    t = function (){
        console.log(Date.now());
    }

    createPeer = function (id){
        var currentState = this.state;
        //console.log(id);

        //var connect = document.getElementById('connect');
        //connect.style.display = 'block';

        console.log('Creating Peer connection as initiator?');
        currentState.connections[id] = new RTCPeerConnection(currentState.configuration);
        this.setState(currentState);

        currentState.connections[id].onicecandidate = function(event) {
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

        if (currentState.isInitiator) {
            console.log('Creating Data Channel');
            currentState.datachannels[id] = currentState.connections[id].createDataChannel('files');
            currentState.datachannels[id].binaryType = 'arraybuffer';
            this.setState(currentState);
            this.onDataChannelCreated(currentState.datachannels[id]);

            console.log('Creating an offer');
            currentState.connections[id].createOffer().then(function(offer) {
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
            currentState.connections[id].ondatachannel = function(event) {
                console.log('ondatachannel:', event.channel);
                currentState.datachannels[id] = event.channel;
                currentState.datachannels[id].binaryType = 'arraybuffer';
                this.setState(currentState);
                this.onDataChannelCreated(currentState.datachannels[id]);
            };
            this.setState(currentState);
        }
        //senders[id]=[peerConn, dataChannel];
    }

    sendMessage = function (message, id) {
        console.log('Client sending message: ', message);
        this.state.socket.emit('message', message, id, this.state.clientId);
    }

    onDataChannelCreated = function (channel){
        var currentState = this.state;

        console.log('onDataChannelCreated:', channel);
        console.log(channel.readyState);
        channel.onopen = function() {
            console.log('CHANNEL opened!!!');
            //sendBtn.disabled = false;
        };

        channel.onclose = function () {
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
    };

    logError = function (err) {
        if (!err) return;
        if (typeof err === 'string') {
            console.warn(err);
        } else {
            console.warn(err.toString(), err);
        }
    }

    render1 = function (blob, fileName){
        var currentState = this.state;
        var html = '';
        const url = window.URL.createObjectURL(blob);
        if(url)
        {
            console.log(blob.type);
            var downloadlink = '<a href=' + url + ' download = '+fileName+' > download now </a> ';
            html+='<li><small>' + downloadlink + '</small></li>';
        }
        else
        {
            html += '<li>No files available here</li>';
        }
        currentState.downloadList = html;
        currentState.chunks = []
        this.setState(currentState);
    }

    signalingMessageCallback = function (message, id) {
        var currentState = this.state;
        if (message.type === 'offer') {
            console.log('Got offer. Sending answer to peer.');
            //console.log(message)
            //var temp = new RTCSessionDescription(message);
            //console.log(peerConn);
            //peerConn.setRemoteDescription(temp).then(() => {}).catch(logError);
            console.log(id);
            currentState.connections[id].setRemoteDescription(new RTCSessionDescription(message), function() {},
                this.logError);
            currentState.connections[id].createAnswer().then(function(answer){
                this.onLocalSessionCreated(answer,id);
            }).catch(this.logError);
            this.setState(currentState);
        } else if (message.type === 'answer') {
            console.log('Got answer.');
            currentState.connections[id].setRemoteDescription(new RTCSessionDescription(message), function() {},
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
    }

    onLocalSessionCreated = function (desc,id) {
        var currentState = this.state;
        console.log('local session created:', desc);
        currentState.connections[id].setLocalDescription(desc).then(function() {
            console.log('sending local desc:', currentState.connections[id].localDescription);
            this.sendMessage(currentState.connections[id].localDescription, id);
        }).catch(this.logError);
        this.setState(currentState);
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

        currentState.socket.on('Display clients', function(clientsInRoom) {
            currentState.clientList = clientsInRoom;
            this.setState(currentState);
            this.renderClients();
            // this.allConnect();
            //console.log(senders);
            //console.log(clientList);
        });

        // currentState.socket.on('ready', function(dest_Id){
        //     console.log("Inside ready");
        //     console.log(dest_Id);
        //     this.t();
        //     this.createPeer(dest_Id);
        //     this.t();
        // });
        //
        // currentState.socket.on('reset', function(){
        //     window.location.reload();
        // });
        //
        // currentState.socket.on('sendConnect', function(dest_Id){
        //     currentState.dest_id = dest_Id
        //     currentState.isInitiator = false;
        //     this.setState(currentState);
        //     this.t();
        //     console.log(currentState.dest_id);
        //     this.createPeer(currentState.dest_id);
        //     this.t();
        //     currentState.socket.emit('ready', currentState.dest_id, currentState.clientId);
        //     return true;
        // });
        //
        // currentState.socket.on('socketid', function(id){
        //     currentState.clientId = id;
        //     this.setState(currentState);
        //     console.log("Received clientid" + currentState.clientId);
        // });
        //
        // currentState.socket.on('log', function(array) {
        //     console.log.apply(console, array);
        // });
        //
        // currentState.socket.on('message', function(message, id){
        //     console.log('Client received message:', message);
        //     console.log(id);
        //     this.signalingMessageCallback(message, id);
        // });
    }

    render() {
        return(
            <div>
                <h3>File Upload</h3>
                <div className="container-fluid">
                    <div className="container" id="members">
                        <h4 id="online">{this.state.online}</h4>
                        <ul id="memberList">{this.state.memberList}</ul>
                    </div>
                    {/*<div className="container" id="connect">*/}
                    {/*       <input type="file" id="file" className="form-control">{this.state}</input>*/}
                    {/*        <!--<button class="demo-chat-send btn btn-success" id="send" >Send</button>-->*/}
                    {/*       <ul id="downloadList"></ul>*/}
                    {/*</div>*/}
                </div>
            </div>
        );
    }
}

export {Dashboard};