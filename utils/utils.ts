import { BoardItemType } from "@/types";

export const wait = (timeToDelay: number) =>
  new Promise(resolve => setTimeout(resolve, timeToDelay));

export const testAutocompleteFunction = async (keyword: string) => {
  const data: string[] = [];
  await wait(500);
  data.push(keyword);
  data.push(keyword);
  data.push(keyword);
  return data;
};

export const searchFunctionFactory = (type: string) => {
  const testSearchFunction = async (keyword: string) => {
    await wait(1000);
    const returnArray: BoardItemType[] = [];
    const tmpItem: BoardItemType = {
      id: 1,
      views: 123,
      leftTag: type,
      title: `제목 ${keyword}`,
      description: "본문",
      comments: 24,
      likes: 3,
      date: "2022-12-12",
    };
    returnArray.push({ ...tmpItem, id: 1 });
    returnArray.push({ ...tmpItem, id: 2 });
    returnArray.push({ ...tmpItem, id: 3 });
    return returnArray;
  };
  return testSearchFunction;
};