import { navigate } from 'gatsby-link';
import React, {useState, useContext, useEffect} from 'react'
import { GlobalStateContext } from '../context/GlobalContextProvider';

const NotificationWindow = (props) => {

    const [subActive, setSubActive] = useState(false);
    const [queue,setQueue] = useState([]);
    const [message, setMessage] = useState('');
    const [animationRunning, setAnimationRunning] = useState(false);
    const state = useContext(GlobalStateContext)

    useEffect(() => {
        if(state.client._id || props.id) {
            const id = state.client._id ? state.client._id : props.id;
            if(!subActive) initTwitchSub(id);
        } else {
            navigate('/auth/', {state: {nextPath:`/notifications`}});
        }
    },[])

    useEffect(()=>{
        consumeQueue();
    },[queue, animationRunning])

    const initTwitchSub = (id) => {
        fetch(`http://localhost:3000/twitch/webhook/${id}`)
        .then(data=>{
            if(data.status === 200 || data.status === 409){
                setSubActive(true);
                initSSE(id);
            } else{
                throw new Error('Error initiating twitch event subscription')
            }
        })
    }

    const initSSE = (id) => {
        console.log('sss',state.client)
        const events = new EventSource(`http://localhost:3000/event/${id}`);
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
        setMessage(`${data.event.user_name} is now Following!!`);
        setAnimationRunning(true)
        setTimeout(()=>{
            setAnimationRunning(false);
        }, 5000)
    }

    const img = <img id='gif' src='https://giffiles.alphacoders.com/247/2479.gif' alt='bmo gif'/>
    const span = <span id='message'>{message}</span>

    return <div>
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
    </div>
}

export default NotificationWindow