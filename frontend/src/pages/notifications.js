import { navigate } from 'gatsby-link';
import React, {useState, useContext, useEffect} from 'react'
import { GlobalStateContext } from '../context/GlobalContextProvider';
import NotificationSettings from '../components/notificationSettings';
import NotificationWindow from '../components/notificationWindow';
import styled from 'styled-components';
import { useQueryParam, StringParam } from "use-query-params";
import wtfiuk from "../sounds/wtfiuk.mp3";

const Notifications = () => {
    const [id, setId] = useQueryParam('id', StringParam);
    const [imgSrc, setImgSrc] = useState('https://c.tenor.com/FYcn40o1ZYgAAAAi/zombie-bloody.gif');
    const [imgAlt, setImgAlt] = useState('zombie gif');
    const [audioSrc, setAudioSrc] = useState(wtfiuk);

    const generateUrl = () => {
        return null;   
    }

    const FlexDiv = styled.div`
    display: flex;
    flex-direction: row;
    `

    return <>
        {id ? 
            <NotificationWindow
                imgSrc={imgSrc} 
                setImgSrc={setImgSrc}
                imgAlt={imgAlt}
                setImgAlt={setImgAlt}
                audioSrc={audioSrc}
                setAudioSrc={setAudioSrc}
            />
        :
            <FlexDiv>
                <NotificationSettings 
                    imgSrc={imgSrc} 
                    setImgSrc={setImgSrc}
                    imgAlt={imgAlt}
                    setImgAlt={setImgAlt}
                    audioSrc={audioSrc}
                    setAudioSrc={setAudioSrc}
                />
                <div>
                    <button onClick={generateUrl}>Get OBS Browser Source URL</button>
                    <NotificationWindow
                        imgSrc={imgSrc} 
                        setImgSrc={setImgSrc}
                        imgAlt={imgAlt}
                        setImgAlt={setImgAlt}
                        audioSrc={audioSrc}
                        setAudioSrc={setAudioSrc}
                    />
                </div>
            </FlexDiv>
        }
    </>

}

    export default Notifications