import { Body, Data, SpawnLocation, Tycoon, world } from "./components";

enum QueriesEnum {
	NoTycoon = "NoTycoon",
	WithTycoon = "WithTycoon",
	NoSpawnLocation = "NoSpawnLocation",
	NoHealth = "NoHealth",
}

const Queries = {
	[QueriesEnum.NoTycoon]: world.query(Body, Data).without(Tycoon).cached(),
	[QueriesEnum.WithTycoon]: world.query(Body, Data).with(Tycoon).cached(),
	[QueriesEnum.NoSpawnLocation]: world.query(Body, Data).without(SpawnLocation).cached(),
};
export const Q = Queries;
