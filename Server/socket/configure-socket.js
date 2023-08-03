import { Server } from 'socket.io'
import ChatService from '../dao/Services/chat.service.js'
import productsModel from '../dao/models/products.model.js'
const chat = new ChatService()
const messages = [];

export default function configureSocket(httpServer){
    
    const socketServer = new Server(httpServer)
    socketServer.on('connection', async (socket) =>{
        console.log('socket conectado')
        const allProducts = await productsModel.find()
        socket.emit('products_actuales', allProducts);

        socket.on('message', data =>{
            console.log({user: data.user, message: data.message})
            messages.push(data)
            chat.addMessage(data)
            socketServer.emit('messageLogs', messages)
        })
        socket.on('new_user', (data) =>{
            console.log('New user: ', data)
            socket.emit('messageLogs', messages)
            socket.broadcast.emit('user_connected', (data))
        })
    })

}