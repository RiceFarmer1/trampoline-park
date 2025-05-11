import { Entity } from "@rbxts/jecs";
import Object from "@rbxts/object-utils";
import { ProducerActions, createProducer, Selector, Producer, createSelector } from "@rbxts/reflex";
import { Tycoon } from "shared/jecs/components";

export interface UIProducers {
	readonly tycoon: { ownership: Entity; index: number } | undefined;
}

const initialState: UIProducers = {
	tycoon: undefined,
};

const producerFunctions = {
	updateTycoon: (state: UIProducers, levelingData: UIProducers["tycoon"]) => ({ ...state, levelingData }),
};

export const producer = createProducer<UIProducers, typeof producerFunctions>(initialState, producerFunctions);

export type RootProducer = typeof producer;
export const useMatterProducer = () => producer.getDispatchers();
export const useMatterSelector = <A>(callBack: (state: UIProducers) => A) => callBack(producer.getState());
