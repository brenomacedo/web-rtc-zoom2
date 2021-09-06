import React, { useEffect, useRef } from 'react'
import './App.css'
import socket from './socket'
import Peer from 'simple-peer'


function App() {

	const videoRef = useRef<HTMLVideoElement>(null)

	useEffect(() => {

		socket.on('members', () => {
			console.log('Novo usuário conectado!')
		})

		function gotMedia (stream: MediaStream) {
			var peer1 = new Peer({ initiator: true, stream: stream })
			var peer2 = new Peer()
		  
			peer1.on('signal', data => {
			  peer2.signal(data)
			})
		  
			peer2.on('signal', data => {
			  peer1.signal(data)
			})
		  
			peer2.on('stream', stream => {
			  // got remote video stream, now let's show it in a video tag
				if(!videoRef.current) {
					return
				}
				videoRef.current.srcObject = stream
				videoRef.current.play()
			})
		  }

		navigator.mediaDevices.getUserMedia({
			video: true, audio: true
		}).then(gotMedia).catch(() => alert('Deu ruim galera'))

	}, [])

    return (
        <div className="App">
			<button onClick={() => {}}>BOTAO FODA</button>
			<video ref={videoRef}></video>
        </div>
    )
}

export default App;
