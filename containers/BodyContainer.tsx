import SearchResults from "@/components/SearchResults";
import HomePageContent from "@/components/HomePageContent";
import WordDefinitions from "@/components/WordDefinitions";
import { StyleSheet } from "react-native";

interface BodyContainerProps {
  searchInputValue: string;
  wordHistoryList: string[];
  onWordSelection: (value: string) => void;
  currentSelectedWordIndex: number;
}

export function BodyContainer({
  searchInputValue,
  wordHistoryList,
  onWordSelection,
  currentSelectedWordIndex,
}: BodyContainerProps) {
  if (searchInputValue) {
    return <SearchResults searchInputValue={searchInputValue} onSelect={onWordSelection} />;
  }

  if (currentSelectedWordIndex === -1) {
    return <HomePageContent />;
  }

  return <WordDefinitions wordSpelling={wordHistoryList[currentSelectedWordIndex]} />;
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
