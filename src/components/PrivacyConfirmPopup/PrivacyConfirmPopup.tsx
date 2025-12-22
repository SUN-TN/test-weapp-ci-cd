import { View, Text, Button } from "@tarojs/components";
import { Popup } from "@nutui/nutui-react-taro";
import {
  getUserProfile,
  showToast,
  navigateTo,
  type UserInfo,
} from "@tarojs/taro";
import { useState } from "react";
import classNames from "classnames";
import styles from "./PrivacyConfirmPopup.module.scss";

interface Props {
  visible: boolean;
  onAgree: (userInfo: UserInfo) => void; // 同意回调（携带用户信息）
  onDisagree: () => void; // 不同意回调
}

const PrivacyConfirmPopup: React.FC<Props> = ({
  visible,
  onAgree,
  onDisagree,
}) => {
  const [loading, setLoading] = useState(false);

  const handleAgree = async () => {
    setLoading(true);
    try {
      // 调用微信接口获取用户基本信息
      const profile = await getUserProfile({
        desc: "用于完善会员资料",
      });

      console.log("获取用户信息成功:", profile);
      onAgree?.(profile.userInfo);
    } catch (err) {
      console.error("获取用户信息失败:", err);
      showToast({
        title: "获取用户信息失败，请重试",
        icon: "none",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Popup
      visible={visible}
      position="center"
      round
      closeable={false}
      overlay
      style={{
        width: "80%",
        padding: "24px 24px",
        borderRadius: "24rpx",
        textAlign: "center",
      }}
    >
      <View className={styles.privacyPopupContent}>
        <Text className={styles.privacyTitle}>隐私权政策提示</Text>

        <Text className={styles.privacyText}>
          请你在使用小程序前点击
          <Text
            className={styles.privacyLink}
            onClick={() =>
              navigateTo({ url: "/pages/Policy/index?type=privacy" })
            }
          >
            《隐私权政策》
          </Text>
          并仔细阅读。 如您同意《隐私权政策》的全部内容，请点击
          <Text className={styles.highlight}>“同意并继续”</Text>
          开始我们的服务。
        </Text>

        <View className={styles.privacyButtons}>
          <Button
            className={classNames(styles.privacyBtn, styles.agree)}
            type="primary"
            loading={loading}
            onClick={handleAgree}
          >
            同意并继续
          </Button>

          <Button
            className={classNames(styles.privacyBtn, styles.disagree)}
            type="default"
            onClick={onDisagree}
          >
            不同意
          </Button>
        </View>
      </View>
    </Popup>
  );
};

export default PrivacyConfirmPopup;
