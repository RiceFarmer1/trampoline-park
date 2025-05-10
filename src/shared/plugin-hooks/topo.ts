import { SystemFn } from "@rbxts/planck/out/types";

type Cleanup<T> = (state: T) => boolean;

interface HookStorage<T> {
	cleanup?: Cleanup<T>;
	states: Map<string, T>;
}

interface HookContext {
	activeKeys: Set<string>;
	node: Record<string, HookStorage<unknown>>;
}

export interface FrameState {
    currentSystem?: SystemFn<unknown[]>;
    deltaTime: number;
    [key: string]: unknown;
}

const stack: Array<HookContext> = [];
const frameStack: Array<FrameState> = [];

function cleanupUnused(): void {
	const context = stack.pop();
	assert(context, "No context to cleanup.");

	for (const [_, storage] of pairs(context.node)) {
		for (const [key, state] of storage.states) {
			if (!context.activeKeys.has(key) && (!storage.cleanup || storage.cleanup(state))) {
				storage.states.delete(key);
			}
		}
	}
}

/**
 * Starts a new stack frame for a function, ensuring cleanup after execution.
 * Intended to be used in systems.
 *
 * @param node - The node to store the state for the current function.
 * @param frame - The current frame state.
 * @param callback - The function to execute within the new stack frame.
 */
export function start(node: Record<string, HookStorage<unknown>>, frame: FrameState, callback: () => void): void {
	stack.push({ activeKeys: new Set(), node });
    frameStack.push(frame);
	callback();
	cleanupUnused();
	stack.pop();
    frameStack.pop();
}

export function useCurrentFrame(): FrameState {
    assert(frameStack.size() > 0, "Attempted to use a hook outside of a system.");
    return frameStack[frameStack.size() - 1];
}

/**
 * Creates or retrieves a state object for a hook, keyed by a unique identifier.
 *
 * @template T The type of the hook state.
 * @param key - A unique string identifier for the hook state.
 * @param discriminator - An optional value to further distinguish different
 *   states within the same key. Defaults to the key itself.
 * @param cleanup - An optional function that determines whether the state
 *   should be cleaned up. It should return true if the state should be removed.
 *   If not provided, the state will be cleaned up when the hook was not
 *   accessed in the current context.
 * @returns The state object of type T.
 */
export function useHookState<T>(discriminator: unknown, cleanup?: Cleanup<T>): T {
    const [file, line] = debug.info(3, "sl");
    const [fn] = debug.info(2, "f");
    const key = `${tostring(fn)}:${file}:${line}`;

	discriminator ??= key;

	const context = stack[stack.size() - 1];
	assert(context, "Hooks can only be used within a `start` function.");

	let storage = context.node[key] as HookStorage<T> | undefined;

	if (!storage) {
		storage = { cleanup, states: new Map() };
		context.node[key] = storage as HookStorage<unknown>;
	}

	const stringDiscriminator = tostring(discriminator);
	const compositeKey = `${key}-${stringDiscriminator}`;
	context.activeKeys.add(compositeKey);

	let state = storage.states.get(compositeKey);

	if (state === undefined) {
		state = {} as T;
		storage.states.set(compositeKey, state);
	}

	return state;
}