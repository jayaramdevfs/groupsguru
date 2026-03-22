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
        theme: { color: '#9333ea' },
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
      animationType="slide"
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

          <View style={styles.lockIcon}>
            <Text style={styles.lockEmoji}>🔒</Text>
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
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <View style={styles.optionRow}>
                  <View>
                    <Text style={styles.optionLabel}>Standard Access</Text>
                    <Text style={styles.optionName}>{entityName}</Text>
                  </View>
                  <Text style={styles.primaryPrice}>₹{price}</Text>
                </View>
              )}
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
                  activeOpacity={0.8}
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
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: '#1E1B4B',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    minHeight: 300,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#A855F7',
  },
  closeBtn: { padding: 8 },
  closeText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  lockIcon: {
    alignItems: 'center',
    marginBottom: 12,
  },
  lockEmoji: { fontSize: 40 },
  message: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  primaryBtn: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    overflow: 'hidden',
    backgroundColor: '#7C3AED',
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    fontWeight: '600',
  },
  optionName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 2,
  },
  primaryPrice: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 22,
    fontStyle: 'italic',
  },
  bundles: { marginTop: 8 },
  bundleHeader: {
    color: 'rgba(255,255,255,0.4)',
    fontWeight: '700',
    marginBottom: 8,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  bundleCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bundleType: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 11,
    textTransform: 'capitalize',
  },
  bundleName: {
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
    fontSize: 14,
    marginTop: 2,
  },
  bundlePrice: {
    color: '#A855F7',
    fontWeight: '800',
    fontSize: 18,
    marginLeft: 16,
  },
  cancelBtn: {
    alignItems: 'center',
    paddingVertical: 14,
    marginTop: 8,
  },
  cancelText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 14,
  },
});
