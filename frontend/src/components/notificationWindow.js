import { navigate } from 'gatsby-link';
import React, {useState, useContext, useEffect} from 'react'
import { GlobalStateContext } from '../context/GlobalContextProvider';
import { v4 as uuidv4 } from 'uuid';
import styled from 'styled-components';

const NotificationWindow = (props) => {
    const [subActive, setSubActive] = useState(false);
    const [queue,setQueue] = useState([]);
    const [message, setMessage] = useState('');
    const [audio, setAudio] = useState(null);
    const [audioPlaying, setAudioPlaying] = useState(false);
    const [animationRunning, setAnimationRunning] = useState(false);
    const [events, setEvents] = useState(null);
    const state = useContext(GlobalStateContext)

    useEffect(() => {
        if(state.client._id) {
            const id = state.client._id;
            if(!subActive) initTwitchSub(id);
        } else {
            navigate('/auth', {state: {nextPath: '/notify'}});
        }
        return(()=>{
            if(events) events.close();
            if(audio) audio.removeEventListener('ended', () => audioPlaying(false));
        })
    },[])

    useEffect(()=>{
        if(animationRunning) audio.play();
    },[animationRunning])

    useEffect(()=>{
        consumeQueue();
    },[queue, animationRunning])

    const initTwitchSub = (id) => {
        fetch(`${process.env.FRONTEND_URL}/api/twitch/webhook/${id}`)
        .then(data=>{
            if(data.status === 200 || data.status === 409){
                console.log('resp',data.data)
                setSubActive(true);
                initSSE(id);
                const htmlAudio = new Audio(props.audioSrc);
                htmlAudio.addEventListener('ended', () => setAudioPlaying(false));
                setAudio(htmlAudio);
            } else{
                throw new Error('Error initiating twitch event subscription')
            }
        })
    }

    const NotifyImg = styled.img`
        margin: auto;
        position: relative;
        width: 80vw;
        height: 80vh;
    `;
    const NotifySpan = styled.span`
        font-family: "VintageOne";
        width:100%;
        position: absolute;
        bottom: 0;
        left: 0;
        font-size: 4em;
        text-align: center;
    `;

    const initSSE = (id) => {
        const uuid = uuidv4();
        const sse = new EventSource(`https://api.kylefrominternet.stream/event/${id}/${uuid}`);
        const maxReconnectTries = 3
        let reconnectAttempts = 0

        sse.onmessage = event => {
            if(event.type === 'close') sse.close()
            else {
                setAudioPlaying(true);
                const message = JSON.parse(event.data).type;
                console.log(message)
                setQueue([...queue, message])
            }
        };
        sse.onerror = () => {
            if (reconnectAttempts > maxReconnectTries) {
              sse.close();
              setSubActive(false);
              alert("Connection Broken. Too many failed retries");
            } else {
              reconnectAttempts++
            }
        }
        setEvents(sse);
    }

    const consumeQueue = () => {
        if(queue.length > 0 && !animationRunning){
            displayMessage(queue[0]);
            const shiftedQueue = queue;
            shiftedQueue.shift();
            setQueue(shiftedQueue);
        }
    }

    const displayMessage = (data) => {
        console.log(data.event.user_name);
        setMessage(`${data.event.user_name} is now Following!!`);
        setAnimationRunning(true)
        setTimeout(()=>{
            setAnimationRunning(false);
        }, 5000)
    }

    // const img = <img id='gif' src='https://giffiles.alphacoders.com/247/2479.gif' alt='bmo gif'/>
    // const span = <span id='message'>{message}</span>

    return <div>
                {subActive ?
                    <>
                        {animationRunning ?
                            <div id='notify'>
                                <NotifyImg src={props.imgSrc} alt={props.imgAlt}/>
                                <NotifySpan>{message}</NotifySpan>
                            </div>
                        :
                            null
                        }
                    </>
        :
            <div>No active event subscription :(</div>
        }
    </div>
}

export default NotificationWindow