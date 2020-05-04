const io = require('socket.io')(process.env.PORT || 80)

const arrUsers = [];

io.on('connection', (socket) => {
    console.log(`${socket.id} connected`);
    socket.on('user_signup', (data) => {
        const isExst = arrUsers.some(e => e.userName == data.userName)
        socket.peerUserName = data.userName
        if(isExst) {
            socket.emit("Fail")
        }else {
            arrUsers.push(data)
            socket.broadcast.emit('signup_notifications', data)
            socket.emit('load_video_section')
        }
    })
    socket.on('disconnect', () => {
        var index = arrUsers.findIndex(user => user.userName == socket.peerUserName)
        arrUsers.splice(index, 1)
        io.emit('user_signout', socket.peerUserName)
    })
})