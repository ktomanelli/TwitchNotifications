import React, {useEffect} from 'react';

const CustomNotification = (props) => {
    useEffect(() => {

    });

    return (
        <iframe 
            src={`https://ktomanelli.github.io/crtMessage/?message=${props.message}&user=${props.user}`}
            style={{width:'100%', height:'auto'}}
        ></iframe>
    )
}

export default CustomNotification;