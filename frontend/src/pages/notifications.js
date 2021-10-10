import { navigate } from 'gatsby-link';
import React, {useState, useContext, useEffect} from 'react'
import { GlobalStateContext } from '../context/GlobalContextProvider';

const Notifications = () => {
    const [subActive, setSubActive] = useState(false);
    const [queue,setQueue] = useState([]);
    const [message, setMessage] = useState('');
    const [animationRunning, setAnimationRunning] = useState(false);
    const state = useContext(GlobalStateContext)

    useEffect(() => {
        if(state.client._id && !subActive) {
            initTwitchSub();
        } else {
            navigate('/auth');
        }
    },[])

    useEffect(()=>{
        consumeQueue();
    },[queue, animationRunning])

    const initTwitchSub = () => {
        fetch(`http://localhost:3000/twitch/webhook/${state.client._id}`)
        .then(data=>{
            if(data.status === 200 || data.status === 409){
                setSubActive(true);
                initSSE()
            } else{
                throw new Error('Error initiating twitch event subscription')
            }
        })
    }

    const initSSE = () => {
        console.log('sss',state.client)
        const events = new EventSource(`http://localhost:3000/event/${state.client._id}`);
        const maxReconnectTries = 3
        let reconnectAttempts = 0

        events.onmessage = event => {
            if(event.type === 'close') events.close()
            else {
                const message = JSON.parse(event.data).type;
                console.log(message)
                setQueue([...queue, message])
            }
        };
        events.onerror = () => {
            if (reconnectAttempts > maxReconnectTries) {
              events.close();
              setSubActive(false);
              alert("Connection Broken. Too many failed retries");
            } else {
              reconnectAttempts++
            }
        }
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
        console.log(data);
        setMessage(`${data.event.user_name} is now Following!!`);
        setAnimationRunning(true)
        setTimeout(()=>{
            setAnimationRunning(false);
        }, 5000)
    }

    const img = <img id='gif' src='https://giffiles.alphacoders.com/247/2479.gif' alt='bmo gif'/>
    const span = <span id='message'>{message}</span>

    return <>
        {subActive ?
            <div id='notify'>
                {animationRunning ?
                    <>
                        {img}
                        {span}
                    </>
                :
                    null
                }
            </div>
        :
            <div>No active event subscription :(</div>
        }
    </>

}

    export default Notifications