import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface FooterContainerProps {
  currentWord: string;
  leftWord: string;
  rightWord: string;
  onLeftClick: () => void;
  onRightClick: () => void;
}

export default function FooterContainer({
  currentWord,
  leftWord,
  rightWord,
  onLeftClick,
  onRightClick,
}: FooterContainerProps) {
  return (
    <View style={styles.footer}>
      <TouchableOpacity
        style={[styles.button, !leftWord && styles.disabled]}
        disabled={!leftWord}
        onPress={onLeftClick}
      >
        <MaterialIcons name="arrow-left" size={36} style={styles.icon} />
        <Text selectable={true} style={styles.text}>
          {leftWord}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.disabled]} disabled={true} onPress={() => {}}>
        <MaterialIcons name="arrow-drop-down" size={36} style={[styles.icon]} />
        <Text selectable={true} style={styles.text}>
          {currentWord}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, !rightWord && styles.disabled]}
        disabled={!rightWord}
        onPress={onRightClick}
      >
        <MaterialIcons name="arrow-right" size={36} style={styles.icon} />
        <Text selectable={true} style={styles.text}>
          {rightWord}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#292929",
    paddingBottom: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  button: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: {
    opacity: 0.3,
  },
  icon: {
    padding: 0,
    color: "white",
  },
  text: {
    fontSize: 16,
    color: "white",
  },
});
