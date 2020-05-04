function openStream() {
    const config = { audio: true, video: true };
    return navigator.mediaDevices.getUserMedia(config);
}

function playStream(idVideoTag, stream) {
    const video = document.getElementById(idVideoTag);
    video.srcObject = stream
    video.play();
}

var peer = new Peer();
peer.on('open', id => $('#nameLocalSection').append(`<h3>My ID: ${id}</h3>`));

$('document').ready(() => {
    $('#btnCall').click(() => {
        const id = $('#remoteId').val();
        openStream()
        .then(stream => {
            playStream('localStream', stream);
            const call = peer.call(id, stream);
            call.on('stream', remoteStream => playStream('remoteStream', remoteStream))
        }), (err) => {
            console.log('Failed to get local stream' ,err);
        }
    })
})

peer.on('call', call => {
    openStream()
    .then(stream => {
        call.answer(stream);
        playStream('localStream', stream);
        call.on('stream', remoteStream => playStream('remoteStream', remoteStream));
    })
})