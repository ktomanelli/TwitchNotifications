import styled, { keyframes } from 'styled-components';
import React from 'react';
import { StaticImage } from "gatsby-plugin-image"

const CustomNotification = (props) => {
    const Iframe = styled.iframe``;

    return (
        <Iframe 
            src={`https://ktomanelli.github.io/crtMessage/?message=${props.message}&user=${props.user}`}
            style={{maxWidth:640, width:'100%', height:'0px', overflow:'visible'}}
            onLoad={() => {
                const obj = ReactDOM.findDOMNode(this);
                this.setState({
                    "iFrameHeight":  obj.contentWindow.document.body.scrollHeight + 'px'
                });
            }} 
            ref="iframe" 
            width="100%" 
            height="0px"
            scrolling="no" 
            frameBorder="0"
        ></Iframe>
    )
}

export default CustomNotification;