/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";

import { Badge, Box, Text } from "@chakra-ui/layout";
import { useRouter } from "next/router";

import useBoardList from "@/hooks/board/useBoardList";
import { BOARD_ID_MAP } from "@/utils/boardIdMap";
import formatDate from "@/utils/formatDate";

import BoardStack from "./BoardStack";
import FreeBoardItem from "./FreeBoardItem";
import checkDday from "@/utils/checkDday";
import formatDateRange from "@/utils/formatDateRange";

type OrderType = "recent" | "popular";

const PostsList = ({
  boardName,
  type = "NORMAL",
}: {
  boardName: "채용" | "대외활동" | "동아리" | "익명게시판" | "학교생활";
  type?: "NORMAL" | "ANNOUNCEMENT" | "RECRUITMENT";
}) => {
  const boardId = BOARD_ID_MAP[boardName];
  const router = useRouter();
  const [order, setOrder] = useState<OrderType>("recent");
  const [page, setPage] = useState<number>(1);
  const [isFinish, setIsFinish] = useState(false);
  const [boardList, setBoardList] = useState<any[]>([]);
  const boardListResponse = useBoardList({ boardId, order, page, type });
  // const [loading, setLoading] = useState<boolean>(false);
  // useEffect(() => {
  //   const handleScroll = () => {
  //     if (
  //       window.innerHeight + window.scrollY >=
  //         document.documentElement.scrollHeight - 500 &&
  //       !loading
  //     ) {
  //       setPage(prevPage => prevPage + 1);
  //     }
  //   };

  //   window.addEventListener("scroll", handleScroll);
  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  // }, [loading]);
  const handleChangeOrder = (type: OrderType) => {
    if (boardList === null) return;
    setPage(1);
    setIsFinish(false);
    setOrder(type);
    setBoardList([]);
  };

  useEffect(() => {
    if (boardListResponse === null) return;
    if (boardListResponse?.length === 0) {
      setIsFinish(true);
      return;
    }

    setBoardList(p => [...p, ...boardListResponse]);
  }, [boardListResponse]);

  const getMorePosts = () => {
    if (isFinish) return;
    setPage(p => p + 1);
  };
  console.log("bbb", boardList);
  return (
    <div>
      <div>
        <Badge
          bg={order === "recent" ? "primary.100" : "gray.100"}
          color={order === "recent" ? "primary.500" : "gray.400"}
          borderColor={order === "recent" ? "primary.500" : "gray.400"}
          border={order === "recent" ? "1px solid" : "none"}
          borderRadius={"md"}
          paddingY={"1px"}
          mr={"8px"}
          onClick={() => handleChangeOrder("recent")}
        >
          최신순
        </Badge>
        <Badge
          bg={order === "popular" ? "primary.100" : "gray.100"}
          color={order === "popular" ? "primary.500" : "gray.400"}
          borderColor={order === "popular" ? "primary.500" : "gray.400"}
          border={order === "popular" ? "1px solid" : "none"}
          borderRadius={"md"}
          paddingY={"1px"}
          onClick={() => handleChangeOrder("popular")}
        >
          인기순
        </Badge>
      </div>
      {boardList === null ? (
        "loading..."
      ) : (
        <BoardStack>
          {boardList.map(el => {
            const date = el.recruitmentStartDate
              ? formatDateRange(el.recruitmentStartDate, el.recruitmentEndDate)
              : formatDate(el.createdAt);
            return (
              <FreeBoardItem
                key={el.commentCount}
                comments={el.commentCount}
                likes={el.likeCount}
                date={date}
                views={el.viewCount}
                title={el.title}
                dday={
                  !el.recruitmentStartDate
                    ? null
                    : checkDday(el.recruitmentStartDate, el.recruitmentEndDate)
                }
                onClick={() => router.push(`/posting/${boardId}/${el.postId}`)}
              />
            );
          })}
        </BoardStack>
      )}
      {!isFinish ? (
        <Box w={"full"} textAlign={"center"} my={4}>
          <Text textStyle={"subtitle2"} onClick={getMorePosts}>
            더보기
          </Text>
        </Box>
      ) : null}
    </div>
  );
};
export default PostsList;
