import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';
import { paymentService } from '../api/paymentService';
import { ParentOption } from '../api/accessTypes';
import { colors, radii, spacing, typography } from '../theme/tokens';

const RAZORPAY_KEY = 'rzp_test_SU3wy02Xv8CfbL';

interface PaywallModalProps {
  visible: boolean;
  onClose: () => void;
  price: number | null;
  entityType: string;
  entityId: number;
  entityName: string;
  parentOptions?: ParentOption[];
  onSuccess: () => void;
}

export const PaywallModal = ({
  visible,
  onClose,
  price,
  entityType,
  entityId,
  entityName,
  parentOptions,
  onSuccess,
}: PaywallModalProps) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async (type: string, id: number, name: string, amount: number) => {
    setLoading(true);
    try {
      const orderId = await paymentService.createOrder(type, id);

      const options = {
        description: `Purchase access to ${name}`,
        image: '',
        currency: 'INR',
        key: RAZORPAY_KEY,
        amount: (amount * 100).toString(),
        name: 'GroupsGuru',
        order_id: orderId,
        prefill: {
          email: '',
          contact: '',
          name: '',
        },
        theme: { color: colors.accent },
      };

      const response = await RazorpayCheckout.open(options);

      await paymentService.verifyPayment(
        response.razorpay_order_id,
        response.razorpay_payment_id,
        response.razorpay_signature,
      );

      Alert.alert('Success', 'Payment successful! Content unlocked.');
      onSuccess();
      onClose();
    } catch (error: any) {
      if (error?.code === 'PAYMENT_CANCELLED') {
        // User cancelled - do nothing
      } else if (error?.description) {
        Alert.alert('Payment Failed', error.description);
      } else {
        Alert.alert('Error', 'Payment failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Locked Content</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.lockIconContainer}>
             <View style={styles.lockCircle}>
                <Text style={styles.lockEmoji}>🔒</Text>
             </View>
          </View>

          <Text style={styles.message}>
            You need a premium subscription to access {entityName}.
          </Text>

          {/* Primary Purchase Option */}
          {price != null && price > 0 && (
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => handlePayment(entityType, entityId, entityName, price)}
              disabled={loading}
              activeOpacity={0.9}
            >
              <View style={styles.optionRow}>
                <View>
                  <Text style={styles.optionLabel}>Standard Access</Text>
                  <Text style={styles.optionName}>{entityName}</Text>
                </View>
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.primaryPrice}>₹{price}</Text>
                )}
              </View>
            </TouchableOpacity>
          )}

          {/* Bundle Options */}
          {parentOptions && parentOptions.length > 0 && (
            <View style={styles.bundles}>
              <Text style={styles.bundleHeader}>Recommended Bundles</Text>
              {parentOptions.map((opt) => (
                <TouchableOpacity
                  key={`${opt.entityType}-${opt.entityId}`}
                  style={styles.bundleCard}
                  onPress={() => handlePayment(opt.entityType, opt.entityId, opt.name, opt.price)}
                  disabled={loading}
                  activeOpacity={0.7}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.bundleType}>
                      {opt.entityType.replace('_', ' ')} Level
                    </Text>
                    <Text style={styles.bundleName}>{opt.name}</Text>
                  </View>
                  <Text style={styles.bundlePrice}>₹{opt.price}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
            <Text style={styles.cancelText}>Cancel and return</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  content: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: 22,
    fontWeight: '400',
    color: colors.fgPrimary,
    fontFamily: 'serif',
  },
  closeBtn: { padding: spacing.xs },
  closeText: { color: colors.fgMuted, fontSize: 18, fontWeight: '300' },
  lockIconContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  lockCircle: {
     width: 64,
     height: 64,
     borderRadius: radii.full,
     backgroundColor: colors.accent + '15',
     justifyContent: 'center',
     alignItems: 'center',
     borderWidth: 1,
     borderColor: colors.accent + '30',
  },
  lockEmoji: { fontSize: 28 },
  message: {
    color: colors.fgSecondary,
    fontSize: 15,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  primaryBtn: {
    borderRadius: radii.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
    backgroundColor: colors.accent,
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 2,
  },
  optionName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  primaryPrice: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 22,
    fontFamily: typography.mono.fontFamily,
  },
  bundles: { marginTop: spacing.md },
  bundleHeader: {
    color: colors.fgMuted,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  bundleCard: {
    backgroundColor: colors.inset,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bundleType: {
    color: colors.fgMuted,
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  bundleName: {
    color: colors.fgPrimary,
    fontWeight: '700',
    fontSize: 14,
  },
  bundlePrice: {
    color: colors.accent,
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: typography.mono.fontFamily,
    marginLeft: spacing.md,
  },
  cancelBtn: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    marginTop: spacing.md,
  },
  cancelText: {
    color: colors.fgMuted,
    fontSize: 13,
    fontWeight: '500',
  },
});
