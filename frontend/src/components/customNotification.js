import styled, { keyframes } from 'styled-components';
import React from 'react';
import { StaticImage } from "gatsby-plugin-image"

const CustomNotification = (props) => {
    const Iframe = styled.iframe``;

    return (
        <>
            <Iframe src={`https://ktomanelli.github.io/crtMessage/?message=${props.message}&user=${props.user}`}></Iframe>
        </>
    )
}

export default CustomNotification;