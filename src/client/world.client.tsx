import { start } from "shared/jecs/start";
import updateRoutes from "./systems/routes/updateRoutes";
import jabby from "@rbxts/jabby";
import { ContextActionService, Players } from "@rbxts/services";
import { Phase } from "@rbxts/planck";
import { createPortal, createRoot } from "@rbxts/react-roblox";
import React, { StrictMode } from "@rbxts/react";
import { ReflexProvider } from "@rbxts/react-reflex";
import { producer } from "shared/utils/producers";
import { createProducer } from "@rbxts/reflex";
import GameUI from "./__app__/gameUI";

const playerGui = Players.LocalPlayer.WaitForChild("PlayerGui")
const root = createRoot(new Instance("Folder"));

// rendering ui
root.render(
    <StrictMode>
        <ReflexProvider producer={producer} >
            {
                createPortal(
                    <screengui key="GameUI" IgnoreGuiInset={true} ZIndexBehavior={"Sibling"} ResetOnSpawn={false} ScreenInsets={Enum.ScreenInsets.DeviceSafeInsets} >
                        <GameUI/>
                    </screengui>, playerGui
                )
            }
        </ReflexProvider>
    </StrictMode>,
);

start([{ system: updateRoutes, phase: Phase.Startup }]);
