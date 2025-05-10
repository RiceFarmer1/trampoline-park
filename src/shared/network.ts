import ByteNet, { bool, defineNamespace, definePacket, struct } from "@rbxts/bytenet";
import { Entity } from "@rbxts/jecs";

type packet<T extends ByteNetType<unknown>> = ReturnType<typeof ByteNet.definePacket<T>>
type optional<T extends ByteNetType<unknown>> = ByteNetType<
    T["value"] | undefined
>;
type struct<T extends { [index: string]: ByteNetType<unknown> }> = ReturnType<typeof ByteNet.struct<T>>
type ByteNetType<T> = {
    value: T;
};


type MapTableToByteNet<T> =
    T extends Instance ? ByteNetType<T | Instance> :
    T extends Array<unknown> ? ByteNetType<MapTableToByteNet<T[keyof T]>> : (
        T extends object ? struct<{ [newKey in keyof T]: MapTableToByteNet<T[newKey]> }> :
        ByteNetType<T>
    );

export const packets = defineNamespace("Packets", () => {
    return {
        // ui
         updateBar: definePacket({
            value: struct({
                barType: ByteNet.string as ByteNetType<"health" | "chakra" | "hunger" | "stamina" | "evasive">,
                barData: struct({
                    current: ByteNet.uint16, 
                    max: ByteNet.uint16, 
                }),
            }),
            reliabilityType: "reliable"
        }),

        canRush: definePacket({
            value: struct({
                victimEntity: ByteNet.unknown as ByteNetType<Entity>, 
                canRush: bool, 
            }),
        }),

        // for replicating to all players
        getReplicatedComponents: definePacket({ 
            value: ByteNet.nothing, 
            reliabilityType: "reliable" 
        }),
    }
});


export const routes = {} as { [key in keyof typeof packets]: typeof packets[key] }

for (const [key, packet] of pairs(packets)) {
    const toBeCalled = new Set<FirstParam<typeof packet["listen"]>>()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const routeFaked = (routes as unknown as Record<any, unknown>)

    routeFaked[key] = {
        wait: packet.wait,
        send: packet.send,
        sendToAll: packet.sendToAll,
        sendTo: packet.sendTo,
        sendToList: packet.sendToList,
        sendToAllExcept: packet.sendToAllExcept,
        listen: (callback: FirstParam<typeof packet["listen"]>) => {
            toBeCalled.add(callback)
            return () => toBeCalled.delete(callback);
        },
    };

    packet.listen((...T: unknown[]) => {
        toBeCalled.forEach((callback: Callback) => callback(...T))
    });
}