import CareerSection from "@/components/profile/CareerSection";
import DisabilitySection from "@/components/profile/DisabilitySection";
import EducationSection from "@/components/profile/EducationSection";
import JobInterestSection from "@/components/profile/JobInterestSection";
import MilitaryServiceSection from "@/components/profile/MilitaryServiceSection";
import PatriotSection from "@/components/profile/PatriotSection";
import { useProfileStore } from "@/stores/profileStore";
import { useEffect } from "react";
import { ScrollView, Text, View } from "react-native";

export default function MyPage() {
  const fetchAllProfileData = useProfileStore(
    (state) => state.fetchAllProfileData,
  );

  useEffect(() => {
    fetchAllProfileData();
  }, [fetchAllProfileData]);

  return (
    <ScrollView>
      <View style={{ flex: 1, padding: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>
          My Page
        </Text>
        <MilitaryServiceSection />
        <PatriotSection />
        <DisabilitySection />
        <EducationSection />
        <CareerSection />
        <JobInterestSection />
      </View>
    </ScrollView>
  );
}
