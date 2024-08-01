import React, { useMemo, useState } from "react";
import RenderHtml, {
  HTMLContentModel,
  HTMLElementModel,
  HTMLSource,
} from "react-native-render-html";
import {
  ActivityIndicator,
  FlatList,
  ListRenderItemInfo,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { SupportedLang, WordDefinitionsResults } from "@/interfaces";
import { useQuery } from "@tanstack/react-query";
import { addToWordHistoryCache, findInWordHistoryCache } from "@/cache/wordHistory";
import { fetchExactWordDefinitions } from "@/requests";

const fontElementModel: HTMLElementModel<"font", HTMLContentModel.mixed> =
  HTMLElementModel.fromCustomModel({
    tagName: "font",
    contentModel: HTMLContentModel.mixed,
    getUADerivedStyleFromAttributes({
      face,
      color,
      size,
    }: {
      face?: string;
      color?: string;
      size?: string;
    }) {
      const style: { fontFamily?: string; color?: string } = {};
      if (face) {
        style.fontFamily = face;
      }
      if (color) {
        style.color = color;
      }
      if (size) {
        // handle size such as specified in the HTML4 standard. This value
        // IS NOT in pixels. It can be absolute (1 to 7) or relative (-7, +7):
        // https://www.w3.org/TR/html4/present/graphics.html#edef-FONT
        // implement your solution here
      }

      return style;
    },
  });

const customHTMLElementModels: {
  font: HTMLElementModel<"font", HTMLContentModel.mixed>;
} = { font: fontElementModel };

interface WordDefinitionsProps {
  wordSpelling: string;
}

export default function WordDefinitions({ wordSpelling }: WordDefinitionsProps) {
  const [selectedFromTab, setSelectedFromTab] = useState<SupportedLang | "All">("All");
  const [selectedToTab, setSelectedToTab] = useState<SupportedLang | "All">("All");
  const {
    data: allDefResults = [] as WordDefinitionsResults[],
    isLoading: isWordDefinitionsLoading,
    isFetching: isWordDefinitionsFetching,
    isError: isWordDefinitionsErrored,
  } = useQuery({
    staleTime: 60000,
    gcTime: 60000,
    retry: 1,
    queryKey: ["wordDefinitions", wordSpelling],
    queryFn: async (): Promise<WordDefinitionsResults[]> => {
      if (!wordSpelling || wordSpelling.trim() === "") {
        return [];
      }

      const foundResults = await findInWordHistoryCache(wordSpelling);
      if (foundResults) {
        console.log(`Found word definitions for ${wordSpelling} in cache`);
        return foundResults;
      }

      const wordObjectRes = await fetchExactWordDefinitions(wordSpelling);
      if (wordObjectRes.isErr()) {
        console.error(`Failed to find word definitions for ${wordSpelling}`);
        throw new Error(`Failed to find word definitions for ${wordSpelling}`);
      }

      console.log(`Fetched word definitions for ${wordSpelling}, saving to cache`);
      await addToWordHistoryCache(wordObjectRes.value);
      return wordObjectRes.value;
    },
  });

  const uniqueFromLangs = useMemo(() => {
    const allLangs = new Set<SupportedLang>();
    allDefResults.forEach((wd) => {
      wd.fromLangs.forEach((lang) => allLangs.add(lang));
    });
    return Array.from(allLangs);
  }, [allDefResults]);

  const uniqueToLangs = useMemo(() => {
    const allLangs = new Set<SupportedLang>();
    allDefResults.forEach((wd) => {
      wd.toLangs.forEach((lang) => allLangs.add(lang));
    });
    return Array.from(allLangs);
  }, [allDefResults]);

  const defResultsAfterFilter = useMemo(() => {
    return allDefResults.filter((wd) => {
      const fromLangs = wd.fromLangs;
      const toLangs = wd.toLangs;
      return (
        (selectedFromTab === "All" || fromLangs.includes(selectedFromTab)) &&
        (selectedToTab === "All" || toLangs.includes(selectedToTab))
      );
    });
  }, [allDefResults, selectedFromTab, selectedToTab]);

  if (isWordDefinitionsErrored) {
    return (
      <View style={styles.container}>
        <Text selectable={true} style={{ textAlign: "center", color: "black" }}>
          Failed to find word definitions for {wordSpelling}
        </Text>
      </View>
    );
  }

  if (isWordDefinitionsLoading || isWordDefinitionsFetching) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList<WordDefinitionsResults>
        ListHeaderComponent={
          <View>
            <View style={styles.header}>
              <Text selectable={true} style={styles.wordSpelling}>
                {wordSpelling}
              </Text>
              <Text selectable={true} style={styles.resultsCount}>
                {allDefResults.length === defResultsAfterFilter.length
                  ? `(${allDefResults.length} results)`
                  : `(${defResultsAfterFilter.length} out of ${allDefResults.length} results)`}
              </Text>
            </View>
            <View style={styles.filtersContainer}>
              <ResultFilters
                selectedFromTab={selectedFromTab}
                selectedToTab={selectedToTab}
                setSelectedFromTab={setSelectedFromTab}
                setSelectedToTab={setSelectedToTab}
                uniqueFromLangs={uniqueFromLangs}
                uniqueToLangs={uniqueToLangs}
              />
            </View>
          </View>
        }
        data={defResultsAfterFilter}
        keyExtractor={(item, index) => `${item.title}-${index}`}
        renderItem={({ item, index }) => <DefinitionBox wordDef={item} idx={index} />}
      />
    </View>
  );
}

function DefinitionBox({ wordDef, idx }: { wordDef: WordDefinitionsResults; idx: number }) {
  const { width } = useWindowDimensions();
  const source: HTMLSource = {
    html: wordDef.html,
  };

  const [definitionVisible, setDefinitionVisible] = useState<boolean>(true);

  const toggleDefinitionVisibility = () => {
    setDefinitionVisible(!definitionVisible);
  };

  return (
    <View
      key={idx}
      style={[styles.definitionBox, definitionVisible && styles.visibleDefinitionBox]}
    >
      <TouchableOpacity style={styles.definitionHeader} onPress={toggleDefinitionVisibility}>
        <Text selectable={true} style={styles.definitionTitle}>
          {wordDef.title} ({wordDef.fromLangs.join("/")} {"->"} {wordDef.toLangs.join("/")})
        </Text>
        <FontAwesome name="chevron-down" size={24} color="black" />
      </TouchableOpacity>
      {definitionVisible && (
        <RenderHtml
          source={source}
          contentWidth={width}
          customHTMLElementModels={customHTMLElementModels}
          baseStyle={styles.definitionContent}
          defaultTextProps={{ selectable: true }}
        />
      )}
    </View>
  );
}

interface ResultFiltersProps {
  selectedFromTab: SupportedLang | "All";
  selectedToTab: SupportedLang | "All";
  setSelectedFromTab: (lang: SupportedLang | "All") => void;
  setSelectedToTab: (lang: SupportedLang | "All") => void;
  uniqueFromLangs: SupportedLang[];
  uniqueToLangs: SupportedLang[];
}

function ResultFilters({
  selectedFromTab,
  selectedToTab,
  setSelectedToTab,
  setSelectedFromTab,
  uniqueFromLangs,
  uniqueToLangs,
}: ResultFiltersProps) {
  return (
    <View style={styles.filtersContainer}>
      <View style={styles.filterSection}>
        <Text selectable={true} style={styles.filterLabel}>
          From Language:
        </Text>
        <View style={styles.filterOptions}>
          <FilterButton
            label="All"
            selected={selectedFromTab === "All"}
            onPress={() => setSelectedFromTab("All")}
          />
          {uniqueFromLangs.sort().map((lang) => (
            <FilterButton
              key={lang}
              label={lang}
              selected={selectedFromTab === lang}
              onPress={() => setSelectedFromTab(lang)}
            />
          ))}
        </View>
      </View>

      <View style={styles.filterSection}>
        <Text selectable={true} style={styles.filterLabel}>
          To Language:
        </Text>
        <View style={styles.filterOptions}>
          <FilterButton
            label="All"
            selected={selectedToTab === "All"}
            onPress={() => setSelectedToTab("All")}
          />
          {uniqueToLangs.sort().map((lang) => (
            <FilterButton
              key={lang}
              label={lang}
              selected={selectedToTab === lang}
              onPress={() => setSelectedToTab(lang)}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

interface FilterButtonProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

function FilterButton({ label, selected, onPress }: FilterButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.filterButton, selected && styles.selectedFilterButton]}
    >
      <Text
        selectable={true}
        style={[styles.filterButtonText, selected && styles.selectedFilterButtonText]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: "white",
  },
  loading: {
    alignSelf: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  wordSpelling: {
    fontSize: 24,
    fontWeight: "bold",
  },
  resultsCount: {
    fontSize: 16,
  },
  filtersContainer: {
    marginBottom: 16,
  },
  filterSection: {
    marginBottom: 8,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  filterOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  filterButton: {
    backgroundColor: "#e0e0e0",
    padding: 8,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedFilterButton: {
    backgroundColor: "#007BFF",
  },
  filterButtonText: {
    color: "#000",
  },
  selectedFilterButtonText: {
    color: "#fff",
  },
  definitionBox: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  visibleDefinitionBox: {
    backgroundColor: "#fff",
  },
  definitionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  definitionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  definitionContent: {
    marginTop: 8,
  },
});
