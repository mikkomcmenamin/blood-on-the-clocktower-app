import React from "react";

type StorytellerContext =
  | {
      storytellerMode: false;
    }
  | {
      storytellerMode: true;
      deathReminders: number[];
    };

type GeneralSettings = {
  sound: boolean;
  video: boolean;
};

export type Context = StorytellerContext & GeneralSettings;

const isInitiallyMobile = window.innerWidth <= 768;

export const initialCtxValue = isInitiallyMobile
  ? {
      storytellerMode: true as const,
      deathReminders: [],
      sound: false,
      video: false,
    }
  : {
      storytellerMode: false as const,
      sound: true,
      video: true,
    };

export const AppContext = React.createContext<{
  value: Context;
  setValue: (c: Context) => void;
}>({
  value: initialCtxValue,
  setValue: () => {},
});
