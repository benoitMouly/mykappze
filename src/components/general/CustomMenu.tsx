// CustomMenu.tsx
import React from 'react';
import { View, Text, Button } from 'react-native';

interface CustomMenuProps {
  closeDrawer: () => void;
  navigation: any;
}

const CustomMenu: React.FC<CustomMenuProps> = ({ closeDrawer, navigation }) => {
  const handleNavigation = (routeName: string) => {
    navigation.navigate(routeName);
    closeDrawer();
  };

  return (
    <View>
      <Text>Menu</Text>
      <Button title="Home" onPress={() => handleNavigation('Home')} />
      <Button title="Profile" onPress={() => handleNavigation('Profile')} />
      <Button title="Settings" onPress={() => handleNavigation('Settings')} />
    </View>
  );
}

export default CustomMenu;
