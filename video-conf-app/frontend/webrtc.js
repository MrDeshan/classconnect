// Global Variables
let localStream;
let remoteStream;
let peerConnection;
let socket;

const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const startCallButton = document.getElementById('startCallButton');
const toggleMuteButton = document.getElementById('toggleMuteButton');
const toggleCameraButton = document.getElementById('toggleCameraButton');
const toggleScreenShareButton = document.getElementById('toggleScreenShareButton');
let screenStream = null; 
let originalVideoTrack = null; 
let isScreenSharing = false;

// STUN Server Configuration
const configuration = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }
    ]
};

// Initialize WebSocket Connection
const initializeWebSocket = () => {
    socket = new WebSocket('ws://localhost:3000');

    socket.onopen = () => {
        console.log('Connected to signaling server');
        // Enable start call button once WebSocket is connected
        if (startCallButton) startCallButton.disabled = false;
        if (toggleMuteButton) toggleMuteButton.disabled = false;
        if (toggleCameraButton) toggleCameraButton.disabled = false;
        if (toggleScreenShareButton && peerConnection) toggleScreenShareButton.disabled = false; // Enable if peerConnection is ready
    };

    socket.onmessage = async (event) => {
        console.log('Received message from signaling server:', event.data);
        const message = JSON.parse(event.data);

        try {
            if (message.type === 'offer') {
                if (!peerConnection) {
                    await createPeerConnection();
                }
                await peerConnection.setRemoteDescription(new RTCSessionDescription(message.offer));
                console.log('Offer received, creating answer...');
                const answer = await peerConnection.createAnswer();
                await peerConnection.setLocalDescription(answer);
                socket.send(JSON.stringify({ type: 'answer', answer: answer }));
                console.log('Answer sent');
            } else if (message.type === 'answer') {
                if (peerConnection) {
                    await peerConnection.setRemoteDescription(new RTCSessionDescription(message.answer));
                    console.log('Answer received, connection established.');
                }
            } else if (message.type === 'candidate') {
                if (peerConnection && message.candidate) {
                    await peerConnection.addIceCandidate(new RTCIceCandidate(message.candidate));
                    console.log('ICE candidate added');
                }
            } else if (message.type === 'user-joined') {
                // This logic might be for more complex scenarios (e.g., knowing when another user is ready)
                // For a simple two-peer setup, the "Start Call" button handles initiation.
                console.log('Another user joined/is ready.');
                // If this client should initiate, it could call createOffer() here,
                // but we are using a button for that.
            }
        } catch (error) {
            console.error('Error processing message:', error);
        }
    };

    socket.onerror = (error) => {
        console.error('WebSocket error:', error);
    };

    socket.onclose = () => {
        console.log('Disconnected from signaling server');
        if (startCallButton) startCallButton.disabled = true;
    };
};

// Get User Media
const startMedia = async () => {
    console.log('Requesting user media...');
    try {
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localVideo.srcObject = localStream;
        console.log('Local media stream obtained');
        // Set initial button states now that localStream is available
        if (toggleMuteButton) {
            toggleMuteButton.disabled = false;
            toggleMuteButton.textContent = 'Mute Mic';
        }
        if (toggleCameraButton) {
            toggleCameraButton.disabled = false;
            toggleCameraButton.textContent = 'Turn Camera Off';
        }
        // Screen share button should ideally be enabled after peerConnection is also ready
        // initializeWebSocket() is called next, which will eventually lead to peerConnection setup
        initializeWebSocket();
    } catch (error) {
        console.error('Error accessing media devices.', error);
        alert('Error accessing media devices: ' + error.message);
    }
};

// Create Peer Connection
const createPeerConnection = async () => {
    console.log('Creating peer connection...');
    peerConnection = new RTCPeerConnection(configuration);

    // Add local tracks
    if (localStream) {
        localStream.getTracks().forEach(track => {
            peerConnection.addTrack(track, localStream);
        });
        console.log('Local tracks added to peer connection');
    } else {
        console.error('Local stream not available to add tracks.');
        return; // Exit if no local stream
    }

    // Handle ICE candidates
    peerConnection.onicecandidate = event => {
        if (event.candidate) {
            console.log('New ICE candidate:', event.candidate);
            socket.send(JSON.stringify({ type: 'candidate', candidate: event.candidate }));
        }
    };

    // Handle remote track
    peerConnection.ontrack = event => {
        console.log('Remote track received:', event.streams[0]);
        remoteVideo.srcObject = event.streams[0];
        remoteStream = event.streams[0];
    };

    peerConnection.oniceconnectionstatechange = () => {
        console.log(`ICE connection state change: ${peerConnection.iceConnectionState}`);
        if (peerConnection.iceConnectionState === 'connected' || peerConnection.iceConnectionState === 'completed') {
            // Enable screen share button once connection is stable
            if (toggleScreenShareButton) toggleScreenShareButton.disabled = false;
        }
        if (peerConnection.iceConnectionState === 'failed' ||
            peerConnection.iceConnectionState === 'disconnected' ||
            peerConnection.iceConnectionState === 'closed') {
            console.error(`Connection ${peerConnection.iceConnectionState}.`);
            if (toggleScreenShareButton) toggleScreenShareButton.disabled = true; // Disable on failure
        }
    };
};

// Function to initiate the call (create and send an offer)
const createOffer = async () => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
        console.error('WebSocket is not connected.');
        alert('Not connected to the signaling server. Please wait or refresh.');
        return;
    }
    console.log('Creating offer...');
    if (!peerConnection) {
        await createPeerConnection();
    }
    try {
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        socket.send(JSON.stringify({ type: 'offer', offer: offer }));
        console.log('Offer sent');
    } catch (error) {
        console.error('Error creating offer:', error);
    }
};

// Initial Call Flow
// 1. Start media on page load
window.addEventListener('load', async () => {
    if (startCallButton) {
        startCallButton.disabled = true;
        startCallButton.addEventListener('click', createOffer);
    } else {
        console.warn('Start Call Button not found');
    }
    if (toggleMuteButton) {
        toggleMuteButton.disabled = true; // Disable until media is ready
        toggleMuteButton.onclick = toggleMute;
    }
    if (toggleCameraButton) {
        toggleCameraButton.disabled = true; 
        toggleCameraButton.onclick = toggleCamera;
    }
    if (toggleScreenShareButton) {
        toggleScreenShareButton.disabled = true; // Disable until media and peer connection are ready
        toggleScreenShareButton.onclick = toggleScreenShare;
    }

    await startMedia();
});

// Function to toggle mute
function toggleMute() {
    if (!localStream) return;
    localStream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
        if (toggleMuteButton) {
            toggleMuteButton.textContent = track.enabled ? 'Mute Mic' : 'Unmute Mic';
        }
    });
}

// Function to toggle camera
function toggleCamera() {
    if (!localStream) return;
    localStream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
        if (toggleCameraButton) {
            toggleCameraButton.textContent = track.enabled ? 'Turn Camera Off' : 'Turn Camera On';
        }
    });
}

async function toggleScreenShare() {
    if (!peerConnection) {
        console.warn('Peer connection not established yet.');
        alert('Please establish a call before sharing screen.');
        return;
    }

    const videoSender = peerConnection.getSenders().find(sender => sender.track && sender.track.kind === 'video');

    if (!videoSender) {
        console.error('No video sender found in peer connection.');
        alert('Could not find video track to replace for screen sharing.');
        return;
    }

    if (!isScreenSharing) {
        // Start screen sharing
        try {
            screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
            if (screenStream.getVideoTracks().length > 0) {
                const screenTrack = screenStream.getVideoTracks()[0];
                
                // Save current camera track if localStream exists and has video tracks
                if (localStream && localStream.getVideoTracks().length > 0) {
                    originalVideoTrack = localStream.getVideoTracks()[0];
                } else {
                    originalVideoTrack = null; // No camera track to save
                    console.warn("No local camera stream available to save before screen sharing.");
                }
                
                await videoSender.replaceTrack(screenTrack);

                screenTrack.onended = () => {
                    // This event fires when user stops sharing via browser UI
                    if (isScreenSharing) { // Only revert if we were in screen sharing state
                        console.log('Screen sharing stopped by user (browser UI).');
                        revertToCamera(videoSender); // Pass sender for consistency
                    }
                };
                
                toggleScreenShareButton.textContent = 'Stop Sharing Screen';
                isScreenSharing = true;
                console.log('Screen sharing started.');

                // Also update local video preview to show screen share
                localVideo.srcObject = screenStream;

            }
        } catch (err) {
            console.error('Error starting screen share:', err);
            alert('Could not start screen sharing: ' + err.message);
        }
    } else {
        // Stop screen sharing
        revertToCamera(videoSender);
    }
}

function revertToCamera(videoSenderRef) {
    // If not currently screen sharing, or if there's no original track to revert to (e.g., if camera was off/denied),
    // and screen is not active, then do nothing or ensure UI is correct.
    if (!isScreenSharing && !originalVideoTrack && !screenStream) {
        console.log("Not screen sharing or no track to revert to.");
        toggleScreenShareButton.textContent = 'Share Screen';
        isScreenSharing = false; // Ensure state is correct
        return;
    }
    
    const currentVideoSender = videoSenderRef || peerConnection.getSenders().find(sender => sender.track && sender.track.kind === 'video');

    if (currentVideoSender && originalVideoTrack) { // Prefer to revert to original camera track
        currentVideoSender.replaceTrack(originalVideoTrack)
            .then(() => {
                if (screenStream) {
                    screenStream.getTracks().forEach(track => track.stop());
                    screenStream = null;
                }
                // Restore local video preview to camera
                if (localStream) { // Ensure localStream exists
                    localVideo.srcObject = localStream;
                }
                toggleScreenShareButton.textContent = 'Share Screen';
                isScreenSharing = false;
                console.log('Reverted to camera. Screen sharing stopped.');
            })
            .catch(err => {
                console.error('Error reverting to camera:', err);
                // Attempt to stop screen stream tracks even if replaceTrack fails
                if (screenStream) {
                    screenStream.getTracks().forEach(track => track.stop());
                    screenStream = null;
                }
                localVideo.srcObject = localStream; // Try to restore camera preview
                toggleScreenShareButton.textContent = 'Share Screen'; // Reset button
                isScreenSharing = false;
            });
    } else if (screenStream) { // Fallback: just stop screen share if no original track or sender issue
        console.log("Stopping screen share (no original camera track to restore or sender issue).");
        screenStream.getTracks().forEach(track => track.stop());
        screenStream = null;
        // If there's no originalVideoTrack, it implies camera might have been off or denied.
        // We should try to set localVideo.srcObject to localStream if it exists, or null.
        localVideo.srcObject = localStream ? localStream : null; 
        toggleScreenShareButton.textContent = 'Share Screen';
        isScreenSharing = false;
    } else {
        // If neither originalVideoTrack nor screenStream is available, just reset UI
        console.log("No active screen share or original track to revert to. Resetting UI.");
        localVideo.srcObject = localStream ? localStream : null;
        toggleScreenShareButton.textContent = 'Share Screen';
        isScreenSharing = false;
    }
}


// Graceful disconnect
window.addEventListener('beforeunload', () => {
    if (peerConnection) {
        peerConnection.close();
        peerConnection = null;
    }
    if (socket) {
        socket.close();
    }
    if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
    }
});
