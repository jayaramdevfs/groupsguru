import { View, Text, StyleSheet, Modal, TouchableOpacity, Alert } from 'react-native';

interface PaywallModalProps {
  visible: boolean;
  onClose: () => void;
  price: number | null;
  parentOptions?: { name: string; price: number }[];
}

export const PaywallModal = ({ visible, onClose, price, parentOptions }: PaywallModalProps) => {
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
            <Text style={styles.title}>Access Denied</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.message}>
            This content requires a purchase. 
          </Text>

          {price && price > 0 && (
            <View style={styles.optionCard}>
              <Text style={styles.optionTitle}>Unlock this content</Text>
              <Text style={styles.optionPrice}>₹{price}</Text>
            </View>
          )}

          {parentOptions && parentOptions.length > 0 && (
             <View style={styles.bundles}>
               <Text style={styles.bundleHeader}>Recommended Bundles</Text>
               {parentOptions.map((opt, idx) => (
                 <View key={idx} style={styles.optionCard}>
                    <Text style={styles.optionTitle}>Unlock {opt.name} & all contents inside</Text>
                    <Text style={styles.optionPrice}>₹{opt.price}</Text>
                 </View>
               ))}
             </View>
          )}

          <TouchableOpacity style={styles.buyBtn} onPress={() => Alert.alert('Payment', 'Razorpay payment coming in next sprint.')}>
            <Text style={styles.buyText}>Pay Now</Text>
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
    color: '#F97316', // Orange warning
  },
  closeBtn: {
    padding: 8,
  },
  closeText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  message: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
    marginBottom: 24,
  },
  optionCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionTitle: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
    flex: 1,
  },
  optionPrice: {
    color: '#10B981',
    fontWeight: '800',
    fontSize: 18,
    marginLeft: 16,
  },
  bundles: {
    marginTop: 12,
  },
  bundleHeader: {
    color: '#A855F7',
    fontWeight: '700',
    marginBottom: 8,
    fontSize: 14,
    textTransform: 'uppercase',
  },
  buyBtn: {
    backgroundColor: '#F97316',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  buyText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
  },
});
