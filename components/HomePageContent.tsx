import React from "react";
import {View, Text, ScrollView, StyleSheet, Linking} from "react-native";
import {USED_DICTS} from "~/constants/dicts";
import {RANDOM_COLORS} from "~/constants/colors";
import {Image} from "expo-image";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Constants from 'expo-constants';

export default function HomePageContent() {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.headerText}>
                All in One Circassian Dictionaries
            </Text>
            <Image
                source={require("../assets/images/fav/icon-1042x1042.png")}
                style={{width: 200, height: 200}}
            />
            <Text style={styles.introductionText}>
                Welcome to our Circassian language dictionary collection! Access over 30 dictionaries translating Circassian to and from Russian, English, Arabic, and Turkish.
                {"\n"}
                {"\n"}
                Our collection covers both Western and Eastern Circassian, offering valuable resources for language enthusiasts, students, and scholars.
                {"\n"}
                {"\n"}
                Explore the richness of the Circassian language and its cultural heritage with us.
            </Text>

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
                    <View key={index} style={styles.dictRow}>
                        <FontAwesome5 name="book" style={{color: RANDOM_COLORS[index], fontSize: 75}}/>
                        <View key={index} style={styles.dictBox}>
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
                <Text selectable={true} style={styles.footerText}>
                    App Version: <Text style={styles.boldText}>v{Constants.expoConfig?.version}</Text>
                </Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingHorizontal: 8,
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
    dictRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        borderRadius: 8,
        marginBottom: 0,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 4,
        shadowOffset: {width: 0, height: 2},
    },
    dictBox: {
        marginLeft: 4,
        flex: 1,
        borderRadius: 8,
    },
    dictTitle: {
        marginBottom: 2,
        fontSize: 14,
        fontWeight: "bold",
    },
    dictText: {
        marginBottom: 2,
        fontSize: 10,
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
    introductionText: {
        fontSize: 14,
        marginBottom: 16,
        textAlign: "center",
    },
    headerText: {
        fontSize: 24,
        marginBottom: 16,
        textAlign: "center",
        fontWeight: "bold",
    }
});

