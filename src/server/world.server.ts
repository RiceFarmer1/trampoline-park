import { start } from "shared/jecs/start";
import updateOwnership from "./systems/tycoon/updateOwnership";

start([  { system: updateOwnership } ])