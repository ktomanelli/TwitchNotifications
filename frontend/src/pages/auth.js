import { useQueryParam, StringParam } from "use-query-params";
import { useContext, useEffect } from "react";
import { navigate } from "gatsby-link";
import {GlobalDispatchContext, GlobalStateContext} from '../context/GlobalContextProvider';
const Auth = (props) => {
    const [code, setCode] = useQueryParam('code', StringParam);
    const dispatch = useContext(GlobalDispatchContext);
    const state = useContext(GlobalStateContext)

    useEffect(()=>{
        if(code){
            fetch('http://localhost:3000/auth',{
                method:'POST',
                headers:{
                    'content-type':'application/json',
                    accept:'application/json'
                },
                body: JSON.stringify({code})
            })
            .then((r)=>r.json())
            .then((data)=>{
                const {client} = data
                dispatch({type:'SET_CLIENT', payload:{client}})
                navigate('/tools');
            })
        }else{
            window.location.replace('https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=86bqvqw8f722hn3refzoqntfobzc5c&redirect_uri=https://kylefrominternet.stream/auth&scope=user_read');
        }
    },[code])
    
    return null
}

export default Auth;