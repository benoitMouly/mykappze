// CustomMenu.tsx
import React from 'react';
import { View, Text, Button } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';

const CustomMenu = (props) => {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <View style={{ marginTop: 20, paddingHorizontal: 16 }}>
        <Text>Custom Menu Header</Text>
        {/* Ajoutez ici votre en-tête personnalisé */}
      </View>
    </DrawerContentScrollView>
  );
}

export default CustomMenu;
