import React from "react";
/*
    1. A Context object that will allow us to reference the context in child components

    2. A Context Provider that will wrap the child components that want access to the context
*/

export const AppContext = React.createContext();

const initialState = {
  theme: "default",
  clownVotes: 0,
  ghostVotes: 0,
};

const calculateNextTheme = (clownVotes, ghostVotes) => {
  if (clownVotes > ghostVotes) {
    return "green";
  } else if (clownVotes < ghostVotes) {
    return "red";
  } else {
    return "default";
  }
};

const stateReducer = (prevState, action) => {
  const { type, payload } = action;
  switch (type) {
    case "CHANGE_THEME":
      return { ...prevState, theme: payload };
    case "VOTE_CLOWN": {
      const clownVotes = prevState.clownVotes + 1;
      let nextTheme = calculateNextTheme(clownVotes, prevState.ghostVotes);
      return { ...prevState, clownVotes, theme: nextTheme };
    }
    case "VOTE_GHOST": {
      const ghostVotes = prevState.ghostVotes + 1;
      let nextTheme = calculateNextTheme(prevState.clownVotes, ghostVotes);
      return { ...prevState, ghostVotes, theme: nextTheme };
    }
    default:
      throw new Error(`Unsupported action type: ${type}`);
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = React.useReducer(stateReducer, initialState);

  const handleColorChange = (colorTheme) =>
    dispatch({ type: "CHANGE_THEME", payload: colorTheme });

  return (
    <AppContext.Provider value={{ ...state, handleColorChange }}>
      {children}
    </AppContext.Provider>
  );
};
