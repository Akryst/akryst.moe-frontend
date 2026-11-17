"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

const BackgroundContext = createContext<{
  underwater: boolean;
  setUnderwater: (value: boolean) => void;
} | null>(null);

export function BackgroundSettingsProvider({ children }: { children: ReactNode }) {
  const [underwater, setUnderwater] = useState(true);
  return <BackgroundContext.Provider value={{ underwater, setUnderwater }}>{children}</BackgroundContext.Provider>;
}

export function useBackgroundSettings() {
  const settings = useContext(BackgroundContext);
  if (!settings) throw new Error("Background settings provider is missing");
  return settings;
}

export function SettingsPanel() {
  const { underwater, setUnderwater } = useBackgroundSettings();
  return <div className="home-panel-content settings-panel">
    <fieldset className="settings-background">
      <legend>Background</legend>
      <div>
        <button type="button" aria-pressed={underwater} onClick={() => setUnderwater(true)}>Ocean</button>
        <button type="button" aria-pressed={!underwater} onClick={() => setUnderwater(false)}>Night</button>
      </div>
    </fieldset>
  </div>;
}
