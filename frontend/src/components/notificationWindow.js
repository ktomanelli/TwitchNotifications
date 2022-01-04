import { navigate } from 'gatsby-link';
import React, {useState, useContext, useEffect} from 'react'
import { GlobalStateContext } from '../context/GlobalContextProvider';
import { v4 as uuidv4 } from 'uuid';
import styled from 'styled-components';
import CustomNotification from './customNotification';

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
        fetch(`${process.env.GATSBY_BACKEND_URL}/twitch/webhook/${id}`)
        .then(data=>{
            if(data.status === 200 || data.status === 409){
                console.log('resp',data.data)
                setSubActive(true);
                initSSE(id);
                const htmlAudio = new Audio(props.audioSrc);

                htmlAudio.addEventListener('timeupdate', () => {
                    if (audio.currentTime >= 0.02) {
                        audio.pause();
                    }   
                }, false);

                htmlAudio.addEventListener('ended', () => setAudioPlaying(false));
                setAudio(htmlAudio);
            } else{
                throw new Error('Error initiating twitch event subscription')
            }
        })
    }

    const initSSE = (id) => {
        const uuid = uuidv4();
        const sse = new EventSource(`${process.env.GATSBY_BACKEND_URL}/event/${id}/${uuid}`, {withCredentials: true});
        const maxReconnectTries = 3
        let reconnectAttempts = 0

        sse.onmessage = event => {
            console.log(event);
            if(event.type === 'close') sse.close()
            else {
                const message = JSON.parse(event.data).type;
                if(message !== 'keepalive') {
                    setAudioPlaying(true);
                    console.log(message);
                    setQueue([...queue, message]);
                }
            }
        };
        sse.onerror = (eventSource, event) => {
            console.log('ERROR:')
            console.log(eventSource);
            console.log(event);
            if (reconnectAttempts > maxReconnectTries) {
              sse.close();
              setSubActive(false);
              alert("Connection Broken. Too many failed retries");
            } else {
                console.log('attempting reconnect')
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
        setMessage({
            user: data.event.user_name,
            message: 'is now Following!!'
        });
        setAnimationRunning(true)
        setTimeout(()=>{
            setAnimationRunning(false);
        }, 5000)
    }

    return <div>
                {subActive ?
                    <>
                        {animationRunning ?
                            <div id='notify' style={{transition: "all .3s ease-out"}}>
                                <CustomNotification user={message.user} message={message.message}/>
                                {/* <NotifyImg src={props.imgSrc} alt={props.imgAlt}/>
                                <NotifySpan>{message}</NotifySpan> */}
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