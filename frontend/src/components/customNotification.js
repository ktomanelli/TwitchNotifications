import React, {useEffect, useState} from 'react';
    function getWindowDimensions() {
        const { innerWidth: width, innerHeight: height } = window;
        return {width, height};
    }
  
    function useWindowDimensions() {
        const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
  
        useEffect(() => {
        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }
    
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
        }, []);
    
        return windowDimensions;
    }

const CustomNotification = (props) => {
    const { height, width } = useWindowDimensions();

    return (
        <iframe 
            src={`https://ktomanelli.github.io/crtMessage/?message=${props.message}&user=${props.user}`}
            style={{width:width, height:height}}
        ></iframe>
    )
}

export default CustomNotification;