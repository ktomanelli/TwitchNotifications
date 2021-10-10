import { Link } from "gatsby";
import { navigate } from "gatsby-link";
import * as React from "react"
import { useEffect, useContext } from "react"
import Layout from "../components/layout"
import {GlobalStateContext} from '../context/GlobalContextProvider';
const Tools = (props) => {
  const state = useContext(GlobalStateContext)
  const isAuthenticated = state.client.user ? true: false

  return <Layout>
    {isAuthenticated ?
    <div id='tools'>
      {state.client?.user?.display_name}
      <Link to='/notifications'>Notifications</Link>
    </div>
     :
      navigate('/auth')
    }
  </Layout>

}

export default Tools
