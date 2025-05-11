import { World } from "@rbxts/jecs";
import { routes } from "shared/network";
import { useRoute } from "shared/plugin-hooks/hooks/use-route";
import { useThrottle } from "shared/plugin-hooks/hooks/use-throttle";

export default (world: World) => {
    useRoute(routes.updateBar, ({ barType, barData }) => {
        print("received", barType)
    })
}