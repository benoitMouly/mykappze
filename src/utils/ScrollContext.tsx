import React from "react";

const ScrollContext = React.createContext();

export const useScroll = () => {
  return React.useContext(ScrollContext);
};

export const ScrollProvider = ScrollContext.Provider;
