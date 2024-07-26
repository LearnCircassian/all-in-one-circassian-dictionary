import React from "react";
import { View, Text, ScrollView, StyleSheet, Linking } from "react-native";
import { USED_DICTS } from "~/constants/dicts";
import { RANDOM_COLORS } from "~/constants/colors";
import { Image } from "expo-image";

export default function HomePageContent() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require("../assets/images/fav/icon-1042x1042.png")}
        style={{ width: 100, height: 100 }}
      />
      <Text selectable={true} style={styles.title}>
        Dictionaries Used: {USED_DICTS.length}
      </Text>
      <View style={styles.subTitleContainer}>
        <Text selectable={true} style={styles.subTitle}>
          Supporting Languages: Kbd, En, Ady, Ar, Tu & Ru
        </Text>
      </View>
      <View style={styles.dictContainer}>
        {USED_DICTS.map((dict, index) => (
          <View key={index} style={[styles.dictBox, { backgroundColor: RANDOM_COLORS[index] }]}>
            <Text selectable={true} style={styles.dictTitle}>
              {dict.title}
            </Text>
            <Text selectable={true} style={styles.dictText}>
              <Text selectable={true} style={styles.boldText}>
                From:
              </Text>{" "}
              {dict.fromLang} -{" "}
              <Text selectable={true} style={styles.boldText}>
                To:
              </Text>{" "}
              {dict.toLang}
            </Text>
            <Text selectable={true} style={styles.dictText}>
              <Text selectable={true} style={styles.boldText}>
                Entries Count:
              </Text>{" "}
              {dict.count}
            </Text>
          </View>
        ))}
      </View>
      <View style={styles.footer}>
        <Text selectable={true} style={styles.footerText}>
          You can contact us at:
          {"\n"}
          <Text selectable={true} style={styles.boldText}>
            learncircassian@gmail.com
          </Text>
        </Text>
        <Text selectable={true} style={styles.footerText}>
          You can get the dictionaries that we used at:
          {"\n"}
          <Text
            style={styles.boldText}
            onPress={() =>
              Linking.openURL("https://github.com/bihoqo/circassian-dictionaries-collection")
            }
          >
            https://github.com/bihoqo/circassian-dictionaries-collection
          </Text>
        </Text>
        <Text selectable={true} style={styles.footerText}>
          Visit our website at:
          {"\n"}
          <Text
            style={styles.boldText}
            onPress={() =>
              Linking.openURL("https://github.com/bihoqo/circassian-dictionaries-collection")
            }
          >
            https://www.learncircassian.com
          </Text>
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  title: {
    marginBottom: 16,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
  },
  subTitleContainer: {
    marginBottom: 16,
    alignItems: "center",
  },
  subTitle: {
    fontSize: 14,
  },
  dictContainer: {
    width: "100%",
  },
  dictBox: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  dictTitle: {
    marginBottom: 8,
    fontSize: 18,
    fontWeight: "bold",
  },
  dictText: {
    marginBottom: 8,
    fontSize: 14,
  },
  boldText: {
    fontWeight: "bold",
  },
  footer: {
    marginTop: 16,
    alignItems: "center",
  },
  footerText: {
    textAlign: "center",
    fontSize: 16,
    marginVertical: 8,
  },
});
