import {
  Box,
  Button,
  ChakraComponent,
  ChakraProps,
  Flex,
  HTMLChakraComponents,
  Text,
  TextProps,
  chakra,
} from "@chakra-ui/react";
import { useRouter } from "next/router";

import IconBack from "../icons/IconBack";

type TitleProps = {
  text: React.ReactNode;
};

const Title: React.FC<TextProps & TitleProps> = ({ text, ...props }) => {
  return (
    <Text fontWeight={"semibold"} fontSize={"lg"} lineHeight={6} {...props}>
      {text}
    </Text>
  );
};

type HeaderProps = {
  title: string;
  onBackClick?: () => void;
  back?: boolean;
  leftTitle?: boolean;
  rightNode?: React.ReactNode;
} & ChakraProps;

const Header: React.FC<HeaderProps> = ({
  title,
  onBackClick,
  leftTitle,
  rightNode,
  back,
  ...props
}) => {
  const router = useRouter();

  function handleBackPress() {
    onBackClick?.();
    if (!onBackClick && back) {
      router.back();
    }
  }

  return (
    <chakra.header pos={"sticky"} top={0} left={0} {...props}>
      <Flex justify={"center"} height={"auto"} align={"center"}>
        <Flex flex={1}>
          {(back || onBackClick) && (
            <Button
              variant={"unstyled"}
              minW={6}
              w={6}
              h={6}
              mr={2}
              onClick={handleBackPress}
            >
              <IconBack />
            </Button>
          )}
          <Box>{leftTitle && <Title fontSize={"1.5rem"} text={title} />}</Box>
        </Flex>
        <Box>{!leftTitle && <Title text={title} />}</Box>
        <Flex flex={1} justify={"flex-end"}>
          {rightNode}
        </Flex>
      </Flex>
    </chakra.header>
  );
};

export default Header;
