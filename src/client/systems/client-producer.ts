import { Entity } from "@rbxts/jecs";
import Object from "@rbxts/object-utils";
import { ProducerActions, createProducer, Selector, Producer, createSelector } from "@rbxts/reflex";

export interface MatterProducers {
    // camera state
    tycoon: string
}



const initialState: MatterProducers = {
    // camera state
    tycoon: "None",

};


const producerFunctions = {
    // camera state
    setTycoon: (state: MatterProducers, tycoon: MatterProducers["tycoon"]) => ({
        ...state,
        tycoon,
    }),

}


export const producer = createProducer<MatterProducers, typeof producerFunctions>(initialState, producerFunctions);

export type RootProducer = typeof producer;
export const useMatterProducer = () => producer.getDispatchers();
export const useMatterSelector = <A>(callBack: (state: MatterProducers) => A) => callBack(producer.getState())