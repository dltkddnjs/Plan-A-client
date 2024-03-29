import { MouseEvent, ReactElement, useRef, useState, useEffect } from "react";

import { Box, Divider, VStack } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/react";
import { createPortal } from "react-dom";

import useMounted from "@/hooks/useMounted";

type DropdownProps = {
  menus: string[];
  ref: React.RefObject<HTMLElement>;
  hAlign?: "left" | "right";
  vAlign?: "top" | "bottom";
  xGap?: number;
  yGap?: number;
  onMenuClick?: (index: number, menu: string) => void;
};

export function useDropdown({
  menus,
  ref,
  hAlign,
  vAlign,
  xGap,
  yGap,
  onMenuClick,
}: DropdownProps): [ReactElement, (flag?: boolean) => void] {
  const mounted = useMounted();
  const menuRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [scrollPos, setScrollPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => {
      setScrollPos({
        x: window.scrollX,
        y: window.scrollY,
      });
    };

    // 스크롤 이벤트 리스너를 추가합니다.
    window.addEventListener("scroll", handleScroll);

    // 컴포넌트가 언마운트될 때 이벤트 리스너를 제거합니다.
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  function toggle(flag?: boolean) {
    setIsOpen(prevIsOpen => {
      if (flag !== undefined) return flag;

      return !prevIsOpen;
    });
  }

  const isRight = hAlign === "right";
  const isTop = vAlign === "top";

  const { offsetTop, offsetHeight, offsetLeft, offsetWidth } = ref.current || {
    offsetTop: 0,
    offsetHeight: 0,
    offsetLeft: 0,
    offsetWidth: 0,
  };

  const menuHeight = menuRef?.current?.offsetHeight || 0;

  const vGap = yGap || 0;
  const hGap = xGap || 0;

  const menuWidth = menuRef?.current?.offsetWidth || 0;

  const top =
    offsetTop +
    (isTop ? -menuHeight - vGap : offsetHeight + vGap) +
    scrollPos.y;
  const left =
    offsetLeft +
    (isRight ? offsetWidth - menuWidth - hGap : hGap) +
    scrollPos.x;

  function handleMenuClick(index: number, menu: string) {
    return () => {
      onMenuClick?.(index, menu);
    };
  }

  function handlePortalClick(e: MouseEvent<HTMLDivElement>) {
    e.preventDefault();
    if (e.currentTarget !== e.target) {
      return;
    }
    toggle(false);
  }

  const component = mounted ? (
    createPortal(
      <Box
        sx={{
          position: "fixed",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          zIndex: 99,
          pointerEvents: isOpen ? "auto" : "none",
        }}
        onClick={handlePortalClick}
      >
        <VStack
          ref={menuRef}
          sx={{
            borderRadius: "12px",
            position: "absolute",
            transition: "transform 0.2s ease",
            transformOrigin: "top center",
            transform: isOpen ? "scale(1)" : "scale(0)",
            background: "white",
            padding: 0,
            left: `${left}px`,
            top: `${top}px`,
            boxShadow: "0px 0px 20px rgba(48, 49, 54, 0.24)",
          }}
          divider={<Divider />}
          spacing={0}
        >
          {menus.map((menu, index) => (
            <Button
              sx={{
                padding: "12px 16px",
                height: "auto",
                WebkitTapHighlightColor: "transparent",
              }}
              borderRadius={0}
              variant={"unstyled"}
              key={menu}
              textStyle="body2"
              _hover={{
                background: "primary.50",
              }}
              _active={{
                background: "primary.50",
              }}
              onClick={handleMenuClick(index, menu)}
            >
              {menu}
            </Button>
          ))}
        </VStack>
      </Box>,
      document.body,
    )
  ) : (
    <></>
  );

  return [component, toggle];
}
