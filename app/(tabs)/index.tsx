import { StyleSheet, View } from "react-native";
import HeaderSearchInput from "@/components/SearchInput";
import { useState } from "react";
import { BodyContainer } from "@/containers/BodyContainer";
import FooterContainer from "@/containers/FooterContainer";

export default function HomeScreen() {
  const [searchInputValue, setSearchInputValue] = useState("");
  const [wordHistoryList, setWordHistoryList] = useState<string[]>([]);
  const [currentSelectedWordIndex, setCurrentSelectedWordIndex] = useState<number>(-1);

  function handleWordSelection(word: string) {
    setSearchInputValue("");

    // Find the position of the word in the list if it exists
    const existingWordIndex = wordHistoryList.indexOf(word);

    // If the word exists, slice the list up to the word
    let newWordHistoryList;
    if (existingWordIndex !== -1) {
      newWordHistoryList = wordHistoryList.slice(0, existingWordIndex);
    } else {
      newWordHistoryList = [...wordHistoryList];
    }

    // Add the new word to the list
    newWordHistoryList.push(word);
    setWordHistoryList(newWordHistoryList);
    setCurrentSelectedWordIndex(newWordHistoryList.length - 1);
  }

  function handleLeftClick() {
    if (currentSelectedWordIndex > 0) {
      setCurrentSelectedWordIndex(currentSelectedWordIndex - 1);
    }
  }

  function handleRightClick() {
    if (currentSelectedWordIndex < wordHistoryList.length - 1) {
      setCurrentSelectedWordIndex(currentSelectedWordIndex + 1);
    }
  }

  return (
    <View style={styles.container}>
      <HeaderSearchInput inputValue={searchInputValue} setInputValue={setSearchInputValue} />
      <BodyContainer
        key={currentSelectedWordIndex}
        searchInputValue={searchInputValue}
        wordHistoryList={wordHistoryList}
        onWordSelection={handleWordSelection}
        currentSelectedWordIndex={currentSelectedWordIndex}
      />
      {!searchInputValue && wordHistoryList.length > 0 && (
        <FooterContainer
          currentWord={wordHistoryList[currentSelectedWordIndex]}
          leftWord={
            currentSelectedWordIndex > 0 ? wordHistoryList[currentSelectedWordIndex - 1] : ""
          }
          rightWord={
            currentSelectedWordIndex < wordHistoryList.length - 1
              ? wordHistoryList[currentSelectedWordIndex + 1]
              : ""
          }
          onLeftClick={handleLeftClick}
          onRightClick={handleRightClick}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#afdda7",
    paddingTop: 25,
  },
});
