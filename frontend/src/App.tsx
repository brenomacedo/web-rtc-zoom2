import React, { useEffect, useRef, useState } from 'react'
import './App.css'
import socket from './socket'
import Peer from 'simple-peer'


function App() {

	const [email, setEmail] = useState('')
	const [emailToCall, setEmailToCall] = useState('')

	const videoRef = useRef<HTMLVideoElement>(null)

	const register = () => {
		socket.emit('login', email)
	}

	const call = () => {

		function gotMedia (stream: MediaStream) {
			var peer = new Peer({ initiator: true, stream: stream })

			socket.on('signal', data => {
				console.log('Novo sinal recebido')
				peer.signal(data)
			})
		  
			peer.on('signal', data => {
				socket.emit('signal', { data, email: emailToCall })
			})
		  
			peer.on('stream', stream => {
				// got remote video stream, now let's show it in a video tag
				if(!videoRef.current) {
					return
				}
				videoRef.current.srcObject = stream
				videoRef.current.play()
			})

			peer.on('close', () => alert('conexão fechou'))
			peer.on('error', () => alert('conexão fechou'))
		}

		navigator.mediaDevices.getUserMedia({
			video: true, audio: true
		}).then(gotMedia).catch(() => alert('Deu ruim galera'))
	}

    return (
        <div className="App">
			<video ref={videoRef}></video>
			<div className="register">
				<input type="text" value={email} onChange={e => setEmail(e.target.value)} />
				<button onClick={register}>REGISTRAR</button>
			</div>
			<br />
			<div className="call">
				<input type="text" value={emailToCall} onChange={e => setEmailToCall(e.target.value)} />
				<button onClick={call}>CALL</button>
			</div>
        </div>
    )
}

export default App;
