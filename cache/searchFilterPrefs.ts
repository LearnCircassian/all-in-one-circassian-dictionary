import { getAllSupportedLangs, SupportedLang } from "~/interfaces";
import { CACHE_VERSION, SEARCH_FILTER_PREFS_CACHE_KEY } from "~/constants/cache";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface SearchFilterPrefsCache {
  fromLang: SupportedLang[];
  toLang: SupportedLang[];
  version: string;
}

const DEFAULT_SEARCH_FILTER_PREFS: SearchFilterPrefsCache = {
  fromLang: getAllSupportedLangs(),
  toLang: getAllSupportedLangs(),
  version: CACHE_VERSION,
};

export async function getSearchFilterPrefsCache(): Promise<SearchFilterPrefsCache> {
  try {
    const prefs = await AsyncStorage.getItem(SEARCH_FILTER_PREFS_CACHE_KEY);
    if (!prefs) {
      await saveSearchFilterPrefsCache(DEFAULT_SEARCH_FILTER_PREFS);
      return DEFAULT_SEARCH_FILTER_PREFS;
    }
    const parsed: SearchFilterPrefsCache = JSON.parse(prefs);
    if (parsed.version !== CACHE_VERSION) {
      await _resetSearchFilterPrefs();
      return DEFAULT_SEARCH_FILTER_PREFS;
    }
    return parsed;
  } catch (err) {
    await _clearSearchFilterPrefsCache();
    return DEFAULT_SEARCH_FILTER_PREFS;
  }
}

export async function saveSearchFilterPrefsCache(searchFilterPrefs: SearchFilterPrefsCache) {
  await AsyncStorage.setItem(SEARCH_FILTER_PREFS_CACHE_KEY, JSON.stringify(searchFilterPrefs));
}

export async function _clearSearchFilterPrefsCache() {
  await AsyncStorage.removeItem(SEARCH_FILTER_PREFS_CACHE_KEY);
}

export async function _resetSearchFilterPrefs() {
  await _clearSearchFilterPrefsCache();
  await saveSearchFilterPrefsCache(DEFAULT_SEARCH_FILTER_PREFS);
}
