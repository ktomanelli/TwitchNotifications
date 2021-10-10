import * as React from "react"
import PropTypes from "prop-types"
import { Link } from "gatsby"
import { GlobalDispatchContext, GlobalStateContext } from "../context/GlobalContextProvider"
const Header = ({ siteTitle }) => {
  const state = React.useContext(GlobalStateContext)
  const dispatch = React.useContext(GlobalDispatchContext)
  return <header
    style={{
      background: `rebeccapurple`,
      marginBottom: `1.45rem`,
    }}
  >
    <div
      style={{
        margin: `0 auto`,
        maxWidth: 960,
        padding: `1.45rem 1.0875rem`,
      }}
    >
      <h1 style={{ margin: 0 }}>
        {/* <Link
          to="/tools"
          style={{
            color: `white`,
            textDecoration: `none`,
          }}
        >tools
        </Link>
        <Link
          to="/page2"
          style={{
            color: `white`,
            textDecoration: `none`,
          }}
        >
          page2
        </Link> */}
      </h1>
    </div>
    {/* <h1>The color is: {state.color}</h1>
    <button type='button' onClick={()=>dispatch({type:'SET_COLOR'})}>Toggle</button> */}
  </header>
}

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
