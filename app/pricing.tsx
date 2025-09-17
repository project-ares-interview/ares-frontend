import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";

import { Button, Card, Text } from "@rneui/themed";

export default function Pricing() {
  const { t } = useTranslation();

  const pricingPlans = [
    {
      title: t("pages.pricing.basic.title"),
      price: t("pages.pricing.basic.price"),
      features: [
        t("pages.pricing.basic.features.feature1"),
        t("pages.pricing.basic.features.feature2"),
        t("pages.pricing.basic.features.feature3"),
      ],
      buttonText: t("pages.pricing.basic.buttonText"),
    },
    {
      title: t("pages.pricing.pro.title"),
      price: t("pages.pricing.pro.price"),
      features: [
        t("pages.pricing.pro.features.feature1"),
        t("pages.pricing.pro.features.feature2"),
        t("pages.pricing.pro.features.feature3"),
        t("pages.pricing.pro.features.feature4"),
      ],
      buttonText: t("pages.pricing.pro.buttonText"),
      isPopular: true,
    },
    {
      title: t("pages.pricing.enterprise.title"),
      price: t("pages.pricing.enterprise.price"),
      features: [
        t("pages.pricing.enterprise.features.feature1"),
        t("pages.pricing.enterprise.features.feature2"),
        t("pages.pricing.enterprise.features.feature3"),
        t("pages.pricing.enterprise.features.feature4"),
      ],
      buttonText: t("pages.pricing.enterprise.buttonText"),
    },
  ];

  return (
    <ScrollView style={styles.container}>
      
      <View style={styles.pricingContainer}>
        {pricingPlans.map((plan, index) => (
          <Card
            key={index}
            containerStyle={[
              styles.card,
              plan.isPopular ? styles.popularCard : {},
            ]}
            wrapperStyle={{ flex: 1, justifyContent: "space-between" }}
          >
            <View>
              <Card.Title style={styles.cardTitle}>{plan.title}</Card.Title>
              <Card.Divider />
              <Text style={styles.price}>{plan.price}</Text>
              <View style={styles.featuresContainer}>
                {plan.features.map((feature, i) => (
                  <Text key={i} style={styles.feature}>
                    - {feature}
                  </Text>
                ))}
              </View>
            </View>
            <Button title={plan.buttonText} buttonStyle={styles.button} />
          </Card>
        ))}
      </View>

      

      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainTitle: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 40,
    textAlign: 'center'
  },
  pricingContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "stretch",
    flexWrap: "wrap",
  },
  card: {
    width: 300,
    margin: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 20,
  },
  popularCard: {
    borderColor: "#4F86F7",
    borderWidth: 2,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  price: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  featuresContainer: {
    marginBottom: 20,
  },
  feature: {
    fontSize: 16,
    marginBottom: 10,
  },
  button: {
    borderRadius: 5,
    backgroundColor: "black",
  },
});