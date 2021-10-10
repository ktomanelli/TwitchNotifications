import { navigate } from 'gatsby-link';
import React, {useState, useContext, useEffect} from 'react'
import { GlobalStateContext } from '../context/GlobalContextProvider';
import NotificationSettings from '../components/notificationSettings';
import NotificationWindow from '../components/notificationWindow';
import styled from 'styled-components';
import { useQueryParam, StringParam } from "use-query-params";

const Notifications = () => {
    const [id, setId] = useQueryParam('id', StringParam);



    const FlexDiv = styled.div`
    display: flex;
    flex-direction: row;
    `

    return <>
        {id ? 
            <NotificationWindow id={id}/>
        :
            <FlexDiv>
                <NotificationSettings/>
                <NotificationWindow/>
            </FlexDiv>
        }
    </>

}

    export default Notifications