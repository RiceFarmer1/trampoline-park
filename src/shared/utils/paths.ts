import { Workspace } from "@rbxts/services";

export default {
    Tycoons: Workspace.FindFirstChild("Tycoons") as Folder & { Tycoon_1: Model }
}