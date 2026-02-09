import React from 'react';
import { View, Text, ViewStyle, TextStyle } from 'react-native';

interface BadgeProps {
  count: number;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
}

export const Badge: React.FC<BadgeProps> = ({ count, containerStyle, textStyle }) => {
  if (count <= 0) return null;

  return (
    <View style={containerStyle}>
      <Text style={textStyle}>
        {count > 99 ? '99+' : count}
      </Text>
    </View>
  );
};