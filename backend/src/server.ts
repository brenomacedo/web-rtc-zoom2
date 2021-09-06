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
    
    users.push({
        socketId: socket.id
    })

    socket.on('disconnect', socket => {
        
    })
})

server.listen(3333)