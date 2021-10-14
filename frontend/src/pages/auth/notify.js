import * as React from "react"
import { navigate } from "gatsby-link";
import { useQueryParam, StringParam } from "use-query-params";

const Notify = () => {
    const [code, setCode] = useQueryParam('code', StringParam);

    return <>
    {console.log('in notify')}
        {navigate(`/auth?code=${code}`, {state: {nextPath: '/notifications'}})}
    </>
}

export default Notify;