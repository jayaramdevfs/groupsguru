import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  text: string;
}

export const FormattedQuestionText = ({ text }: Props) => {
  if (!text) return null;

  // Split by newlines and handle some common patterns
  const lines = text.split('\n');

  return (
    <View style={styles.container}>
      {lines.map((line, index) => {
        const trimmed = line.trim();
        if (!trimmed) return <View key={index} style={styles.spacer} />;

        // Check if it's a list item like "1.", "A.", "(a)", or "-"
        const isListItem = /^[0-9]+\.|^[A-Z]\.|^\([a-z]\)|^[-—•]/.test(trimmed);

        return (
          <View key={index} style={[styles.lineWrapper, isListItem && styles.indent]}>
            <Text style={styles.text}>{trimmed}</Text>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  lineWrapper: {
    marginBottom: 4,
  },
  indent: {
    marginLeft: 12,
    marginTop: 2,
  },
  spacer: {
    height: 12,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 24,
  },
});
