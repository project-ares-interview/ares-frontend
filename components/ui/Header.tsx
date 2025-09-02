import React from "react";
import { Platform, useWindowDimensions } from "react-native";
import DesktopHeader from "./DesktopHeader";
import MobileHeader from "./MobileHeader";

interface HeaderProps {
  showNav?: boolean;
  showBackButton?: boolean;
}

export default function Header({
  showNav = true,
  showBackButton = false,
}: HeaderProps) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  if (Platform.OS !== "web") {
    return <MobileHeader showNav={showNav} showBackButton={showBackButton} />;
  }

  return isMobile ? (
    <MobileHeader showNav={showNav} showBackButton={showBackButton} />
  ) : (
    <DesktopHeader showNav={showNav} />
  );
}
