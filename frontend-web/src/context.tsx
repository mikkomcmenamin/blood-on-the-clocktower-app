import React from "react";

const makeRandomString = (length: number) =>
  Math.random()
    .toString(36)
    .substring(2, length + 2);

const urlPathPart = window.location.pathname.split("/")[1];

// The url should always have a six-character gameId in it, but if it doesn't, we'll
// generate a random one and redirect to it.
if (!urlPathPart || urlPathPart.length < 6) {
  const gameId = makeRandomString(6);
  window.location.replace(`/${gameId}`);
}

export type Context = {
  storytellerMode: boolean;
  deathReminders: number[];
  sound: boolean;
  video: boolean;
  gameId: string;
};

const isInitiallyMobile = window.innerWidth <= 768;

export const initialCtxValue = isInitiallyMobile
  ? {
      storytellerMode: true as const,
      deathReminders: [],
      sound: false,
      video: false,
      gameId: urlPathPart,
    }
  : {
      storytellerMode: false as const,
      deathReminders: [],
      sound: true,
      video: true,
      gameId: urlPathPart,
    };

export const AppContext = React.createContext<{
  value: Context;
  setValue: (c: Context) => void;
}>({
  value: initialCtxValue,
  setValue: () => {},
});
