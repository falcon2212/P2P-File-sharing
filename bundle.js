var configuration = {
  'iceServers': [{
    'urls': 'stun:stun.l.google.com:19302'
  }]
};

//async function() send{};

const MAXIMUM_MESSAGE_SIZE = 65535;
const END_OF_FILE_MESSAGE = 'EOF';


var link = null;
var chunks = [];
var clientList;
var isInitiator;
var clientId;
var dest_id;
//var configuration = null;
var dataChannel;
var peerConn;
var room = window.location.hash.substring(1);
var sendBtn = document.getElementById('send');
var online = document.getElementById('online');
var connect = document.getElementById('connect');
var socket = io.connect();
var connections = {};
var datachannels = {};

var alias;

(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
  'use strict';
  
const {arrayBufferWithMime,arrayBufferMimeDecouple} = require('arraybuffer-mime');
/****************************************************************************
* Initial setup
****************************************************************************/

function t(){
    console.log(Date.now());
}

//console.log(sendBtn, connect, online);

//sendBtn.disabled = true;

if (!room) {
  room = window.location.hash = randomToken();
  //console.log("HERE"+room)
}

socket.emit('create or join', room);

socket.on('Display clients', function(clientsInRoom) {
    clientList = clientsInRoom;
    renderClients();
    allConnect();
    //console.log(senders);
    //console.log(clientList);
})

socket.on('ready', function(dest_Id){
    console.log("Inside ready");
    console.log(dest_Id);
    t();
    createPeer(dest_Id);
    t();
})

socket.on('reset', function(){
    window.location.reload();
})


socket.on('sendConnect', function(dest_Id){
    dest_id = dest_Id
    isInitiator = false;
    t();
    console.log(dest_id);
    createPeer(dest_id);
    t();
    socket.emit('ready', dest_id, clientId);
    return true;
})

socket.on('socketid', function(id){
    clientId = id;
    console.log("Received clientid" + clientId);
})

socket.on('log', function(array) {
    console.log.apply(console, array);
  });

socket.on('message', function(message, id){
    console.log('Client received message:', message);
    console.log(id);
    signalingMessageCallback(message, id);
})

function sendMessage(message, id) {
    console.log('Client sending message: ', message);
    socket.emit('message', message, id, clientId);
}

function signalingMessageCallback(message, id) {
    if (message.type === 'offer') {
      console.log('Got offer. Sending answer to peer.');
      //console.log(message)
      //var temp = new RTCSessionDescription(message);
      //console.log(peerConn);
      //peerConn.setRemoteDescription(temp).then(() => {}).catch(logError);
      console.log(id);
      connections[id].setRemoteDescription(new RTCSessionDescription(message), function() {},
                                    logError);
      connections[id].createAnswer().then(function(answer){
        onLocalSessionCreated(answer,id);
      }).catch(logError);
    } else if (message.type === 'answer') {
      console.log('Got answer.');
      connections[id].setRemoteDescription(new RTCSessionDescription(message), function() {},
                                    logError);
  
    } else if (message.type === 'candidate') {
        console.log("Candidate");
        connections[id].addIceCandidate(new RTCIceCandidate({
        candidate: message.candidate,
        sdpMLineIndex: message.label,
        sdpMid: message.id
      }));
      
    }
  }
  
  function onLocalSessionCreated(desc,id) {
    console.log('local session created:', desc);
    connections[id].setLocalDescription(desc).then(function() {
      console.log('sending local desc:', connections[id].localDescription);
      sendMessage(connections[id].localDescription, id);
    }).catch(logError);
  }

  

  
function createPeer(id){
    //console.log(id);

    //var connect = document.getElementById('connect');
    //connect.style.display = 'block';
    
    console.log('Creating Peer connection as initiator?');
    connections[id] = new RTCPeerConnection(configuration);

    connections[id].onicecandidate = function(event) {
        console.log('icecandidate event:', event);
        if (event.candidate) {
          sendMessage({
            type: 'candidate',
            label: event.candidate.sdpMLineIndex,
            id: event.candidate.sdpMid,
            candidate: event.candidate.candidate
          },id);
        } else {
          console.log('End of candidates.');
        }
      };

    if (isInitiator) {
    console.log('Creating Data Channel');
    datachannels[id] = connections[id].createDataChannel('files');
    datachannels[id].binaryType = 'arraybuffer';
    onDataChannelCreated(datachannels[id]);
    
    console.log('Creating an offer');
    connections[id].createOffer().then(function(offer) {
        return connections[id].setLocalDescription(offer);
    })
    .then(() => {
        console.log('sending local desc:', connections[id].localDescription);
        sendMessage(connections[id].localDescription, id);
    })
    .catch(logError);
    
    } else {
        //console.log(peerConn);
        //console.log("Inside else");
        connections[id].ondatachannel = function(event) {
        console.log('ondatachannel:', event.channel);
        datachannels[id] = event.channel;
        datachannels[id].binaryType = 'arraybuffer';
        onDataChannelCreated(datachannels[id]);
    };
    }
    //senders[id]=[peerConn, dataChannel];
}


/*function sendFile(){

    var fileInput = document.getElementById('file')
    var file = fileInput.files[0];
    var fileReader = new FileReader();
    var MAX_FSIZE = 2.0;

    if(file){
        var mbSize = file.size / (1024 * 1024);
        if (mbSize > MAX_FSIZE) {
            alert("Your file is too big, sorry.");
            // Reset file input
            return;
        }
        fileReader.onload = (e) => { onReadAsDataURL(e, null) };
        fileReader.readAsDataURL(file);
        render();
    }
}*/

function dummy(event, something){
    console.log("Inside dummy");
}

/*function onReadAsDataURL(event, text){
    var chunkLength = 1024*1024;
    var data = {};
    if (event) {
        text = event.target.result;
    }
    if (text.length > chunkLength) {
        data.message = text.slice(0, chunkLength);
        data.last = false;
    }
    else
    {
        data.message = text;
        data.last = true;
    }
    dataChannel.send(JSON.stringify(data));
    var remainingURL = text.slice(data.message.length);
    if(remainingURL.length){
        onReadAsDataURL(null, remainingURL);
    }
}*/



function onDataChannelCreated(channel){

    console.log('onDataChannelCreated:', channel);
    console.log(channel.readyState);
    channel.onopen = function() {
      console.log('CHANNEL opened!!!');
      //sendBtn.disabled = false;
    };
  
    channel.onclose = function () {
      console.log('Channel closed.');
      sendBtn.disabled = true;
    }

    channel.onmessage = async (event) => {
      const { data } = event;
      try {
        //console.log(data);
        if (data !== END_OF_FILE_MESSAGE) {
          //console.log("DATA");
          chunks.push(data);
        } else {
          //console.log("ASSEMBLY");
          let abWithMime = chunks.reduce((acc, arrayBuffer) => {
            const tmp = new Uint8Array(acc.byteLength + arrayBuffer.byteLength);
            tmp.set(new Uint8Array(acc), 0);
            tmp.set(new Uint8Array(arrayBuffer), acc.byteLength);
            return tmp;
          }, new Uint8Array());
          const {mime, arrayBuffer} = arrayBufferMimeDecouple(abWithMime)
          const blob = new Blob([arrayBuffer], {type : mime});
          console.log(mime);
          render(blob, "download");
          //channel.close();
        }
      } catch (err) {
        console.log(err);
        console.log('File transfer failed');
      }
    };
  };   

/*function receiveFile(event){
    var data = JSON.parse(event.data);
    chunks.push(data.message);
    if(data.last)
    {
        link = chunks.join('');
        //console.log(link);  
        chunks = [];
    }
    render();
}*/


function render(blob, fileName){
  
    var downloadList = document.getElementById('downloadList');
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
    downloadList.innerHTML = html;
    chunks = []
    //console.log("HERE");
    /*
    const a = document.createElement('a');
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();*/
}




//document.getElementById('send').onclick = sendFile;


function renderClients(){
    var online = document.getElementById('online');
    var memberList = document.getElementById('memberList');
    
    var onlineUsers = ((clientList.length === 0) ? 0 : (clientList.length - 1) );

    online.innerHTML = 'Users online (' + (onlineUsers) +   ')';

    var html = '';
    //console.log(clientList);
    if(clientList.length === 1)
    {
        html+= '<li> No members online</li>';
        memberList.innerHTML = html;
        return;
    }

    for(var i=0; i<clientList.length; i++)
    {
        var element = clientList[i];
        if(element === clientId) continue;
        html+= '<li><small>'+element+'<button class="demo-chat-send btn btn-success" onClick = alias("'+element+'")>Send</button></small></li>';
    }
    memberList.innerHTML = html;
}

async function sendFile(id){

  var fileInput = document.getElementById('file')
  var file = fileInput.files[0];
  //console.log(id);

  if(file){
    let arrayBuffer = await file.arrayBuffer();
    let mime = file.type;
    let abWithMime = arrayBufferWithMime(arrayBuffer, mime)
    console.log(arrayBuffer, mime, abWithMime);
    let dataChannel = datachannels[id];
    
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
}

alias = sendFile;

function randomToken() {
    return Math.floor((1 + Math.random()) * 1e16).toString(16).substring(1);
  }

function logError(err) {
  if (!err) return;
  if (typeof err === 'string') {
    console.warn(err);
  } else {
    console.warn(err.toString(), err);
  }
}
},{"arraybuffer-mime":3}],2:[function(require,module,exports){
(function(root) {
  'use strict'

  function isValidArray(x) {
    return /Int8Array|Int16Array|Int32Array|Uint8Array|Uint8ClampedArray|Uint16Array|Uint32Array|Float32Array|Float64Array|ArrayBuffer/gi.test(Object.prototype.toString.call(x))
  }

  function arrayBufferConcat(/* arraybuffers */) {
    var arrays = [].slice.call(arguments)

    if (arrays.length <= 0 || !isValidArray(arrays[0])) {
      return new Uint8Array(0).buffer
    }

    var arrayBuffer = arrays.reduce(function(cbuf, buf, i) {
      if (i === 0) return cbuf
      if (!isValidArray(buf)) return cbuf

      var tmp = new Uint8Array(cbuf.byteLength + buf.byteLength)
      tmp.set(new Uint8Array(cbuf), 0)
      tmp.set(new Uint8Array(buf), cbuf.byteLength)

      return tmp.buffer
    }, arrays[0])

    return arrayBuffer
  }

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = arrayBufferConcat
    }
    exports.arrayBufferConcat = arrayBufferConcat
  } else if (typeof define === 'function' && define.amd) {
    define([], function() {
      return arrayBufferConcat
    })
  } else {
    root.arrayBufferConcat = arrayBufferConcat
  }
})(this)

},{}],3:[function(require,module,exports){
const arrayBufferConcat = require('arraybuffer-concat')

function arrayBufferWithMime(arrayBuffer, mime) {
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

function arrayBufferMimeDecouple(arrayBufferWithMime) {
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

module.exports = {
  arrayBufferWithMime: arrayBufferWithMime,
  arrayBufferMimeDecouple: arrayBufferMimeDecouple
}

},{"arraybuffer-concat":2}]},{},[1]);

async function sendConnect(id){
  //socket.emit('reset', room);
  dest_id = id;
  isInitiator = true;
  //createPeer();
  //console.log("HERE inside sendConnect");
  socket.emit('sendConnect', dest_id, clientId, room);
  return true;
  //console.log(id);
}

function allConnect(){
    /*senders = {};
    let temp1 = [];
    for(let i = 0;i<clientList.length;i++)
    {
      var element = clientList[i];
      if(element === clientId) continue;
      //senders[element] = {};
      var temp = {title: element, task: () => {sendConnect(element);}}
      temp1.push(temp);
    }
    const tasks = new Listr(temp1);
    await tasks.run();*/
    connections = {};
    datachannels = {};
    for(let i = 0;i<clientList.length;i++)
    {
      var element = clientList[i];
      if(element === clientId) continue;
      sendConnect(element);
    }
}

function temp(id){
  console.log(id);
  alias(id);
}
