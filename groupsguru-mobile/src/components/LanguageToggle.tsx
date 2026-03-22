import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useLanguage } from '../context/LanguageContext';

export const LanguageToggle: React.FC = () => {
    const { language, toggleLanguage } = useLanguage();

    return (
        <TouchableOpacity style={styles.button} onPress={toggleLanguage}>
            <Text style={styles.text}>
                {language === 'en' ? 'తెలుగు' : 'EN'}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: 'rgba(147, 51, 234, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(147, 51, 234, 0.3)',
        marginRight: 10,
    },
    text: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 12,
    },
});
