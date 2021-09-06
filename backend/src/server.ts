import { Server } from 'socket.io'
import http from 'http'

type User = {
    socketId: string
    email?: string
}

let users: User[] = []

const user = {
    remove(socketId: string) {
        users = users.filter(user => user.socketId !== socketId)
    },
    add(socketId: string) {
        users.push({ socketId })
    },
    login(socketId: string, email: string) {
        users = users.map(user => {
            if(user.socketId === socketId) {
                user.email = email
            }

            return user
        })
    },
    logout(socketId: string) {
        users = users.map(user => {
            if(user.socketId === socketId) {
                user.email = undefined
            }

            return user
        })
    }
}

const server = http.createServer()
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
})

io.on('connection', socket => {
    
    user.add(socket.id)
    socket.join('room')
    socket.to('room').emit('members')

    socket.on('disconnect', () => {
        user.remove(socket.id)
    })

    // =======================================

    console.log(`Novo usuário conectado: ${socket.id}`)

    socket.on('peer', data => {

        socket.emit('peer-response', data)
    })

})

server.listen(3333)