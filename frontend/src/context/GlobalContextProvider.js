import React, {useReducer} from "react";
export const GlobalStateContext = React.createContext();
export const GlobalDispatchContext = React.createContext();

const initialState = {
    client: {
        user: null,
    }
}

function reducer(state, action) {
    switch(action.type){
        case 'SET_CLIENT':
            const obj = {
                ...state,
                client:{...action.payload.client}
            }
            return obj
        case 'SET_COLOR':
            return {
                ...state,
                color: state.color === 'red' ? 'blue':'red'
            }
        default:
            throw new Error('Bad Action Type')
    }
}

const GlobalContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(reducer, initialState)
    return <GlobalStateContext.Provider value={state}>
        <GlobalDispatchContext.Provider value={dispatch}>
            {children}
        </GlobalDispatchContext.Provider>
    </GlobalStateContext.Provider>
}

export default GlobalContextProvider

