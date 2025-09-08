import { Award } from "@/schemas/resume";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface AwardCardProps {
  award: Award;
  onEdit: () => void;
  onDelete: () => void;
}

const AwardCard: React.FC<AwardCardProps> = ({ award, onEdit, onDelete }) => {
  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <Text style={styles.title}>{award.title}</Text>
        <Text style={styles.issuer}>{award.issuer}</Text>
        <Text style={styles.date}>
          {new Date(award.date_awarded).toLocaleDateString()}
        </Text>
      </View>
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
  },
  content: {
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  issuer: {
    fontSize: 14,
    color: "#555",
    marginVertical: 4,
  },
  date: {
    fontSize: 12,
    color: "#888",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    borderTopWidth: 1,
    borderColor: "#eee",
    paddingTop: 8,
    marginTop: 8,
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

export default AwardCard;
