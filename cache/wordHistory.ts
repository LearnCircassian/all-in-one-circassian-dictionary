import { WordDefinitionsResults } from "~/interfaces";
import { CACHE_VERSION, WORD_HISTORY_CACHE_KEY } from "~/constants/cache";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MAX_WORD_HISTORY_CACHE = 100;

interface WordHistoryCache {
  savedResults: WordDefinitionsResults[][];
  version: string;
}

export async function _loadWordHistoryCache(): Promise<WordDefinitionsResults[][]> {
  try {
    const serializedState = await AsyncStorage.getItem(WORD_HISTORY_CACHE_KEY);
    if (!serializedState) {
      return [];
    }
    const parsed: WordHistoryCache = JSON.parse(serializedState);
    if (parsed.version !== CACHE_VERSION) {
      _clearWordHistoryCache();
      return [];
    }
    return parsed.savedResults;
  } catch (err) {
    console.error(`Error loading word history cache: ${err}`);
    _clearWordHistoryCache();
    return [];
  }
}

// Function to save state to localStorage
async function _saveWordHistoryCache(state: WordDefinitionsResults[][]) {
  try {
    const objToSave: WordHistoryCache = {
      savedResults: state,
      version: CACHE_VERSION,
    };
    const serializedObj = JSON.stringify(objToSave);
    await AsyncStorage.setItem(WORD_HISTORY_CACHE_KEY, serializedObj);
  } catch (err) {
    console.error(`Error saving word history cache: ${err}`);
  }
}

async function _clearWordHistoryCache() {
  await AsyncStorage.removeItem(WORD_HISTORY_CACHE_KEY);
  await _saveWordHistoryCache([]);
}

export async function findInWordHistoryCache(
  word: string,
): Promise<WordDefinitionsResults[] | undefined> {
  const lastUsedWords = await _loadWordHistoryCache();
  return lastUsedWords.find((wordResults) => {
    if (wordResults.length === 0) {
      return false;
    }
    const wordRes = wordResults[0];
    return wordRes.spelling.toLowerCase() === word.toLowerCase();
  });
}

export async function findSeveralInWordHistoryCache(
  words: string[],
): Promise<WordDefinitionsResults[] | undefined> {
  const lastUsedWords = await _loadWordHistoryCache();
  const listToReturn: WordDefinitionsResults[] = [];

  for (const wordResults of lastUsedWords) {
    if (wordResults.length === 0) {
      continue;
    }
    const wordRes = wordResults[0];
    if (words.includes(wordRes.spelling.toLowerCase())) {
      listToReturn.push(wordRes);
    }
  }

  return listToReturn;
}

export async function findAutocompletesInWordHistoryCache(word: string): Promise<string[]> {
  const lastUsedWords = await _loadWordHistoryCache();
  const listToReturn: string[] = [];

  for (const wordResults of lastUsedWords) {
    if (wordResults.length === 0) {
      continue;
    }
    const wordRes = wordResults[0];
    if (wordRes.spelling.toLowerCase().startsWith(word.toLowerCase())) {
      listToReturn.push(wordRes.spelling);
    }
  }

  return listToReturn;
}

export async function findAllAutocompletesInWordHistoryCache(): Promise<string[]> {
  const lastUsedWords = await _loadWordHistoryCache();
  const listToReturn: string[] = [];

  for (const wordResults of lastUsedWords) {
    if (wordResults.length === 0) {
      continue;
    }
    const wordRes = wordResults[0];
    listToReturn.push(wordRes.spelling);
  }

  return listToReturn;
}

export async function addToWordHistoryCache(word: WordDefinitionsResults[]) {
  if (word.length === 0) {
    return;
  }

  const lastUsedWords = await _loadWordHistoryCache();

  // Check if word already exists in history
  const existingIndex = lastUsedWords.findIndex((wordResults) => {
    if (wordResults.length === 0) {
      return false; // remove empty arrays
    }
    const wordRes = wordResults[0];
    return wordRes.spelling === word[0].spelling;
  });

  // If word does not exist, add it to the beginning of the array
  if (existingIndex === -1) {
    lastUsedWords.unshift(word); // Add to the beginning of the array

    // Ensure the cache does not exceed 100 instances
    if (lastUsedWords.length > MAX_WORD_HISTORY_CACHE) {
      lastUsedWords.pop(); // Remove the oldest word
    }

    await _saveWordHistoryCache(lastUsedWords);
  }
}

export async function removeFromWordHistoryCache(word: string) {
  const lastUsedWords = await _loadWordHistoryCache();

  // Filter out the word to remove
  const newLastUsedWords = lastUsedWords.filter((wordResults) => {
    if (wordResults.length === 0) {
      return false;
    }
    const wordRes = wordResults[0];
    return wordRes.spelling !== word;
  });

  // Save the updated history
  await _saveWordHistoryCache(newLastUsedWords);
}
