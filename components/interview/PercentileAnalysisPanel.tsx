import React, { useState } from "react";
import {
  ActivityIndicator,
  Button,
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LineChart } from "react-native-chart-kit";

const filterOptions: {
  [key: string]: {
    name: string;
    options: string[];
  };
} = {
  gender: { name: "성별", options: ["MALE", "FEMALE"] },
  ageRange: { name: "연령대", options: ["-34", "35-44", "45-54", "55-"] },
  occupation: {
    name: "직군",
    options: ["ARD", "BM", "PS", "ICT", "RND", "MM", "SM"],
  },
};

const filterLabels: { [key: string]: { [key: string]: string } } = {
  gender: {
    MALE: "남성",
    FEMALE: "여성",
  },
  ageRange: {
    "-34": "34세 이하",
    "35-44": "35~44세",
    "45-54": "45~54세",
    "55-": "55세 이상",
  },
  occupation: {
    ARD: "예술, 디자인",
    BM: "경영, 비지니스",
    PS: "공공기관",
    ICT: "ICT",
    RND: "연구개발",
    MM: "마케팅",
    SM: "영업",
  },
};

const scoreNames: { [key: string]: string } = {
  confidence_score: "자신감",
  fluency_score: "유창성",
  stability_score: "안정성",
  clarity_score: "명료성",
  overall_score: "종합",
};

// Helper to generate Gaussian PDF for the chart
const pdf = (x: number, mean: number, std: number) => {
  if (std === 0) return x === mean ? 1 : 0;
  const variance = std * std;
  return (
    (1 / Math.sqrt(2 * Math.PI * variance)) *
    Math.exp(-0.5 * ((x - mean) ** 2) / variance)
  );
};

type Props = {
  percentileData: any | null;
  isLoading: boolean;
  onUpdateAnalysis: (filters: any) => void;
};

export const PercentileAnalysisPanel = ({
  percentileData,
  isLoading,
  onUpdateAnalysis,
}: Props) => {
  const [filters, setFilters] = useState<{ [key: string]: string[] }>({});

  const handleFilterToggle = (key: string, option: string) => {
    setFilters((prev) => {
      const current = prev[key] || [];
      const newFilters = { ...prev };
      if (current.includes(option)) {
        newFilters[key] = current.filter((item) => item !== option);
      } else {
        newFilters[key] = [...current, option];
      }
      return newFilters;
    });
  };

  const renderChart = (scoreKey: string) => {
    const data = percentileData[scoreKey];
    if (!data || data.std === 0) {
        return (
            <View key={scoreKey} style={styles.chartContainer}>
                <Text style={styles.chartTitle}>{scoreNames[scoreKey]}</Text>
                <Text style={styles.errorText}>점수 분포를 계산할 수 없습니다.</Text>
            </View>
        )
    };

    console.log(`[Chart Data for ${scoreKey}]`, data);

    const { mean, std, user_score, percentile } = data;
    const labels = Array.from({ length: 101 }, (_, i) => i);
    const curveData = labels.map((x) => pdf(x, mean, std));

    console.log(`[Generated Curve Data for ${scoreKey}]`, curveData.slice(0, 10)); // Log first 10 values

    const chartWidth = Platform.select({ web: 450, default: Dimensions.get("window").width - 48 });
    const chartDrawableWidth = chartWidth - 80; // Adjusted for more padding for Y-axis labels
    const userScoreX = 40 + (user_score / 100) * chartDrawableWidth; // Position calculation

    return (
      <View key={scoreKey} style={styles.chartContainer}>
        <Text style={styles.chartTitle}>
          {scoreNames[scoreKey]} ({user_score.toFixed(1)}점)
        </Text>
        <View style={{ position: "relative" }}>
          <LineChart
            data={{
              labels: ["0", "25", "50", "75", "100"],
              datasets: [{ data: curveData, strokeWidth: 1.5 }],
            }}
            width={chartWidth}
            height={220}
            withInnerLines={false}
            withOuterLines={false}
            withShadow={true}
            fromZero
            chartConfig={{
              backgroundColor: "#FFFFFF",
              backgroundGradientFrom: "#FFFFFF",
              backgroundGradientTo: "#FFFFFF",
              decimalPlaces: 2,
              color: (opacity = 1) => `rgba(44, 82, 130, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(45, 55, 72, ${opacity})`,
              propsForDots: { r: "0" }, // Hide default dots
              propsForBackgroundLines: {
                  strokeDasharray: "", // solid background lines with no dashes
              },
            }}
            bezier
            style={styles.chart}
          />
          {/* Vertical Line Overlay */}
          <View
            style={{
              position: "absolute",
              left: userScoreX,
              top: 10, // Align with chart top
              height: 175, // Align with chart drawable height
              width: 1.5,
              backgroundColor: "#E53E3E",
              zIndex: 10, // Ensure it's on top
            }}
          />
          <View style={[styles.userScoreLabel, { left: userScoreX > chartDrawableWidth - 30 ? userScoreX - 60 : userScoreX + 5 }]}>
              <Text style={styles.userScoreLabelText}>상위 {percentile}%</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.panel}>
      <Text style={styles.title}>📊 점수 분포 분석</Text>
      
      {Object.keys(filterOptions).map((key) => (
        <View key={key} style={styles.filterGroup}>
          <Text style={styles.filterTitle}>{filterOptions[key].name}</Text>
          <View style={styles.filterOptionsContainer}>
            {filterOptions[key].options.map((option) => {
              const isSelected = filters[key]?.includes(option);
              return (
                <TouchableOpacity
                  key={option}
                  style={[styles.filterButton, isSelected && styles.filterButtonSelected]}
                  onPress={() => handleFilterToggle(key, option)}
                >
                  <Text style={[styles.filterButtonText, isSelected && styles.filterButtonTextSelected]}>
                    {filterLabels[key]?.[option] ?? option}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      ))}

      <View style={styles.buttonHalfWidth}>
        <Button title="그래프 생성하기" onPress={() => onUpdateAnalysis(filters)} />
      </View>

      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="#2c5282"
          style={{ marginVertical: 20 }}
        />
      ) : (
        <View style={styles.chartsGrid}>{percentileData && Object.keys(scoreNames).map(renderChart)}</View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  panel: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    marginTop: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  filterGroup: {
    marginBottom: 12,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  filterOptionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#cbd5e0",
    marginRight: 8,
    marginBottom: 8,
  },
  filterButtonSelected: {
    backgroundColor: "#2c5282",
    borderColor: "#2c5282",
  },
  filterButtonText: {
    color: "#2d3748",
  },
  filterButtonTextSelected: {
    color: "#ffffff",
  },
  chartsGrid: {
    marginTop: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  chartContainer: {
    marginBottom: 20,
    alignItems: "center",
    ...Platform.select({
      web: {
        width: "45%",
        marginHorizontal: 15, // Set margin to 15
      },
      default: {
        width: "45%",
        marginHorizontal: 15, // Set margin to 15
      },
    }),
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  errorText: {
    marginTop: 20,
    color: "#E53E3E",
    fontSize: 16,
  },
  userScoreLabel: {
    position: "absolute",
    top: -5,
    backgroundColor: "#E53E3E",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  userScoreLabelText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  buttonHalfWidth: {
    width: '50%',
    alignSelf: 'center',
    marginVertical: 10, // Add some vertical margin
  },});
