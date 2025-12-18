import { getFilePath } from "@/utils/getFilePath";
import { Image, ImageProps } from "@nutui/nutui-react-taro";

export default function ImageRender(props: Partial<ImageProps>) {
  const { src = "", ...rest } = props;
  const url = getFilePath(src);
  return <Image {...rest} src={url} />;
}
