import { Box } from "@chakra-ui/layout";
import { useRouter } from "next/router";

import postApis from "@/api/post";
import BoardBanner from "@/components/board/BoardBanner";
import BoardFAB from "@/components/board/BoardFAB";
import PostsList from "@/components/board/PostsList";
import { AppContainer, Header } from "@/components/common";
import SearchModal from "@/components/common/SearchModal";
import Navbar from "@/components/layout/Navbar";
import { searchFunctionFactory, testAutocompleteFunction } from "@/utils/utils";

function Anonymous() {
  const testSearchFunction = searchFunctionFactory("익명게시판");
  const router = useRouter();
  const handlePost = async () => {
    const response = await postApis.checkAgree();
    if (response.data?.data) {
      router.push(`/board/form?boardId=4&postType=NORMAL`);
    } else {
      // 최초 1회 공지
      if (response.code === 401) {
        router.push("/login");
      } else {
        router.push("/board/initialNotice?boardId=4&postType=NORMAL");
      }
    }
  };
  return (
    <AppContainer>
      <Navbar currentTab="mainBoard" />
      <Header
        mt={4}
        leftTitle
        title="익명게시판"
        rightNode={
          <SearchModal
            autocompleteFunction={testAutocompleteFunction}
            searchFunction={testSearchFunction}
          />
        }
      />
      <BoardBanner onClick={() => router.push("/posting/notice")}>
        게시판 이용 규칙 안내
      </BoardBanner>
      <Box mt={4}>
        <PostsList boardName={"익명게시판"} />
      </Box>
      <BoardFAB bottom={"70px"} onClick={handlePost} />
      <Box w={"full"} h={"64px"} />
    </AppContainer>
  );
}

export default Anonymous;
