import React, { useState, useEffect, Component } from "react";
import "./dashboard.css";
import socketIOClient from "socket.io-client";
import {Button, Col, Container, FormFile, ListGroup, Row} from "react-bootstrap";
import {ArrowUpSquareFill} from "react-bootstrap-icons";

const MAXIMUM_MESSAGE_SIZE = 65535;
const END_OF_FILE_MESSAGE = 'EOF';
const {arrayBufferWithMime,arrayBufferMimeDecouple} = require('arraybuffer-mime');
const arrayBufferConcat = require('arraybuffer-concat')

let APP_CONFIG = require("../config/app_config");
const ENDPOINT = APP_CONFIG.BACKEND_ENDPOINT;

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            configuration : {
                'iceServers': [{
                    'urls': 'stun:stun.l.google.com:19302'
                }]
            },
            room:null,
            chunks : [],
            clientList: [],
            isInitiator: null,
            clientId: null,
            dest_id: null,
            dataChannel: null,
            connections : {},
            datachannels : {},
            online: null,
            memberList: [],
            file:null,
            socket:null,
            downloadList:null,
            usernames:{},
            username:this.props.login_data.login_credentials.username,
            device:this.props.login_data.login_credentials.device,
            online_users:[],
        };
    }

    renderClients (){
        var onlineUsers = ((this.state.online_users.length === 0) ? 0 : (this.state.online_users.length - 1) );

        this.setState({online: onlineUsers});

        var html = [];
        if(this.state.online_users.length === 1)
        {
            this.setState({memberList: html});
            return;
        }

        for(var i=0; i<this.state.online_users.length; i++)
        {
            var element = this.state.online_users[i];
            if(element.clientId === this.state.clientId) continue;
            html.push(element);
            this.setState({memberList: html});

        }
    }

    allConnect (){
        this.setState({connections: {}});
        this.setState({datachannels: {}});
        for(let i = 0;i<this.state.online_users.length;i++){
            var element = this.state.online_users[i];
            if(element.clientId === this.state.clientId) continue;
            this.sendConnect(element);
        }
    }

    async sendConnect (element){
        this.setState({dest_id: element.clientId});
        this.setState({isInitiator: true});
        this.state.socket.emit('sendConnect', this.state.dest_id, this.state.clientId, this.state.room, this.props.login_data.login_credentials.username);
        return true;
    }

    t(){
        console.log(Date.now());
    }

    createPeer(id){

        //var connect = document.getElementById('connect');
        //connect.style.display = 'block';

        let tmp = this.state.connections;
        let tmp1 = this.state.datachannels;
        tmp[id] = new RTCPeerConnection(this.state.configuration);

        tmp[id].onicecandidate = (event) => {
            if (event.candidate) {
                this.sendMessage({
                    type: 'candidate',
                    label: event.candidate.sdpMLineIndex,
                    id: event.candidate.sdpMid,
                    candidate: event.candidate.candidate
                },id);
            } else {
            }
        };
        this.setState({connections:tmp});

        if (this.state.isInitiator) {
            tmp1[id] = this.state.connections[id].createDataChannel('files');
            tmp1[id].binaryType = 'arraybuffer';
            this.setState({datachannels: tmp1});
            this.onDataChannelCreated(id);

            this.state.connections[id].createOffer().then((offer) => {
                return this.state.connections[id].setLocalDescription(offer);
            })
                .then(() => {
                    this.sendMessage(this.state.connections[id].localDescription, id);
                })
                .catch(this.logError);

        } else {
            tmp[id].ondatachannel = (event) => {
                tmp1[id] = event.channel;
                tmp1[id].binaryType = 'arraybuffer';
                this.setState({datachannels: tmp1});
                this.onDataChannelCreated(id);
            };
            this.setState({connections:tmp});
        }
    }

    sendMessage (message, id) {
        this.state.socket.emit('message', message, id, this.state.clientId);
    }

    onDataChannelCreated (id){

        let channel = this.state.datachannels;
        channel[id].onopen = () => {
        };

        channel[id].onclose = () => {
            // currentState.sendBtn = false;
        }

        channel[id].onmessage = async (event) => {
            const { data } = event;
            try {
                if (data !== END_OF_FILE_MESSAGE) {
                    var tmp = this.state.chunks;
                    tmp.push(data);
                    this.setState({chunks:tmp});
                } else {
                    let abWithMime = this.state.chunks.reduce((acc, arrayBuffer) => {
                        const tmp = new Uint8Array(acc.byteLength + arrayBuffer.byteLength);
                        tmp.set(new Uint8Array(acc), 0);
                        tmp.set(new Uint8Array(arrayBuffer), acc.byteLength);
                        return tmp;
                    }, new Uint8Array());
                    const {mime, arrayBuffer} = arrayBufferMimeDecouple(abWithMime)
                    const blob = new Blob([arrayBuffer], {type : mime});
                    this.render1(blob, "download");
                    //channel.close();
                }
            } catch (err) {
            }
        };
        this.setState({datachannels: channel});
    };

    logError (err) {
        if (!err) return;
        if (typeof err === 'string') {
            console.warn(err);
        } else {
            console.warn(err.toString(), err);
        }
    }

    render1 (blob, fileName){
        var html;
        const url = window.URL.createObjectURL(blob);
        if(url)
        {
            html = <li><small><a href={url} download={fileName}>Incoming file</a></small></li> ;
        }
        else
        {
            html = <li>No files available here</li>;
        }
        this.setState({downloadList: html});
        this.setState({chunks: []});
    }

    signalingMessageCallback (message, id) {
        if (message.type === 'offer') {
            this.state.connections[id].setRemoteDescription(new RTCSessionDescription(message), () => {},
                this.logError);
            this.state.connections[id].createAnswer().then((answer) => {
                this.onLocalSessionCreated(answer,id);
            }).catch(this.logError);
        } else if (message.type === 'answer') {
            this.state.connections[id].setRemoteDescription(new RTCSessionDescription(message), () => {},
                this.logError);
        } else if (message.type === 'candidate') {
            this.state.connections[id].addIceCandidate(new RTCIceCandidate({
                candidate: message.candidate,
                sdpMLineIndex: message.label,
                sdpMid: message.id
            }));
        }
    }

    onLocalSessionCreated (desc,id) {
        this.state.connections[id].setLocalDescription(desc).then(() => {
            this.sendMessage(this.state.connections[id].localDescription, id);
        }).catch(this.logError);
    }

    async sendFile(ev){
        let id = ev.target.value;
        // for(var i=0; i<this.state.clientList.length; i++){
        //     if(this.state.clientId === this.state.clientList[i]) continue;
        //     else{
        //         id = this.state.clientList[i];
        //     }
        // }
        // var id = element.getAttribute("id");
        // var fileInput = document.getElementById('file')
        var file = this.state.file;

        if(file){
            let arrayBuffer = await file.arrayBuffer();
            let mime = file.type;
            let abWithMime = arrayBufferWithMime(arrayBuffer, mime)
            let dataChannel = this.state.datachannels[id];

            for (let i = 0; i < abWithMime.byteLength; i += MAXIMUM_MESSAGE_SIZE) {
                dataChannel.send(abWithMime.slice(i, i + MAXIMUM_MESSAGE_SIZE));
            }
            dataChannel.send(END_OF_FILE_MESSAGE);
        }
    }

    arrayBufferWithMime(arrayBuffer, mime) {
        const len = mime.length
        const uint8 = new Uint8Array(len + 1)

        uint8[0] = len

        for (var i = 0; i < len; i++) {
            var n = mime[i].charCodeAt(0)
            uint8[i+1] = n
        }

        const ab = arrayBufferConcat(uint8, arrayBuffer)

        return ab
    }

    arrayBufferMimeDecouple(arrayBufferWithMime) {
        const uint8 = new Uint8Array(arrayBufferWithMime)
        var mime = ''
        const len = uint8[0]

        for (var i = 0; i < len; i++) {
            var char = uint8[i+1]

            mime += String.fromCharCode(char)
        }

        var arrayBuffer = uint8.slice(len+1).buffer

        return {
            mime: mime,
            arrayBuffer: arrayBuffer
        }
    }

    componentDidMount() {
        console.log(this.props.login_data.room)
        // if (this.props.login_data.room !== null) {
        //     this.state.room = window.location.hash = this.props.login_data.room;
        // }
        // else {
        //     this.state.room = window.location.hash = "1";
        // }

        this.state.socket = socketIOClient.connect(ENDPOINT, {reconnect: true});

        this.state.socket.emit('create or join', this.state.username, this.state.device);

        this.state.socket.on('Display clients', (users, isAllConnect) => {
            this.setState({online_users: users});
            if(isAllConnect){
                this.state.room = window.location.hash = users[0]
            }
            this.renderClients();
            if(isAllConnect) this.allConnect();
        });

        this.state.socket.on('ready', (dest_Id, username) => {

            let users = this.state.usernames;
            users[dest_Id] = username;
            this.setState({usernames: users});

            this.t();
            this.createPeer(dest_Id);
            this.t();
        });

        this.state.socket.on('reset', () => {
            window.location.reload();
        });

        this.state.socket.on('sendConnect', (dest_Id, username) => {

            let users = this.state.usernames;
            users[dest_Id] = username;
            this.setState({usernames: users});

            this.setState({dest_id: dest_Id});
            this.setState({isInitiator: false});
            this.t();
            this.createPeer(this.state.dest_id);
            this.t();
            this.state.socket.emit('ready', this.state.dest_id, this.state.clientId, this.props.login_data.login_credentials.username);
            return true;
        });

        this.state.socket.on('socketid', (id) => {
            this.setState({clientId: id});
        });

        this.state.socket.on('log', (array) => {
        });

        this.state.socket.on('message', (message, id) => {
            this.signalingMessageCallback(message, id);
        });
    }

    componentWillUnmount() {
        this.state.socket.emit('final_step', this.state.room);
    }

    addFile(event){
        this.setState({file: event.target.files[0]});
    }

    tmp = (event) => {
    }
    createUserList() {
        let html = [];
        for(var i=0; i<this.state.memberList.length; i++){
            html.push(
                <ListGroup.Item>
                    {this.state.usernames[this.state.memberList[i]]}<Button value={this.state.memberList[i]} onClick={(ev) => this.sendFile(ev)}>Send file</Button>
                    {/*<Row className={"p-2"}>*/}
                    {/*    <Col>{this.state.memberList[i]}</Col>*/}
                    {/*    /!*<Col><Form.File onChange={(e) => {this.addFile(e)}} type={"file"} className={"custom-file-label"} label={this.state.memberList[i]} custom/></Col>*!/*/}
                    {/*    <Col className={"justify-content-end"}><Button value={this.state.memberList[i]} onClick={(ev) => this.sendFile(ev.target.value)}/></Col>*/}
                    {/*</Row>*/}
                </ListGroup.Item>
            );
        }
        return html;
    }

    render() {
        let userList = this.createUserList();
        return(
            <Container className={"justify-content-center mb-5 mt-5"}>
                <div>
                    Users online: {this.state.online}
                </div>
                <div>
                    {/*<FormFile onChange={(e) => {this.addFile(e)}} type={"file"} className={"custom-file-label"} label={"Select file"} custom/>*/}
                    <FormFile onChange={(e) => {this.addFile(e)}} type={"file"} data-browse={"Select file"}/>
                    <ul id="downloadList">{this.state.downloadList}</ul>
                </div>
                <ListGroup>
                    {userList}
                </ListGroup>
            </Container>
        );
    }
}

export {Dashboard};

