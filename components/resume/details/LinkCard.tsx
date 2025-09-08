import { Link as LinkType } from "@/schemas/resume";
import React from "react";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";

interface LinkCardProps {
  link: LinkType;
  onEdit: () => void;
  onDelete: () => void;
}

const LinkCard: React.FC<LinkCardProps> = ({ link, onEdit, onDelete }) => {
  return (
    <View style={styles.card}>
      <Pressable
        style={styles.content}
        onPress={() => Linking.openURL(link.url)}
      >
        <Text style={styles.title}>{link.title}</Text>
        <Text style={styles.url}>{link.url}</Text>
      </Pressable>
      <View style={styles.actions}>
        <Pressable style={[styles.button, styles.editButton]} onPress={onEdit}>
          <Text style={styles.buttonText}>수정</Text>
        </Pressable>
        <Pressable
          style={[styles.button, styles.deleteButton]}
          onPress={onDelete}
        >
          <Text style={styles.buttonText}>삭제</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  url: {
    fontSize: 14,
    color: "#007bff",
  },
  actions: {
    flexDirection: "row",
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginLeft: 8,
  },
  editButton: {
    backgroundColor: "#007bff",
  },
  deleteButton: {
    backgroundColor: "#dc3545",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default LinkCard;
