import { World } from "@rbxts/jecs";
import { Players } from "@rbxts/services";
import { Body, ModelDebugger, Player } from "shared/jecs/components";
import { useEvent } from "shared/plugin-hooks/hooks/use-event";
import { useMemo } from "shared/plugin-hooks/hooks/use-memo";

export default (world: World) => {
	for (const [player] of useEvent(Players.PlayerAdded)) {
		const model = player.Character || player.CharacterAdded.Wait()[0];
		if (model && model.GetAttribute("ServerId") === undefined) {
			const { HumanoidRootPart, Humanoid } = model as Character;
			const e = world.entity();

			world.set(e, Body, {
				rootPart: HumanoidRootPart,
				character: model,
			});
			world.set(e, ModelDebugger, model);
			world.add(e, Player);
			model.SetAttribute("ServerId", e);
		}
	}
};
