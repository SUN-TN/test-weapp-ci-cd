import { useState } from "react";
import { useStore } from "@/stores";

export function usePrivacyConfirmPopup() {
  const [showPrivacyConfirmPopup, setShowPrivacyConfirmPopup] = useState(false);
  const { userStore } = useStore();
  const onAgree = () => {
    // 同意隐私政策
    userStore.setIsAgree(true);
    setShowPrivacyConfirmPopup(false);
  };
  const onDisagree = () => {
    // 拒绝隐私政策
    userStore.setIsAgree(false);
    setShowPrivacyConfirmPopup(false);
  };

  return {
    showPrivacyConfirmPopup,
    setShowPrivacyConfirmPopup,
    onAgree,
    onDisagree,
  };
}
