import { start } from "shared/jecs/start";
import health from "./systems/stats/health";

start([ { system: health } ])