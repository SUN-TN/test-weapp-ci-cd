import { View } from "@tarojs/components";
import { Button, TextArea } from "@nutui/nutui-react-taro";
import { observer } from "mobx-react-lite";
import { useAppContext } from "@/context";
import { navigateTo } from "@tarojs/taro";
import { TestApi } from "@/api/test";

import "./index.scss";
import { useState } from "react";
function Index() {
  const { userStore } = useAppContext();
  const [name, setName] = useState(userStore.name);
  const onGetArticle = async () => {
    const res = await TestApi.getArticle({
      pageSize: 10,
      pageIndex: 1,
      searchKey: "测试",
    });
    console.log(res);
  };
  const changeName = () => {
    userStore.setName(name);
  };
  return (
    <View className="nutui-react-demo">
      <View>{userStore.name}</View>
      <View>
        <TextArea
          showCount
          maxLength={20}
          placeholder="请输入姓名"
          onChange={setName}
        />
        <Button type="primary" onClick={changeName}>
          changeName
        </Button>
        <Button
          type="primary"
          onClick={() => navigateTo({ url: "/pages/page2/index" })}
        >
          goPage2
        </Button>
        <Button onClick={onGetArticle}>测试接口</Button>
      </View>
    </View>
  );
}

export default observer(Index);
