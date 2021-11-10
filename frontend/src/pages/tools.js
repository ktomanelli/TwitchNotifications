import { Link } from "gatsby";
import { navigate } from "gatsby-link";
import React, {useState, useEffect, useContext} from "react"
import Layout from "../components/layout"
import {GlobalStateContext} from '../context/GlobalContextProvider';
const Tools = (props) => {
  const state = useContext(GlobalStateContext)
  const isAuthenticated = state.client.user ? true: false
  const [isBrowser,setIsBrowser] = useState(false);
  useEffect(()=>{
    setIsBrowser(true)
  },[])
  return <Layout>
    {isAuthenticated ?
    <div id='tools'>
      {state.client?.user?.display_name}
      <Link to='/notifications'>Notifications</Link>
    </div>
     :
      isBrowser? navigate('/auth') : null
    }
  </Layout>

}

export default Tools
