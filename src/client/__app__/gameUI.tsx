import React from "@rbxts/react"
import World from "./views/world"

export default () => {
    return <frame key="GameUI" Size={UDim2.fromScale(1, 1)} BackgroundTransparency={1}>
        <World/>
    </frame>
}