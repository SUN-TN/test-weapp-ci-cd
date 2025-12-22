import { View } from "@tarojs/components";
import AuthWrap from "@/components/AuthWrap/AuthWrap";

import styles from "./index.module.scss";
export default function Index() {
  return (
    <AuthWrap>
      <View className={styles.taroApp}>taro app</View>
    </AuthWrap>
  );
}
