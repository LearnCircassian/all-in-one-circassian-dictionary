import React, { useState } from "react";
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from "react-native";
import { Feather } from "@expo/vector-icons"; // Importing the icons from @expo/vector-icons

interface HeaderSearchInputProps {
  inputValue: string;
  setInputValue: (value: string) => void;
}

const HeaderSearchInput = ({ inputValue, setInputValue }: HeaderSearchInputProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.iconContainer}>
          <Feather name="search" style={styles.icon} />
        </View>
        <TextInput
          style={styles.input}
          placeholder="Search..."
          value={inputValue}
          onChangeText={setInputValue}
        />
        {inputValue ? (
          <TouchableOpacity style={styles.clearIconContainer} onPress={() => setInputValue("")}>
            <Feather name="x" style={styles.clearIcon} />
          </TouchableOpacity>
        ) : null}
      </View>
      {inputValue && (
        <TouchableOpacity style={styles.cancelButton} onPress={() => setInputValue("")}>
          <Text selectable={true} style={styles.cancelButtonText}>
            Cancel
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#7dc727",
    borderRadius: 0,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 2,
    flex: 1,
    position: "relative",
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    width: 40,
    position: "absolute",
    left: 0,
    zIndex: 1,
  },
  icon: {
    fontSize: 20,
    color: "black",
  },
  input: {
    flex: 1,
    height: 40,
    borderRadius: 2,
    paddingLeft: 40, // Add padding to make space for the icon
    paddingRight: 40, // Add padding to make space for the clear icon
    fontSize: 16,
  },
  clearIconContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    width: 40,
    position: "absolute",
    right: 10,
    zIndex: 1,
  },
  clearIcon: {
    fontSize: 20,
    color: "black",
  },
  cancelButton: {
    marginLeft: 10,
  },
  cancelButtonText: {
    fontSize: 16,
    color: "white",
  },
});

export default HeaderSearchInput;
