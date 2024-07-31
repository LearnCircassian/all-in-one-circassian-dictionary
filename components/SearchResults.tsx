import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  View,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { Autocomplete } from "@/interfaces";
import { useDebounce } from "use-debounce";
import {
  fetchWordAutocompletes,
  fetchWordAutocompletesThatContains,
  fetchWordAutocompletesWithVerbs,
} from "@/requests";
import { containsOnlyEnglishLetters } from "@/utils/lang";
import { Result } from "neverthrow";
import {
  findAllAutocompletesInWordHistoryCache,
  findAutocompletesInWordHistoryCache,
} from "@/cache/wordHistory";

interface SearchResultsProps {
  searchInputValue: string;
  onSelect: (word: string) => void;
}

export default function SearchResults({ searchInputValue, onSelect }: SearchResultsProps) {
  let [debouncedSearchInputValue] = useDebounce(searchInputValue, 500);

  const {
    data: autocompletesList = [],
    isLoading: isAutocompletesListLoading,
    isFetching: isAutocompletesListFetching,
  } = useQuery({
    staleTime: 60000,
    gcTime: 60000,
    queryKey: ["autocompleteWords", debouncedSearchInputValue],
    queryFn: async (): Promise<Autocomplete[]> => {
      if (!debouncedSearchInputValue) {
        return [];
      }

      let res: Result<Autocomplete[], string>;
      if (4 <= debouncedSearchInputValue.length) {
        res = await fetchWordAutocompletesThatContains(debouncedSearchInputValue);
      } else if (containsOnlyEnglishLetters(debouncedSearchInputValue)) {
        res = await fetchWordAutocompletesWithVerbs(debouncedSearchInputValue);
      } else {
        res = await fetchWordAutocompletes(debouncedSearchInputValue);
      }

      if (res.isErr()) {
        return [];
      }

      return res.value;
    },
  });

  const { data: cachedAutocompletesList = [] } = useQuery({
    staleTime: 60000,
    gcTime: 60000,
    queryKey: ["cachedAutocompletesList", debouncedSearchInputValue],
    queryFn: async (): Promise<string[]> => {
      if (debouncedSearchInputValue.trim() === "") {
        return await findAllAutocompletesInWordHistoryCache();
      }
      return await findAutocompletesInWordHistoryCache(debouncedSearchInputValue);
    },
  });

  if (isAutocompletesListLoading || isAutocompletesListFetching) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList<Autocomplete>
        data={autocompletesList.sort((a, b) => {
          const aIsCached = cachedAutocompletesList.includes(a.key.toLowerCase());
          const bIsCached = cachedAutocompletesList.includes(b.key.toLowerCase());

          if (aIsCached && !bIsCached) return -1;
          if (!aIsCached && bIsCached) return 1;

          const aStartsWith = a.key
            .toLowerCase()
            .startsWith(debouncedSearchInputValue.toLowerCase());
          const bStartsWith = b.key
            .toLowerCase()
            .startsWith(debouncedSearchInputValue.toLowerCase());

          if (aStartsWith && !bStartsWith) return -1;
          if (!aStartsWith && bStartsWith) return 1;

          return a.key.localeCompare(b.key);
        })}
        renderItem={(v) => {
          const index = v.item.key.toLowerCase().indexOf(debouncedSearchInputValue.toLowerCase());
          const before = v.item.key.slice(0, index);
          const bold = v.item.key.slice(index, index + debouncedSearchInputValue.length);
          const after = v.item.key.slice(index + debouncedSearchInputValue.length);
          const isCached = cachedAutocompletesList.includes(v.item.key.toLowerCase());

          return (
            <TouchableOpacity
              onPress={() => {
                onSelect(v.item.key);
              }}
              style={[styles.resultTextContainer]}
            >
              <Text
                selectable={true}
                style={{ fontSize: 8, marginTop: 4, color: isCached ? "purple" : "black" }}
              >
                [{v.item.fromLangs.join(", ")}]
              </Text>
              <Text
                style={{
                  color: isCached ? "purple" : "black",
                  fontSize: 22,
                }}
              >
                <Text>{before}</Text>
                <Text selectable={true} style={{ fontWeight: "bold" }}>
                  {bold}
                </Text>
                <Text>{after}</Text>
              </Text>
            </TouchableOpacity>
          );
        }}
        keyExtractor={(v) => v.key}
        ListEmptyComponent={
          <Text selectable={true} style={styles.noResults}>
            No results found
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  resultTextContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    gap: 2,
  },
  noResults: {
    fontSize: 18,
    color: "gray",
    textAlign: "center",
    marginTop: 20,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  feedback: {
    fontSize: 16,
    color: "blue",
    textAlign: "center",
    marginTop: 10,
  },
});
