import { start } from "shared/jecs/start";
import updateRoutes from "./systems/routes/updateRoutes";
import jabby from "@rbxts/jabby";
import { ContextActionService, Players } from "@rbxts/services";
import { Phase } from "@rbxts/planck";


start([{ system: updateRoutes, phase: Phase.Startup }]);
