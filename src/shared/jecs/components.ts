import { HotReloader } from "@rbxts/hot-reloader";
import { Janitor } from "@rbxts/janitor";
import { Entity, Name, World } from "@rbxts/jecs";
import { Scheduler } from "@rbxts/planck";

export const hotReloader = new HotReloader();
export const world = new World();
export const systemQueue = new Scheduler(world);
const component = <T = true>(name: string, defaultValue?: T) => {
	const theComponent = world.component<T>();

	world.set(theComponent, Name, name);
	if (defaultValue) world.set(theComponent, theComponent, defaultValue);

	return theComponent;
};

export const ModelDebugger = component<Model | BasePart>("ModelDebugger");
export const Player = world.entity()
export const Tycoon = component<{ ownership: Entity, index: number }>("Tycoon");
export const Body = component<{ rootPart: BasePart; character: Model }>("Body");
export const Data = component<{}>("Data");
