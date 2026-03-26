import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radii, spacing, typography } from '../theme/tokens';

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
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radii.sm,
    alignSelf: 'flex-start',
    marginLeft: spacing.sm,
    borderWidth: 1,
  },
  paidBadge: {
    backgroundColor: colors.accent + '20',
    borderColor: colors.accent + '40',
  },
  freeBadge: {
    backgroundColor: colors.success + '20',
    borderColor: colors.success + '40',
  },
  text: {
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: typography.mono.fontFamily,
  },
  paidText: {
    color: colors.accent,
  },
  freeText: {
    color: colors.success,
  },
});
