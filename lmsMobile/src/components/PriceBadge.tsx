import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface PriceBadgeProps {
  accessType?: string;
  priceInr?: number | null;
}

export const PriceBadge = ({ accessType, priceInr }: PriceBadgeProps) => {
  const isPaid = accessType === 'PAID' && priceInr && priceInr > 0;

  return (
    <View style={[styles.badge, isPaid ? styles.paidBadge : styles.freeBadge]}>
      <Text style={[styles.text, isPaid ? styles.paidText : styles.freeText]}>
        {isPaid ? `₹${priceInr}` : 'FREE'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginLeft: 8,
  },
  paidBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
  },
  freeBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  text: {
    fontSize: 10,
    fontWeight: '800',
  },
  paidText: {
    color: '#f59e0b',
  },
  freeText: {
    color: '#10b981',
  },
});
