import AwardSection from "@/components/resume/details/AwardSection";
import CareerSection from "@/components/resume/details/CareerSection";
import EducationSection from "@/components/resume/details/EducationSection";
import LanguageSection from "@/components/resume/details/LanguageSection";
import LinkSection from "@/components/resume/details/LinkSection";
import ResumeHeader from "@/components/resume/details/ResumeHeader";
import { useResumeStore } from "@/stores/resumeStore";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const ResumeDetailPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const resumeId = Number(id);

  const { selectedResume, isLoading, error, fetchFullResume } =
    useResumeStore();

  useEffect(() => {
    if (resumeId) {
      fetchFullResume(resumeId);
    }
  }, [resumeId, fetchFullResume]);

  if (isLoading || !selectedResume) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.outerContainer}>
      <View style={styles.mainContentContainer}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>
            {"<"} {t("resume.back_to_list")}
          </Text>
        </Pressable>

        <ResumeHeader resume={selectedResume} />

        <EducationSection
          resumeId={resumeId}
          educations={selectedResume.educations}
        />
        <CareerSection resumeId={resumeId} careers={selectedResume.careers} />

        <AwardSection resumeId={resumeId} awards={selectedResume.awards} />

        <LanguageSection
          resumeId={resumeId}
          languages={selectedResume.languages}
        />
        <LinkSection resumeId={resumeId} links={selectedResume.links} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  mainContentContainer: {
    width: "70%",
    maxWidth: 1280,
    alignSelf: "center",
    paddingVertical: 20,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  error: {
    color: "red",
    fontSize: 16,
  },
  backButton: {
    padding: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: "#4972c3ff",
    fontWeight: "bold",
  },
});

export default ResumeDetailPage;