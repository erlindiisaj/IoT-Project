import * as packageJson from "../package.json";

type ConfigValues = {
  appName: string;
  appVersion: string;
};

export const CONFIG: ConfigValues = {
  appName: "IoT Dashboard",
  appVersion: packageJson.version,
};

export const API_URL = "http://localhost:8000";

export const WEBSOCKET_URL = "ws://localhost:8000/ws";
