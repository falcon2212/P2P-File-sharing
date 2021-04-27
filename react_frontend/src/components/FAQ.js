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
        this.setState({online: "online"});

        var onlineUsers = ((this.state.clientList.length === 0) ? 0 : (this.state.clientList.length - 1) );

        this.setState({online: 'Users online (' + (onlineUsers) +   ')'});

        var html = [];
        //console.log(clientList);
        if(this.state.clientList.length === 1)
        {
            html.push(<li>No members online</li>);
            this.setState({memberList: html});
            return;
        }

        for(var i=0; i<this.state.clientList.length; i++)
        {
            var element = this.state.clientList[i];
            if(element === this.state.clientId) continue;
            console.log("Fuckkk", element);
            html.push(<li><small>{element}<button className="demo-chat-send btn btn-success" id={element} onClick={() => this.sendFile(element)}>Send</button></small></li>);
            this.setState({memberList: html});

        }
        console.log("Function finished renderClients",this.state);
    }

    allConnect (){
        console.log("Function: allConnect")
        this.setState({connections: {}});
        this.setState({datachannels: {}});
        for(let i = 0;i<this.state.clientList.length;i++){
            var element = this.state.clientList[i];
            if(element === this.state.clientId) continue;
            this.sendConnect(element);
        }
        console.log("Function finished allConnect",this.state);
    }

    async sendConnect (id){
        console.log("Function: sendConnect")
        //socket.emit('reset', room);
        this.setState({dest_id: id});
        this.setState({isInitiator: true});
        //createPeer();
        //console.log("HERE inside sendConnect");
        this.state.socket.emit('sendConnect', this.state.dest_id, this.state.clientId, this.state.room);
        console.log("Function finished allConnect",this.state);
        return true;
        //console.log(id);
    }

    t(){
        console.log(Date.now());
    }

    createPeer(id){
        console.log("Function: createPeer")
        console.log(this.state);
        //console.log(id);

        //var connect = document.getElementById('connect');
        //connect.style.display = 'block';

        console.log('Creating Peer connection as initiator?');
        let tmp = this.state.connections;
        let tmp1 = this.state.datachannels;
        tmp[id] = new RTCPeerConnection(this.state.configuration);
        console.log(this.state);

        tmp[id].onicecandidate = (event) => {
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
        this.setState({connections:tmp});
        console.log(this.state);

        if (this.state.isInitiator) {
            console.log('Creating Data Channel');
            tmp1[id] = this.state.connections[id].createDataChannel('files');
            tmp1[id].binaryType = 'arraybuffer';
            this.setState({datachannels: tmp1});
            this.onDataChannelCreated(id);

            console.log('Creating an offer');
            this.state.connections[id].createOffer().then((offer) => {
                return this.state.connections[id].setLocalDescription(offer);
            })
                .then(() => {
                    console.log('sending local desc:', this.state.connections[id].localDescription);
                    this.sendMessage(this.state.connections[id].localDescription, id);
                })
                .catch(this.logError);

        } else {
            //console.log(peerConn);
            //console.log("Inside else");
            tmp[id].ondatachannel = (event) => {
                console.log('ondatachannel:', event.channel);
                tmp1[id] = event.channel;
                tmp1[id].binaryType = 'arraybuffer';
                this.setState({datachannels: tmp1});
                this.onDataChannelCreated(id);
            };
            this.setState({connections:tmp});
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

    onDataChannelCreated (id){
        console.log("Function: onDataChannelCreated")

        let channel = this.state.datachannels;
        console.log('onDataChannelCreated:', channel[id]);
        console.log(channel[id].readyState);
        channel[id].onopen = () => {
            console.log('CHANNEL opened!!!');
            //sendBtn.disabled = false;
        };

        channel[id].onclose = () => {
            console.log('Channel closed.');
            // currentState.sendBtn = false;
        }

        channel[id].onmessage = async (event) => {
            const { data } = event;
            try {
                //console.log(data);
                if (data !== END_OF_FILE_MESSAGE) {
                    //console.log("DATA");
                    var tmp = this.state.chunks;
                    tmp.push(data);
                    this.setState({chunks:tmp});
                } else {
                    //console.log("ASSEMBLY");
                    let abWithMime = this.state.chunks.reduce((acc, arrayBuffer) => {
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
        this.setState({datachannels: channel});
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
        this.setState({downloadList: html});
        this.setState({chunks: []});
            console.log("Function finished render1",this.state);
    }

    signalingMessageCallback (message, id) {
        console.log("Function: signalingMessageCallback")
        if (message.type === 'offer') {
            console.log('Got offer. Sending answer to peer.');
            //console.log(message)
            //var temp = new RTCSessionDescription(message);
            //console.log(peerConn);
            //peerConn.setRemoteDescription(temp).then(() => {}).catch(logError);
            console.log(id);
            this.state.connections[id].setRemoteDescription(new RTCSessionDescription(message), () => {},
                this.logError);
            this.state.connections[id].createAnswer().then((answer) => {
                this.onLocalSessionCreated(answer,id);
            }).catch(this.logError);
        } else if (message.type === 'answer') {
            console.log('Got answer.');
            this.state.connections[id].setRemoteDescription(new RTCSessionDescription(message), () => {},
                this.logError);
        } else if (message.type === 'candidate') {
            console.log("Candidate");
            this.state.connections[id].addIceCandidate(new RTCIceCandidate({
                candidate: message.candidate,
                sdpMLineIndex: message.label,
                sdpMid: message.id
            }));
        }
            console.log("Function finished signalingMessageCallback",this.state);
    }

    onLocalSessionCreated (desc,id) {
        console.log("Function: onLocalSessionCreated")
        console.log('local session created:', desc);
        this.state.connections[id].setLocalDescription(desc).then(() => {
            console.log('sending local desc:', this.state.connections[id].localDescription);
            this.sendMessage(this.state.connections[id].localDescription, id);
        }).catch(this.logError);
            console.log("Function finished onLocalSessionCreated",this.state);
    }

    async sendFile(id){
        for(var i=0; i<this.state.clientList.length; i++){
            if(this.state.clientId === this.state.clientList[i]) continue;
            else{
                id = this.state.clientList[i];
            }
        }
        console.log("Function: sendFile")
        // console.log(element);
        // var id = element.getAttribute("id");
        var fileInput = document.getElementById('file')
        var file = fileInput.files[0];
        //console.log(id);

        if(file){
            let arrayBuffer = await file.arrayBuffer();
            let mime = file.type;
            let abWithMime = arrayBufferWithMime(arrayBuffer, mime)
            console.log(arrayBuffer, mime, abWithMime);
            let dataChannel = this.state.datachannels[id];
            console.log('onDataChannelCreated:', dataChannel);
            console.log(dataChannel.readyState);
            console.log(id);

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
        // let currentState = this.state;
        if (!this.state.room) {
            this.state.room = window.location.hash = "1";
            //console.log("HERE"+room)
        }
        this.state.socket = socketIOClient.connect(ENDPOINT, {reconnect: true});

        this.state.socket.emit('create or join', this.state.room);

        this.state.socket.on('Display clients', (clientsInRoom, isAllConnect) => {
            console.log("Listener: Display Clients")
            console.log(this.state);
            this.setState({clientList: clientsInRoom});
            this.renderClients();
            if(isAllConnect) this.allConnect();
            //console.log(senders);
            //console.log(clientList);
            console.log("Listener finished Display clients",this.state);
        });

        this.state.socket.on('ready', (dest_Id) => {
            console.log("Listener: ready")
            console.log("Inside ready");
            console.log(dest_Id);
            this.t();
            this.createPeer(dest_Id);
            this.t();
                    console.log("Listener finished ready",this.state);
            });

        this.state.socket.on('reset', () => {
            console.log("Listener: reset")
            window.location.reload();
                    console.log("Listener finished reset",this.state);
            });

        this.state.socket.on('sendConnect', (dest_Id) => {
            console.log("Listener: sendConnect")
            // console.log("Current State", currentState);
            console.log("this State", this.state);
            this.setState({dest_id: dest_Id});
            this.setState({isInitiator: false});
            console.log(this.state);
            this.t();
            console.log(this.state.dest_id);
            this.createPeer(this.state.dest_id);
            this.t();
            this.state.socket.emit('ready', this.state.dest_id, this.state.clientId);
            console.log("Listener finished sendConnect",this.state);
            return true;
            });

        this.state.socket.on('socketid', (id) => {
            console.log("Listener: socketid")
            this.setState({clientId: id});
            console.log("Received clientid" + this.state.clientId);
                    console.log("Listener finished socketid",this.state);
            });

        this.state.socket.on('log', (array) => {
            console.log("Listener: log")
            console.log.apply(console, array);
                    console.log("Listener finished log",this.state);
            });

        this.state.socket.on('message', (message, id) => {
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