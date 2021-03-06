const client = io.connect("https://call-video-rtc.herokuapp.com", {secure: true});
// const client = io('http://localhost:6969');
const arrRemote = [];
client.on('signup_notifications', (data) => {
    $('#userName').val("");
    $('#userInfo').append(`<li class="list-group-item" id="${data.id}" onclick="startStream('${data.id}')"> ${data.userName} </li>`)
})

client.on("Fail", () => alert("Đăng ký thất bại"))

client.on('user_signout', (data) => {
    alert(`${data} disconnected`)
    $(`#${data}`).remove()
})

client.on('load_video_section', () => $('.videoContent').show())

function openStream() {
    const config = { audio: true, video: true };
    return navigator.mediaDevices.getUserMedia(config);
}

function playStream(idVideoTag, stream) {
    const video = document.getElementById(idVideoTag);
    video.srcObject = stream
    video.play();
}
var peer = new Peer({
    host: 'call-video-peersv.herokuapp.com',
    // port: 39122,
    path: '/peerjs',
    secure: true
});
// var peer = new Peer();
peer.on('open', id => {
    $('#nameLocalSection').append(`<h3>My ID: ${id}</h3>`);
    $('#btnSignUp').click(() => {
        var userName = $('#userName').val();
        client.emit('user_signup', {userName: userName, id: id});       
    })
});

$('document').ready(() => {
    // $('#btnCall').click(() => {
    //     const id = $('#remoteId').val();
    //     openStream()
    //     .then(stream => {
    //         playStream('localStream', stream);
    //         const call = peer.call(id, stream);
    //         call.on('stream', remoteStream => playStream('remoteStream', remoteStream))
    //     }), (err) => {
    //         console.log('Failed to get local stream' ,err);
    //     }
    // })

    $('.videoContent').hide()
})

peer.on('call', call => {
    $('#container').append(`<div class="row">
                                <div class="col-12 videoContent">
                                    <video id="${call.peer + 'remote'}" controls></video>
                                </div>
                            </div>`)
    openStream()
    .then(stream => {
        call.answer(stream);
        playStream('localStream', stream);
        call.on('stream', remoteStream => playStream(call.peer + 'remote', remoteStream));
    })
})

function startStream(id){
    $('#container').append(`<div class="row">
                                <div class="col-12 videoContent">
                                    <video id="${id + 'remote'}" controls></video>
                                </div>
                            </div>`)
    arrRemote.push(id)
    openStream()
    .then(stream => {
        playStream('localStream', stream)
        const call = peer.call(id, stream)
        call.on('stream', remoteStream => playStream(id + 'remote', remoteStream))
    })
}