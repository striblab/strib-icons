import { IconsMap } from "./IconsMap";

(async () => {
    let map = new IconsMap()
  await map.initialize()
  await map.generateMap()
})()