import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const ProfessionalLogo = ({ size = 32 }: { size?: number }) => {
  return (
    <View style={styles.container}>
      <View style={[styles.logoBox, { width: size * 1.25, height: size }]}>
        <Text style={[styles.logoText, { fontSize: size * 0.5 }]}>GG</Text>
      </View>
      <Text style={[styles.brandText, { fontSize: size * 0.65 }]}>GroupsGuru</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoBox: {
    backgroundColor: '#7C3AED', // Consistent purple-600
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    shadowColor: '#9333EA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  logoText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontStyle: 'italic',
  },
  brandText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontStyle: 'italic',
    letterSpacing: -1,
    paddingRight: 10, // Added padding to prevent the italic 'u' from being cut off at the edge by the RN text bounding box
  },
});
