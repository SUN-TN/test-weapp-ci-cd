import { View } from "@tarojs/components";
import { getSystemInfoSync, pxTransform } from "@tarojs/taro";

export default function SafeArea({
  position = "top",
}: {
  position?: "top" | "bottom";
}) {
  const {
    statusBarHeight,
    screenHeight,
    safeArea: { bottom = 0 } = {},
  } = getSystemInfoSync();
  const safeAreaHeight =
    position === "top"
      ? pxTransform(statusBarHeight || 0)
      : pxTransform(Math.max(screenHeight - bottom, 0));

  return <View style={{ height: safeAreaHeight }}></View>;
}
