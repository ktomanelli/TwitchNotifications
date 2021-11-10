import React, {useEffect, useState} from "react"
import { navigate } from "gatsby-link";
import { useQueryParam, StringParam } from "use-query-params";

const Notify = () => {
    const [code, setCode] = useQueryParam('code', StringParam);
    const [isBrowser,setIsBrowser] = useState(false);
    useEffect(()=>{
        setIsBrowser(true);
    },[])
    const getNavigate = () =>{
        if (isBrowser){
            return navigate(`/auth?code=${code}`, {state: {nextPath: '/notifications'}})
        }
        return null
    }
    return <>
        {getNavigate()}
    </>
}

export default Notify;