import { Body, Data, Tycoon, world } from "./components";

enum QueriesEnum {
    NoTycoon = "NoTycoon"
}

const Queries = {
    [QueriesEnum.NoTycoon]: world.query(Body, Data).without(Tycoon).cached()
}
export const Q = Queries