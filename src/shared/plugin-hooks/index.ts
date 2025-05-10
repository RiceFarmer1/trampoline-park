import Phase from "@rbxts/planck/out/Phase";
import Scheduler from "@rbxts/planck/out/Scheduler";
import type { SystemFn, Plugin } from "@rbxts/planck/out/types";
import { start } from "./topo";

interface ModuleInfo {
	nameToSystem: Map<string, SystemFn<unknown[]>>;
	systemToName: Map<SystemFn<unknown[]>, string>;
}
type Cleanup<T> = (state: T) => boolean;
interface HookStorage<T> {
	cleanup?: Cleanup<T>;
	states: Map<string, T>;
}
export class PlanckHooksPlugin implements Plugin {
	private readonly systemData: Map<
		SystemFn<unknown[]>,
		{
			system: SystemFn<unknown[]>;
			deltaTime: number;
			logs: unknown[];
			data: Record<string, HookStorage<unknown>>;
		}
	> = new Map();
	private readonly phaseData: Map<
		Phase,
		{
			lastTime: number;
			deltaTime: number;
			currentTime: number;
		}
	> = new Map();

	private setupPhase(phase: Phase): void {
		this.phaseData.set(phase, {
			lastTime: os.clock(),
			deltaTime: 0,
			currentTime: os.clock(),
		});
	}

	private updatePhase(phase: Phase): void {
		let data = this.phaseData.get(phase);
		if (data === undefined) {
			this.setupPhase(phase);
			data = this.phaseData.get(phase)!;
		}
		data.deltaTime = data.currentTime - data.lastTime;
		data.lastTime = data.currentTime;
		data.currentTime = os.clock();
	}

	build(schedular: Scheduler<unknown[]>): void {
		schedular._orderedPhases.forEach((phase) => {
			this.setupPhase(phase);
		});
		schedular._addHook(schedular.Hooks.PhaseBegan, (phase) => {
			this.updatePhase(phase);
		});
		schedular._addHook(schedular.Hooks.SystemAdd, (info) => {
			const SystemInfo = info.system;
			const system = SystemInfo.system;
			this.systemData.set(system, { system, deltaTime: 0, logs: [], data: {} });
		});
		schedular._addHook(schedular.Hooks.SystemRemove, (info) => {
			const SystemInfo = info.system;
			const system = SystemInfo.system;
			this.systemData.delete(system);
		});
		schedular._addHook(schedular.Hooks.SystemReplace, (info) => {
			const oldSystemInfo = info.old;
			const newSystemInfo = info.new;
			const oldSystem = oldSystemInfo.system;
			const newSystem = newSystemInfo.system;
			const data = this.systemData.get(oldSystem);
			assert(data !== undefined, "System data not found");
			this.systemData.delete(oldSystem);
			this.systemData.set(newSystem, data);
		});
		schedular._addHook(schedular.Hooks.OuterSystemCall, (info) => {
			const system = info.system.system;
			const phase = info.system.phase;
			const nextFn = info.nextFn;
			const phaseData = this.phaseData.get(phase);
			assert(phaseData !== undefined, "Phase data not found"); // Should never happen
			const data = this.systemData.get(system);
			if (!data) return () => { }
			assert(data !== undefined, "System data not found"); // Should never happen
			data.deltaTime = phaseData.deltaTime;
			return () => {
				start(data.data, data, () => {
					nextFn();
				});
			};
		});
	}
}