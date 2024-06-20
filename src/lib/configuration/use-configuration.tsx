import { useContext } from "react";
import { configurationContext } from "./configuration.context";

export const useConfiguration = () => {
  const ctx = useContext(configurationContext);
  if (!ctx) {
    throw new Error(
      "useConfiguration must be used within a ConfigurationProvider"
    );
  }
  return ctx;
};
