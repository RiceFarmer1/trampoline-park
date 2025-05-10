import { World } from "@rbxts/jecs";
import { ReplicatedStorage, Workspace } from "@rbxts/services";
import { Tycoon } from "shared/jecs/components";
import { Q } from "shared/jecs/queries";
import Paths from "shared/utils/paths";

export default (world: World) => {
	for (const [entity, { character }] of Q.NoTycoon) {
		const totalTycoons = Paths.Tycoons.GetChildren();
		const randomizedTycoon = totalTycoons[math.random() * totalTycoons.size()];

		world.set(entity, Tycoon, {});
		randomizedTycoon.SetAttribute("Occupied", true);
	}
};
