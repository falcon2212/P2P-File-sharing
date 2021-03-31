'use strict';

/****************************************************************************
* Initial setup
****************************************************************************/

// var configuration = {
//   'iceServers': [{
//     'urls': 'stun:stun.l.google.com:19302'
//   }]
// };

function t(){
    console.log(Date.now());
}


var link = null;
var chunks = [];
var clientList;
var isInitiator;
var clientId;
var dest_id;
var configuration = null;
var dataChannel;
var peerConn;
var room = window.location.hash.substring(1);
var sendBtn = document.getElementById('send');
var online = document.getElementById('online');
var connect = document.getElementById('connect');

console.log(sendBtn, connect, online);

//sendBtn.disabled = true;

if (!room) {
  room = window.location.hash = randomToken();
  //console.log("HERE"+room)
}

var socket = io.connect();

socket.emit('create or join', room);

socket.on('Display clients', function(clientsInRoom) {
    clientList = clientsInRoom;
    renderClients();
    //console.log(clientList);
})

socket.on('ready', function(){
    console.log("Inside ready");
    //console.log(clientId);
    t();
    createPeer();
    t();
})

socket.on('reset', function(){
    window.location.reload();
})


socket.on('sendConnect', function(dest_Id){
    dest_id = dest_Id
    isInitiator = false;
    t();
    createPeer();
    t();
    socket.emit('ready', dest_id);
})

socket.on('socketid', function(id){
    clientId = id;
    console.log("Received clientid" + clientId);
})

socket.on('log', function(array) {
    console.log.apply(console, array);
  });

socket.on('message', function(message){
    console.log('Client received message:', message);
    signalingMessageCallback(message);
})

function sendMessage(message, id) {
    console.log('Client sending message: ', message);
    socket.emit('message', message, id);
}

function signalingMessageCallback(message) {
    if (message.type === 'offer') {
      console.log('Got offer. Sending answer to peer.');
      //console.log(message)
      //var temp = new RTCSessionDescription(message);
      //console.log(peerConn);
      //peerConn.setRemoteDescription(temp).then(() => {}).catch(logError);
      peerConn.setRemoteDescription(new RTCSessionDescription(message), function() {},
                                    logError);
      peerConn.createAnswer(onLocalSessionCreated, logError);
  
    } else if (message.type === 'answer') {
      console.log('Got answer.');
      peerConn.setRemoteDescription(new RTCSessionDescription(message), function() {},
                                    logError);
  
    } else if (message.type === 'candidate') {
        console.log("Candidate");
      peerConn.addIceCandidate(new RTCIceCandidate({
        candidate: message.candidate,
        sdpMLineIndex: message.label,
        sdpMid: message.id
      }));
      
    }
  }
  
  function onLocalSessionCreated(desc) {
    console.log('local session created:', desc);
    peerConn.setLocalDescription(desc).then(function() {
      console.log('sending local desc:', peerConn.localDescription);
      sendMessage(peerConn.localDescription, dest_id);
    }).catch(logError);
  }

  function sendConnect(id){
    socket.emit('reset', room);
    dest_id = id;
    isInitiator = true;
    //createPeer();
    socket.emit('sendConnect', dest_id, clientId, room);
    //console.log(id);
  }

  
function createPeer(){
    //console.log(id);

    //var connect = document.getElementById('connect');
    //connect.style.display = 'block';
    
    console.log('Creating Peer connection as initiator?');
    peerConn = new RTCPeerConnection(configuration);

    peerConn.onicecandidate = function(event) {
        console.log('icecandidate event:', event);
        if (event.candidate) {
          sendMessage({
            type: 'candidate',
            label: event.candidate.sdpMLineIndex,
            id: event.candidate.sdpMid,
            candidate: event.candidate.candidate
          },dest_id);
        } else {
          console.log('End of candidates.');
        }
      };

    if (isInitiator) {
    console.log('Creating Data Channel');
    dataChannel = peerConn.createDataChannel('files', {reliable : false});
    onDataChannelCreated(dataChannel);
    
    console.log('Creating an offer');
    peerConn.createOffer().then(function(offer) {
        return peerConn.setLocalDescription(offer);
    })
    .then(() => {
        console.log('sending local desc:', peerConn.localDescription);
        sendMessage(peerConn.localDescription, dest_id);
    })
    .catch(logError);
    
    } else {
        //console.log(peerConn);
        //console.log("Inside else");
    peerConn.ondatachannel = function(event) {
        console.log('ondatachannel:', event.channel);
        dataChannel = event.channel;
        onDataChannelCreated(dataChannel);
    };
    }

}

function sendFile(){

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
}

function dummy(event, something){
    console.log("Inside dummy");
}

function onReadAsDataURL(event, text){
    var chunkLength = 1024;
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
}


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

    channel.onmessage = receiveFile;

}   

function receiveFile(event){
    var data = JSON.parse(event.data);
    chunks.push(data.message);
    if(data.last)
    {
        link = chunks.join('');
        //console.log(link);  
        chunks = [];
    }
    render();
}

function render(){
    var downloadList = document.getElementById('downloadList');
    var html = '';
    if(link)
    {
        var downloadlink = '<a href=' + link + '> download now </a> ';
        html+='<li><small>' + downloadlink + '</small></li>';
    }
    else
    {
        html += '<li>No files available here</li>';
    }
    downloadList.innerHTML = html;
}


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
        html+= '<li><small>' + element + '<button class = "btn btn-xs btn-success" onclick = sendConnect("' + element + '")>Connect</button></small></li>' ;
    }
    memberList.innerHTML = html;
}

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