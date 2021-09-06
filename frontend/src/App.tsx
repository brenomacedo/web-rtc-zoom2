import React, { useEffect } from 'react'
import './App.css'
import socket from './socket'


function App() {

	useEffect(() => {

		socket.emit('login', 'b88660501@gmail.com')

	}, [])

	const sendMessage = () => {
		socket.emit('message', 'hello world')
	}

    return (
        <div className="App">
			<button onClick={sendMessage}>BOTAO FODA</button>
        </div>
    )
}

export default App;
