import { useQueryParam, StringParam } from "use-query-params";
import { useContext, useEffect } from "react";
import { navigate } from "gatsby-link";
import {GlobalDispatchContext, GlobalStateContext} from '../../context/GlobalContextProvider';
const Auth = (props) => {
    const [code, setCode] = useQueryParam('code', StringParam);
    const dispatch = useContext(GlobalDispatchContext);
    const state = useContext(GlobalStateContext)

    useEffect(()=>{
        if(code){
            fetch(`${process.env.FRONTEND_URL}/api/auth`,{
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
                dispatch({type:'SET_CLIENT', payload:{client}});
                let nextPath = props.location.state?.nextPath
                if(nextPath){
                    if(nextPath==='/notifications'){
                        nextPath+=`?id=${client._id}`
                    }
                    navigate(nextPath)
                } else navigate('/tools')
            })
        }else{
            let redirectPath = `${process.env.FRONTEND_URL}/auth`
            if(props.location.state?.nextPath) {
                redirectPath+=props.location.state.nextPath
            }
            window.location.replace(`https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=86bqvqw8f722hn3refzoqntfobzc5c&redirect_uri=${redirectPath}&scope=user_read`);
        }
    },[code])
    
    return null
}

export default Auth;