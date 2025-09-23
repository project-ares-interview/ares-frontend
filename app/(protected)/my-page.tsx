import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, TextInput, Dimensions, Platform } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import CareerSection from "@/components/profile/CareerSection";
import DisabilitySection from "@/components/profile/DisabilitySection";
import EducationSection from "@/components/profile/EducationSection";
import JobInterestSection from "@/components/profile/JobInterestSection";
import MilitaryServiceSection from "@/components/profile/MilitaryServiceSection";
import PatriotSection from "@/components/profile/PatriotSection";
import { useTranslation } from 'react-i18next';
import { useProfileStore } from '@/stores/profileStore';
import { useAuthStore } from '@/stores/authStore'; // Import useAuthStore

const { width } = Dimensions.get('window');

// Helper function to get score color
const getScoreColor = (score: number) => {
  if (score >= 8.5) return styles.textGreen600;
  if (score >= 7.0) return styles.textYellow600;
  return styles.textRed600;
};

// Helper function to get score background color
const getScoreBgColor = (score: number) => {
  if (score >= 8.5) return styles.bgGreen50BorderGreen200;
  if (score >= 7.0) return styles.bgYellow50BorderYellow200;
  return styles.bgRed50BorderRed200;
};

// Personal Information Section Component
const PersonalInformationSection = () => {
  const { t } = useTranslation();
  const { loading } = useProfileStore();

  if (loading) {
    return <Text style={styles.loadingText}>개인 정보를 불러오는 중...</Text>;
  }

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{t("profile.personal_info.title")}</Text>
      <View style={styles.sectionsContainer}>
        <MilitaryServiceSection />
        <PatriotSection />
        <DisabilitySection />
        <EducationSection />
        <CareerSection />
        <JobInterestSection />
      </View>
    </View>
  );
};


export default function MyPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');
  const fetchAllProfileData = useProfileStore((state) => state.fetchAllProfileData);
  const { user } = useAuthStore(); // Get user from auth store

  useEffect(() => {
    fetchAllProfileData();
  }, [fetchAllProfileData]);

  // Mock user data (will be replaced by actual user data)
  const mockUser = {
    name: user?.name || 'Guest',
    email: user?.email || 'guest@example.com',
    joinDate: '2024.12.15',
    interviewCount: 47,
    averageScore: 58.2,
    totalTime: 142, // minutes
    streak: 12, // days
    level: 'Gold',
    nextLevelProgress: 75
  };

  const mockStats = {
    weeklyProgress: [
      { day: '월', sessions: 3 },
      { day: '화', sessions: 2 },
      { day: '수', sessions: 4 },
      { day: '목', sessions: 1 },
      { day: '금', sessions: 3 },
      { day: '토', sessions: 2 },
      { day: '일', sessions: 1 }
    ],
    recentSessions: [
      { id: 1, type: '기술 면접', score: 8.5, date: '2025.01.18', duration: 25 },
      { id: 2, type: '인성 면접', score: 7.8, date: '2025.01.17', duration: 30 },
      { id: 3, type: '압박 면접', score: 9.1, date: '2025.01.16', duration: 20 },
      { id: 4, type: '영어 면접', score: 7.2, date: '2025.01.15', duration: 35 }
    ],
    achievements: [
      { id: 1, title: '연속 학습자', description: '12일 연속 연습', icon: '🔥', earned: true },
      { id: 2, title: '면접 달인', description: '50회 연습 완료', icon: '🎯', earned: false, progress: 94 },
      { id: 3, title: '완벽주의자', description: '평점 9.0 이상 달성', icon: '⭐', earned: true },
      { id: 4, title: '시간 관리자', description: '100시간 연습 완료', icon: '⏰', earned: true }
    ]
  };

  return (
    <View style={styles.container}>
      {/* Main Content */}
      <ScrollView style={styles.mainContent}>
        {/* Page Title */}
        <View style={styles.pageTitleContainer}>
          <Text style={styles.pageTitle}>{t("pages.dashboard.title")}</Text>
          <Text style={styles.pageSubtitle}>{t("pages.dashboard.subtitle", { name: mockUser.name })}</Text>
        </View>

        <View style={styles.gridContainer}>
          {/* Sidebar */}
          <View style={styles.sidebar}>
            <View style={styles.sidebarCard}>
              {/* Profile Section */}
              <View style={styles.profileSection}>
                <View style={styles.profileAvatar}>
                  <Feather name="user" size={40} color="#2563eb" />
                </View>
                <Text style={styles.profileName}>{mockUser.name}</Text>
                <Text style={styles.profileEmail}>{mockUser.email}</Text>
                <View style={styles.profileLevelContainer}>
                  <Text style={styles.profileLevel}>{mockUser.level}</Text>
                </View>
              </View>

              {/* Level Progress */}
              <View style={styles.levelProgressContainer}>
                <View style={styles.levelProgressTextContainer}>
                  <Text style={styles.levelProgressLabel}>{t("pages.dashboard.next_level")}</Text>
                  <Text style={styles.levelProgressValue}>{mockUser.nextLevelProgress}%</Text>
                </View>
                <View style={styles.progressBarBackground}>
                  <View 
                    style={[styles.progressBarFill, { width: `${mockUser.nextLevelProgress}%` }]}
                  ></View>
                </View>
              </View>

              {/* Navigation Menu */}
              <View style={styles.navigationMenu}>
                <TouchableOpacity
                  onPress={() => setActiveTab('overview')}
                  style={[styles.navButton, activeTab === 'overview' && styles.navButtonActive]}
                >
                  <Feather name="bar-chart-2" size={20} color={activeTab === 'overview' ? '#2563eb' : '#4b5563'} />
                  <Text style={[styles.navButtonText, activeTab === 'overview' && styles.navButtonTextActive]}>{t("pages.dashboard.overview")}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setActiveTab('personalInfo')} // New tab for personal info
                  style={[styles.navButton, activeTab === 'personalInfo' && styles.navButtonActive]}
                >
                  <Feather name="info" size={20} color={activeTab === 'personalInfo' ? '#2563eb' : '#4b5563'} />
                  <Text style={[styles.navButtonText, activeTab === 'personalInfo' && styles.navButtonTextActive]}>{t("profile.personal_info.title")}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setActiveTab('progress')}
                  style={[styles.navButton, activeTab === 'progress' && styles.navButtonActive]}
                >
                  <Feather name="trending-up" size={20} color={activeTab === 'progress' ? '#2563eb' : '#4b5563'} />
                  <Text style={[styles.navButtonText, activeTab === 'progress' && styles.navButtonTextActive]}>{t("pages.dashboard.learning_progress")}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setActiveTab('achievements')}
                  style={[styles.navButton, activeTab === 'achievements' && styles.navButtonActive]}
                >
                  <Feather name="award" size={20} color={activeTab === 'achievements' ? '#2563eb' : '#4b5563'} />
                  <Text style={[styles.navButtonText, activeTab === 'achievements' && styles.navButtonTextActive]}>{t("pages.dashboard.achievements")}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setActiveTab('settings')}
                  style={[styles.navButton, activeTab === 'settings' && styles.navButtonActive]}
                >
                  <Feather name="settings" size={20} color={activeTab === 'settings' ? '#2563eb' : '#4b5563'} />
                  <Text style={[styles.navButtonText, activeTab === 'settings' && styles.navButtonTextActive]}>{t("pages.dashboard.settings")}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Main Content Area */}
          <View style={styles.mainContentArea}>
            {activeTab === 'overview' && (
              <View style={styles.tabContent}>
                {/* Key Stats Cards */}
                <View style={styles.statsCardsContainer}>
                  <View style={styles.statCard}>
                    <View style={styles.statCardHeader}>
                      <Text style={styles.statCardLabel}>{t("pages.dashboard.total_practice_count")}</Text>
                      <Text style={styles.statCardValue}>{mockUser.interviewCount}</Text>
                    </View>
                    <View style={styles.statCardIconBlue}>
                      <Feather name="book-open" size={24} color="#2563eb" />
                    </View>
                  </View>

                  <View style={styles.statCard}>
                    <View style={styles.statCardHeader}>
                      <Text style={styles.statCardLabel}>{t("pages.dashboard.average_score")}</Text>
                      <Text style={styles.statCardValue}>{mockUser.averageScore}</Text>
                    </View>
                    <View style={styles.statCardIconGreen}>
                      <Feather name="star" size={24} color="#16a34a" />
                    </View>
                  </View>

                  <View style={styles.statCard}>
                    <View style={styles.statCardHeader}>
                      <Text style={styles.statCardLabel}>{t("pages.dashboard.consecutive_learning")}</Text>
                      <Text style={styles.statCardValue}>{mockUser.streak}{t("common.day")}</Text>
                    </View>
                    <View style={styles.statCardIconOrange}>
                      <Feather name="target" size={24} color="#ea580c" />
                    </View>
                  </View>

                  <View style={styles.statCard}>
                    <View style={styles.statCardHeader}>
                      <Text style={styles.statCardLabel}>{t("pages.dashboard.total_learning_time")}</Text>
                      <Text style={styles.statCardValue}>{Math.floor(mockUser.totalTime / 60)}h {mockUser.totalTime % 60}m</Text>
                    </View>
                    <View style={styles.statCardIconPurple}>
                      <Feather name="clock" size={24} color="#7c3aed" />
                    </View>
                  </View>
                </View>

                {/* Weekly Activity Chart */}
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>{t("pages.dashboard.weekly_activity")}</Text>
                  <View style={styles.weeklyActivityChart}>
                    {mockStats.weeklyProgress.map((day, index) => (
                      <View key={index} style={styles.weeklyActivityBarContainer}>
                        <View style={[styles.weeklyActivityBarBackground, { height: 120 }]}>
                          <View 
                            style={[styles.weeklyActivityBarFill, { height: `${(day.sessions / 4) * 100}%` }]}
                          ></View>
                        </View>
                        <Text style={styles.weeklyActivityDay}>{day.day}</Text>
                        <Text style={styles.weeklyActivitySessions}>{day.sessions}{t("common.count")}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Recent Practice Records */}
                <View style={styles.card}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>{t("pages.dashboard.recent_practice_records")}</Text>
                    <TouchableOpacity>
                      <Text style={styles.linkText}>{t("common.view_all")}</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.recentSessionsContainer}>
                    {mockStats.recentSessions.map((session) => (
                      <View 
                        key={session.id} 
                        style={[styles.sessionCard, getScoreBgColor(session.score)]}
                      >
                        <View style={styles.sessionCardContent}>
                          <View style={styles.sessionCardDetails}>
                            <Text style={styles.sessionType}>{session.type}</Text>
                            <Text style={[styles.sessionScore, getScoreColor(session.score)]}>
                              {session.score}
                            </Text>
                          </View>
                          <View style={styles.sessionMeta}>
                            <View style={styles.sessionMetaItem}>
                              <Feather name="calendar" size={16} color="#4b5563" />
                              <Text style={styles.sessionMetaText}>{session.date}</Text>
                            </View>
                            <View style={styles.sessionMetaItem}>
                              <Feather name="clock" size={16} color="#4b5563" />
                              <Text style={styles.sessionMetaText}>{session.duration}{t("common.minute")}</Text>
                            </View>
                          </View>
                        </View>
                        <TouchableOpacity>
                          <Feather name="edit-3" size={20} color="#2563eb" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            )}

            {activeTab === 'personalInfo' && (
              <View style={styles.tabContent}>
                <PersonalInformationSection />
              </View>
            )}

            {activeTab === 'progress' && (
              <View style={styles.tabContent}>
                {/* Monthly Learning Progress Chart */}
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>{t("pages.dashboard.monthly_learning_progress")}</Text>
                  <View style={styles.monthlyChartContainer}>
                    <View style={styles.monthlyChartYAxis}>
                      <Text style={styles.monthlyChartYAxisLabel}>100%</Text>
                      <Text style={styles.monthlyChartYAxisLabel}>75%</Text>
                      <Text style={styles.monthlyChartYAxisLabel}>50%</Text>
                      <Text style={styles.monthlyChartYAxisLabel}>25%</Text>
                      <Text style={styles.monthlyChartYAxisLabel}>0%</Text>
                    </View>
                    <View style={styles.monthlyChartBarsContainer}>
                      {[
                        { month: '9월', tech: 45, personality: 30, english: 20 },
                        { month: '10월', tech: 60, personality: 45, english: 35 },
                        { month: '11월', tech: 75, personality: 58, english: 42 },
                        { month: '12월', tech: 85, personality: 72, english: 56 }
                      ].map((data, index) => (
                        <View key={index} style={styles.monthlyChartBarGroup}>
                          <View style={styles.monthlyChartBarWrapper}>
                            <View 
                              style={[styles.monthlyChartBarBlue, { height: `${(data.tech / 100) * 150}px` }]} // Max height 150 for 200px container
                            ></View>
                            <View 
                              style={[styles.monthlyChartBarGreen, { height: `${(data.personality / 100) * 150}px` }]}
                            ></View>
                            <View 
                              style={[styles.monthlyChartBarYellow, { height: `${(data.english / 100) * 150}px` }]}
                            ></View>
                          </View>
                          <Text style={styles.monthlyChartMonth}>{data.month}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                  <View style={styles.monthlyChartLegend}>
                    <View style={styles.monthlyChartLegendItem}>
                      <View style={styles.monthlyChartLegendColorBlue}></View>
                      <Text style={styles.monthlyChartLegendText}>{t("pages.dashboard.tech_interview")}</Text>
                    </View>
                    <View style={styles.monthlyChartLegendItem}>
                      <View style={styles.monthlyChartLegendColorGreen}></View>
                      <Text style={styles.monthlyChartLegendText}>{t("pages.dashboard.personality_interview")}</Text>
                    </View>
                    <View style={styles.monthlyChartLegendItem}>
                      <View style={styles.monthlyChartLegendColorYellow}></View>
                      <Text style={styles.monthlyChartLegendText}>{t("pages.dashboard.english_interview")}</Text>
                    </View>
                  </View>
                </View>

                {/* Current Progress */}
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>{t("pages.dashboard.current_progress")}</Text>
                  <View style={styles.progressItemsContainer}>
                    <View style={styles.progressItem}>
                      <View style={styles.progressItemHeader}>
                        <View style={styles.progressItemIconBlue}>
                          <Feather name="activity" size={20} color="#2563eb" />
                        </View>
                        <Text style={styles.progressItemTitle}>{t("pages.dashboard.tech_interview")}</Text>
                        <View style={styles.progressItemValueContainer}>
                          <Text style={styles.progressItemValueBlue}>85%</Text>
                          <Text style={styles.progressItemSubValue}>47/55 {t("common.completed")}</Text>
                        </View>
                      </View>
                      <View style={styles.progressBarBackground}>
                        <View style={[styles.progressBarFillBlue, { width: '85%' }]}></View>
                      </View>
                      <Text style={styles.progressItemDescription}>
                        <Text style={styles.textGreen600}>{t("common.strength")}:</Text> {t("pages.dashboard.tech_strength")} · 
                        <Text style={styles.textRed600}>{t("common.weakness")}:</Text> {t("pages.dashboard.tech_weakness")}
                      </Text>
                    </View>

                    <View style={styles.progressItem}>
                      <View style={styles.progressItemHeader}>
                        <View style={styles.progressItemIconGreen}>
                          <Feather name="user" size={20} color="#16a34a" />
                        </View>
                        <Text style={styles.progressItemTitle}>{t("pages.dashboard.personality_interview")}</Text>
                        <View style={styles.progressItemValueContainer}>
                          <Text style={styles.progressItemValueGreen}>72%</Text>
                          <Text style={styles.progressItemSubValue}>36/50 {t("common.completed")}</Text>
                        </View>
                      </View>
                      <View style={styles.progressBarBackground}>
                        <View style={[styles.progressBarFillGreen, { width: '72%' }]}></View>
                      </View>
                      <Text style={styles.progressItemDescription}>
                        <Text style={styles.textGreen600}>{t("common.strength")}:</Text> {t("pages.dashboard.personality_strength")} · 
                        <Text style={styles.textRed600}>{t("common.weakness")}:</Text> {t("pages.dashboard.personality_weakness")}
                      </Text>
                    </View>

                    <View style={styles.progressItem}>
                      <View style={styles.progressItemHeader}>
                        <View style={styles.progressItemIconYellow}>
                          <Feather name="book-open" size={20} color="#d97706" />
                        </View>
                        <Text style={styles.progressItemTitle}>{t("pages.dashboard.english_interview")}</Text>
                        <View style={styles.progressItemValueContainer}>
                          <Text style={styles.progressItemValueYellow}>56%</Text>
                          <Text style={styles.progressItemSubValue}>28/50 {t("common.completed")}</Text>
                        </View>
                      </View>
                      <View style={styles.progressBarBackground}>
                        <View style={[styles.progressBarFillYellow, { width: '56%' }]}></View>
                      </View>
                      <Text style={styles.progressItemDescription}>
                        <Text style={styles.textGreen600}>{t("common.strength")}:</Text> {t("pages.dashboard.english_strength")} · 
                        <Text style={styles.textRed600}>{t("common.weakness")}:</Text> {t("pages.dashboard.english_weakness")}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Detailed Analysis */}
                <View style={styles.detailedAnalysisContainer}>
                  {/* Learning Pattern Analysis */}
                  <View style={styles.cardHalf}>
                    <Text style={styles.cardTitle}>{t("pages.dashboard.learning_pattern_analysis")}</Text>
                    <View style={styles.analysisItemContainer}>
                      <View style={styles.analysisItem}>
                        <Text style={styles.analysisLabel}>{t("pages.dashboard.optimal_learning_time")}</Text>
                        <Text style={styles.analysisValue}>{t("pages.dashboard.optimal_learning_time_value")}</Text>
                      </View>
                      <View style={styles.analysisItem}>
                        <Text style={styles.analysisLabel}>{t("pages.dashboard.average_concentration_time")}</Text>
                        <Text style={styles.analysisValue}>{t("pages.dashboard.average_concentration_time_value")}</Text>
                      </View>
                      <View style={styles.analysisItem}>
                        <Text style={styles.analysisLabel}>{t("pages.dashboard.preferred_difficulty")}</Text>
                        <Text style={styles.analysisValue}>{t("pages.dashboard.preferred_difficulty_value")}</Text>
                      </View>
                      <View style={styles.analysisItem}>
                        <Text style={styles.analysisLabel}>{t("pages.dashboard.retry_rate")}</Text>
                        <Text style={styles.analysisValue}>{t("pages.dashboard.retry_rate_value")}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Improvement Suggestions */}
                  <View style={styles.cardHalf}>
                    <Text style={styles.cardTitle}>{t("pages.dashboard.improvement_suggestions")}</Text>
                    <View style={styles.suggestionsContainer}>
                      <View style={styles.suggestionItem}>
                        <View style={styles.suggestionIconRed}>
                          <Text style={styles.suggestionIconText}>1</Text>
                        </View>
                        <View>
                          <Text style={styles.suggestionTitle}>{t("pages.dashboard.suggestion1_title")}</Text>
                          <Text style={styles.suggestionDescription}>{t("pages.dashboard.suggestion1_description")}</Text>
                        </View>
                      </View>
                      <View style={styles.suggestionItem}>
                        <View style={styles.suggestionIconYellow}>
                          <Text style={styles.suggestionIconText}>2</Text>
                        </View>
                        <View>
                          <Text style={styles.suggestionTitle}>{t("pages.dashboard.suggestion2_title")}</Text>
                          <Text style={styles.suggestionDescription}>{t("pages.dashboard.suggestion2_description")}</Text>
                        </View>
                      </View>
                      <View style={styles.suggestionItem}>
                        <View style={styles.suggestionIconBlue}>
                          <Text style={styles.suggestionIconText}>3</Text>
                        </View>
                        <View>
                          <Text style={styles.suggestionTitle}>{t("pages.dashboard.suggestion3_title")}</Text>
                          <Text style={styles.suggestionDescription}>{t("pages.dashboard.suggestion3_description")}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Weekly Goals */}
                <View style={styles.weeklyGoalsCard}>
                  <View style={styles.weeklyGoalsHeader}>
                    <Feather name="target" size={24} color="#2563eb" />
                    <Text style={styles.cardTitle}>{t("pages.dashboard.this_week_goals")}</Text>
                  </View>
                  <View style={styles.weeklyGoalsGrid}>
                    <View style={styles.weeklyGoalItem}>
                      <Text style={styles.weeklyGoalLabel}>{t("pages.dashboard.english_interview")}</Text>
                      <Text style={styles.weeklyGoalValue}>5{t("common.count")} {t("common.practice")}</Text>
                      <Text style={styles.weeklyGoalProgress}>{t("common.current")} 2/5 {t("common.completed")}</Text>
                    </View>
                    <View style={styles.weeklyGoalItem}>
                      <Text style={styles.weeklyGoalLabel}>{t("pages.dashboard.system_design")}</Text>
                      <Text style={styles.weeklyGoalValue}>3{t("common.count")} {t("common.practice")}</Text>
                      <Text style={styles.weeklyGoalProgress}>{t("common.current")} 1/3 {t("common.completed")}</Text>
                    </View>
                    <View style={styles.weeklyGoalItem}>
                      <Text style={styles.weeklyGoalLabel}>{t("pages.dashboard.leadership_questions")}</Text>
                      <Text style={styles.weeklyGoalValue}>{t("pages.dashboard.answer_completion")}</Text>
                      <Text style={styles.weeklyGoalProgress}>{t("common.in_progress")}</Text>
                    </View>
                  </View>
                </View>
              </View>
            )}

            {activeTab === 'achievements' && (
              <View style={styles.tabContent}>
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>{t("pages.dashboard.achievement_list")}</Text>
                  <View style={styles.achievementsGrid}>
                    {mockStats.achievements.map((achievement) => (
                      <View 
                        key={achievement.id}
                        style={[styles.achievementCard, achievement.earned ? styles.achievementCardEarned : styles.achievementCardPending]}
                      >
                        <View style={styles.achievementCardContent}>
                          <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                          <View style={styles.achievementDetails}>
                            <Text style={styles.achievementTitle}>{achievement.title}</Text>
                            <Text style={styles.achievementDescription}>{achievement.description}</Text>
                            {!achievement.earned && achievement.progress && (
                              <View style={styles.achievementProgressContainer}>
                                <View style={styles.achievementProgressTextContainer}>
                                  <Text style={styles.achievementProgressLabel}>{t("common.progress_rate")}</Text>
                                  <Text style={styles.achievementProgressValue}>{achievement.progress}%</Text>
                                </View>
                                <View style={styles.progressBarBackgroundSmall}>
                                  <View 
                                    style={[styles.progressBarFillBlue, { width: `${achievement.progress}%` }]}
                                  ></View>
                                </View>
                              </View>
                            )}
                          </View>
                          {achievement.earned && (
                            <Feather name="check-circle" size={24} color="#16a34a" />
                          )}
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            )}

            {activeTab === 'settings' && (
              <View style={styles.tabContent}>
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>{t("pages.dashboard.account_settings")}</Text>
                  <View style={styles.settingsContainer}>
                    <View>
                      <Text style={styles.settingsLabel}>{t("common.name")}</Text>
                      <TextInput 
                        value={mockUser.name}
                        style={styles.settingsInput}
                        editable={false}
                      />
                    </View>
                    <View>
                      <Text style={styles.settingsLabel}>{t("common.email")}</Text>
                      <TextInput 
                        value={mockUser.email}
                        style={styles.settingsInput}
                        editable={false}
                      />
                    </View>
                    <View style={styles.settingsLogoutContainer}>
                      <TouchableOpacity style={styles.logoutButton}>
                        <Feather name="log-out" size={20} color="#dc2626" />
                        <Text style={styles.logoutButtonText}>{t("common.logout")}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb', // bg-gray-50
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: Platform.OS === 'web' ? width * 0.1 : 16, // max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8
    paddingVertical: 32,
  },
  pageTitleContainer: {
    marginBottom: 32, // mb-8
  },
  pageTitle: {
    fontSize: 30, // text-3xl
    fontWeight: 'bold',
    color: '#111827', // text-gray-900
  },
  pageSubtitle: {
    color: '#4b5563', // text-gray-600
    marginTop: 8, // mt-2
  },
  gridContainer: {
    flexDirection: Platform.OS === 'web' && width > 1024 ? 'row' : 'column',
    gap: 32,
  },
  sidebar: {
    width: Platform.OS === 'web' && width > 1024 ? '25%' : '100%',
  },
  sidebarCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 24,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    backgroundColor: '#dbeafe',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 'auto',
    marginBottom: 16,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  profileEmail: {
    fontSize: 14,
    color: '#4b5563',
  },
  profileLevelContainer: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileLevel: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: '#fef3c7',
    color: '#b45309',
    fontSize: 14,
    fontWeight: '500',
    borderRadius: 9999,
  },
  levelProgressContainer: {
    marginBottom: 24,
  },
  levelProgressTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 8,
  },
  levelProgressLabel: {
    fontSize: 14,
    color: '#4b5563',
  },
  levelProgressValue: {
    fontSize: 14,
    color: '#4b5563',
  },
  progressBarBackground: {
    width: '100%',
    backgroundColor: '#e5e7eb',
    borderRadius: 9999,
    height: 8,
  },
  progressBarFill: {
    backgroundColor: '#2563eb',
    height: 8,
    borderRadius: 9999,
    transitionProperty: 'width',
    transitionDuration: 300,
  },
  navigationMenu: {
  },
  navButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    textAlign: 'left',
    transitionProperty: 'background-color, color',
    marginBottom: 8,
  },
  navButtonActive: {
    backgroundColor: '#eff6ff',
  },
  navButtonText: {
    marginLeft: 12,
    color: '#4b5563',
  },
  navButtonTextActive: {
    color: '#2563eb',
  },
  mainContentArea: {
    width: Platform.OS === 'web' && width > 1024 ? '75%' : '100%',
  },
  tabContent: {
  },
  statsCardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 24,
    width: Platform.OS === 'web' && width > 768 ? '48%' : '100%',
    marginBottom: 16,
  },
  statCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statCardLabel: {
    fontSize: 14,
    color: '#4b5563',
  },
  statCardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  statCardIconBlue: {
    width: 48,
    height: 48,
    backgroundColor: '#dbeafe',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statCardIconGreen: {
    width: 48,
    height: 48,
    backgroundColor: '#dcfce7',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statCardIconOrange: {
    width: 48,
    height: 48,
    backgroundColor: '#ffedd5',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statCardIconPurple: {
    width: 48,
    height: 48,
    backgroundColor: '#ede9fe',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 24,
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  linkText: {
    color: '#2563eb',
    fontSize: 14,
    fontWeight: '500',
  },
  weeklyActivityChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 160,
  },
  weeklyActivityBarContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  weeklyActivityBarBackground: {
    width: '100%',
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    justifyContent: 'flex-end',
  },
  weeklyActivityBarFill: {
    backgroundColor: '#3b82f6',
    borderRadius: 4,
    transitionProperty: 'height',
    transitionDuration: 300,
  },
  weeklyActivityDay: {
    marginTop: 8,
    fontSize: 14,
    color: '#4b5563',
  },
  weeklyActivitySessions: {
    fontSize: 12,
    color: '#6b7280',
  },
  recentSessionsContainer: {
  },
  sessionCard: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sessionCardContent: {
    flex: 1,
  },
  sessionCardDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sessionType: {
    fontWeight: '500',
    color: '#111827',
    marginRight: 12,
  },
  sessionScore: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sessionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    fontSize: 14,
    color: '#4b5563',
  },
  sessionMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  sessionMetaText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#4b5563',
  },
  textGreen600: {
    color: '#16a34a',
  },
  textYellow600: {
    color: '#d97706',
  },
  textRed600: {
    color: '#dc2626',
  },
  bgGreen50BorderGreen200: {
    backgroundColor: '#f0fdf4',
    borderColor: '#a7f3d0',
  },
  bgYellow50BorderYellow200: {
    backgroundColor: '#fffbeb',
    borderColor: '#fde68a',
  },
  bgRed50BorderRed200: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
  },
  monthlyChartContainer: {
    height: 256,
    position: 'relative',
    flexDirection: 'row',
    marginBottom: 16,
  },
  monthlyChartYAxis: {
    justifyContent: 'space-between',
    height: '100%',
    paddingRight: 8,
  },
  monthlyChartYAxisLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  monthlyChartBarsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginLeft: 8,
  },
  monthlyChartBarGroup: {
    flex: 1,
    alignItems: 'center',
  },
  monthlyChartBarWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
    height: '100%',
    alignItems: 'flex-end',
  },
  monthlyChartBarBlue: {
    backgroundColor: '#3b82f6',
    width: 24,
    borderRadius: 4,
    marginHorizontal: 2,
  },
  monthlyChartBarGreen: {
    backgroundColor: '#22c55e',
    width: 24,
    borderRadius: 4,
    marginHorizontal: 2,
  },
  monthlyChartBarYellow: {
    backgroundColor: '#f59e0b',
    width: 24,
    borderRadius: 4,
    marginHorizontal: 2,
  },
  monthlyChartMonth: {
    fontSize: 14,
    color: '#4b5563',
  },
  monthlyChartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  monthlyChartLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  monthlyChartLegendColorBlue: {
    width: 12,
    height: 12,
    backgroundColor: '#3b82f6',
    borderRadius: 2,
    marginRight: 8,
  },
  monthlyChartLegendColorGreen: {
    width: 12,
    height: 12,
    backgroundColor: '#22c55e',
    borderRadius: 2,
    marginRight: 8,
  },
  monthlyChartLegendColorYellow: {
    width: 12,
    height: 12,
    backgroundColor: '#f59e0b',
    borderRadius: 2,
    marginRight: 8,
  },
  monthlyChartLegendText: {
    fontSize: 14,
    color: '#4b5563',
  },
  progressItemsContainer: {
  },
  progressItem: {
    marginBottom: 24,
  },
  progressItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressItemIconBlue: {
    width: 32,
    height: 32,
    backgroundColor: '#dbeafe',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  progressItemIconGreen: {
    width: 32,
    height: 32,
    backgroundColor: '#dcfce7',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  progressItemIconYellow: {
    width: 32,
    height: 32,
    backgroundColor: '#ffedd5',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  progressItemTitle: {
    fontWeight: '500',
    color: '#111827',
    flex: 1,
  },
  progressItemValueContainer: {
    alignItems: 'flex-end',
  },
  progressItemValueBlue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  progressItemValueGreen: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#16a34a',
  },
  progressItemValueYellow: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#d97706',
  },
  progressItemSubValue: {
    fontSize: 12,
    color: '#6b7280',
  },
  progressBarFillBlue: {
    backgroundColor: '#2563eb',
    height: 12,
    borderRadius: 9999,
    transitionProperty: 'width',
    transitionDuration: 300,
  },
  progressBarFillGreen: {
    backgroundColor: '#16a34a',
    height: 12,
    borderRadius: 9999,
    transitionProperty: 'width',
    transitionDuration: 300,
  },
  progressBarFillYellow: {
    backgroundColor: '#d97706',
    height: 12,
    borderRadius: 9999,
    transitionProperty: 'width',
    transitionDuration: 300,
  },
  progressItemDescription: {
    marginTop: 8,
    fontSize: 14,
    color: '#4b5563',
  },
  detailedAnalysisContainer: {
    flexDirection: Platform.OS === 'web' && width > 768 ? 'row' : 'column',
    gap: 24,
    marginBottom: 24,
  },
  cardHalf: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 24,
    width: Platform.OS === 'web' && width > 768 ? '48%' : '100%',
  },
  analysisItemContainer: {
  },
  analysisItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  analysisLabel: {
    color: '#4b5563',
  },
  analysisValue: {
    fontWeight: '500',
    color: '#111827',
  },
  suggestionsContainer: {
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  suggestionIconRed: {
    width: 24,
    height: 24,
    backgroundColor: '#fee2e2',
    borderRadius: 9999,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    marginTop: 2,
    marginRight: 12,
  },
  suggestionIconYellow: {
    width: 24,
    height: 24,
    backgroundColor: '#fffbeb',
    borderRadius: 9999,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    marginTop: 2,
    marginRight: 12,
  },
  suggestionIconBlue: {
    width: 24,
    height: 24,
    backgroundColor: '#dbeafe',
    borderRadius: 9999,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    marginTop: 2,
    marginRight: 12,
  },
  suggestionIconText: {
    color: '#dc2626',
    fontSize: 12,
    fontWeight: 'bold',
  },
  suggestionTitle: {
    fontWeight: '500',
    color: '#111827',
  },
  suggestionDescription: {
    fontSize: 14,
    color: '#4b5563',
  },
  weeklyGoalsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bfdbfe',
    padding: 24,
    marginBottom: 24,
  },
  weeklyGoalsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  weeklyGoalsGrid: {
    flexDirection: Platform.OS === 'web' && width > 768 ? 'row' : 'column',
    gap: 16,
  },
  weeklyGoalItem: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#dbeafe',
    flex: 1,
  },
  weeklyGoalLabel: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 4,
  },
  weeklyGoalValue: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#2563eb',
  },
  weeklyGoalProgress: {
    fontSize: 12,
    color: '#6b7280',
  },
  achievementsGrid: {
    flexDirection: Platform.OS === 'web' && width > 768 ? 'row' : 'column',
    gap: 16,
  },
  achievementCard: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    flex: 1,
  },
  achievementCardEarned: {
    borderColor: '#a7f3d0',
    backgroundColor: '#f0fdf4',
  },
  achievementCardPending: {
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
  },
  achievementCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  achievementIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  achievementDetails: {
    flex: 1,
  },
  achievementTitle: {
    fontWeight: '500',
    color: '#111827',
  },
  achievementDescription: {
    fontSize: 14,
    color: '#4b5563',
  },
  achievementProgressContainer: {
    marginTop: 8,
  },
  achievementProgressTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  achievementProgressLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  achievementProgressValue: {
    fontSize: 12,
    color: '#6b7280',
  },
  progressBarBackgroundSmall: {
    width: '100%',
    backgroundColor: '#e5e7eb',
    borderRadius: 9999,
    height: 4,
  },
  settingsContainer: {
  },
  settingsLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  settingsInput: {
    width: '100%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    color: '#111827',
    backgroundColor: '#f9fafb',
  },
  settingsLogoutContainer: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderColor: '#e5e7eb',
    marginTop: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutButtonText: {
    marginLeft: 8,
    color: '#dc2626',
  },
  personalInfoContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 24,
    marginBottom: 24,
  },
  personalInfoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  personalInfoItem: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  personalInfoLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  personalInfoValue: {
    fontSize: 14,
    color: '#4b5563',
    marginLeft: 8,
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginVertical: 20,
  },
  sectionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 24 // Gap between sections
  }
});