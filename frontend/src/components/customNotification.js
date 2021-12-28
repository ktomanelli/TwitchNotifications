import styled from 'styled-components';

const CustomNotification = (props) => {
    const CrtImg = styled.img`
        position:absolute;
        width:100vw;
        height: 100vh;
    `;
    const WhiteSquare = styled.div`
        background-color: white;
        width: 50vw;
        height: 49vh;
        position: absolute;
        top: 14vh;
        left: 25vw;
        margin: 1em;
    `;
    const CrtAffect = styled.div`
        width: 100vw;
        height: 100vh;
        &:before {
            content: " ";
            display: block;
            position: absolute;
            top: 14vh;
            left: 25vw;
            width: 50vw;
            height: 49vh;
            background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
            z-index: 2;
            background-size: 100% 2px, 3px 100%;
            pointer-events: none;
            margin: 1em;
        }
        &:after { 
            content: " ";
            display: block;
            position: absolute;
            top: 14vh;
            left: 25vw;
            width: 50vw;
            height: 49vh;
            background: rgba(18, 16, 16, 0.1);
            opacity: 0;
            z-index: 2;
            pointer-events: none;
            animation: flicker 0.15s infinite;
            margin: 1em;
        }
    `;
    const Text = styled.div`
        font-family: 'VT323', monospace;
        animation: textShadow 1.6s infinite;
        font-size: 13vh;
        width:48vw;
        position:absolute;
        top:20vh;
        left: 30vw;
        z-index: 3;
    `;
    return (
        <>
            <CrtImg src='./crt.PNG'/>
            <WhiteSquare />
            <CrtAffect />
            <Text>{props.message}</Text>
        </>
    )
}

export default CustomNotification;