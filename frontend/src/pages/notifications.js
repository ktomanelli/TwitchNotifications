import { navigate } from 'gatsby-link';
import React, {useState, useContext, useEffect} from 'react'
import { GlobalStateContext } from '../context/GlobalContextProvider';
import NotificationSettings from '../components/notificationSettings';
import NotificationWindow from '../components/notificationWindow';
import styled from 'styled-components';
import { useQueryParam, StringParam } from "use-query-params";

const Notifications = () => {
    const [id, setId] = useQueryParam('id', StringParam);
    const [imgSrc, setImgSrc] = useState('https://c.tenor.com/FYcn40o1ZYgAAAAi/zombie-bloody.gif');
    const [imgAlt, setImgAlt] = useState('zombie gif');
    const [audioSrc, setAudioSrc] = useState('https://ia803109.us.archive.org/12/items/WhatTheFuckIsUpKyle.128kbitAAC/What%20the%20fuck%20is%20up%20Kyle.%20%28128kbit_AAC%29.mp3');

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