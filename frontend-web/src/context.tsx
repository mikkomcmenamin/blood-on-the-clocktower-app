import { EditionId } from "@common/editions/editions";
import React from "react";

export type Context = {
  storytellerMode: boolean;
  deathReminders: number[];
  sound: boolean;
  video: boolean;
  edition: EditionId;
};

const isInitiallyMobile = window.innerWidth <= 768;

export const initialCtxValue = isInitiallyMobile
  ? {
      storytellerMode: true as const,
      edition: "TROUBLE_BREWING" as const,
      deathReminders: [],
      sound: false,
      video: false,
    }
  : {
      storytellerMode: false as const,
      edition: "TROUBLE_BREWING" as const,
      deathReminders: [],
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
