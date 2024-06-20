import { defaultConfiguration } from "@/ipc/configuration/ipc-configuration.constants";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  configurationContext,
  ConfigurationProps,
} from "./configuration.context";

export interface ConfigurationProviderProps {
  children: React.ReactNode;
}

export const ConfigurationProvider: React.FunctionComponent<
  ConfigurationProviderProps
> = (props) => {
  const [configuration, setConfiguration] = useState<ConfigurationProps>();
  useEffect(() => {
    window.configuration
      .load()
      .then(setConfiguration)
      .catch(() => {
        setConfiguration(defaultConfiguration);
      });
  }, []);
  const set = useCallback(function <K extends keyof ConfigurationProps>(
    propName: K,
    value: ConfigurationProps[K]
  ) {
    setConfiguration((prev) => {
      const newConfiguration = { ...prev, [propName]: value };
      window.configuration.save(newConfiguration);
      return newConfiguration;
    });
  }, []);
  const get = useCallback(
    function <K extends keyof ConfigurationProps>(propName: K) {
      return configuration[propName];
    },
    [configuration]
  );

  const ctx = useMemo(
    () => ({
      set,
      get,
    }),
    [set, get]
  );

  if (!configuration) {
    return null;
  }

  return (
    <configurationContext.Provider value={ctx}>
      {props.children}
    </configurationContext.Provider>
  );
};
