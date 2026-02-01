import { useState } from 'react';
import { ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { YStack, XStack, Heading, BodyText, Button, Card } from '@app/ui';
import { X, ArrowDownCircle, ArrowUpCircle, RefreshCw } from '@tamagui/lucide-icons';

const transactionTypes = [
  { id: 'expense', label: 'Expense', icon: ArrowDownCircle, color: '#ef4444' },
  { id: 'income', label: 'Income', icon: ArrowUpCircle, color: '#10b981' },
  { id: 'transfer', label: 'Transfer', icon: RefreshCw, color: '#6366f1' },
];

const categories = [
  { id: 'groceries', emoji: '🛒', label: 'Groceries' },
  { id: 'transport', emoji: '🚗', label: 'Transportation' },
  { id: 'entertainment', emoji: '🎬', label: 'Entertainment' },
  { id: 'utilities', emoji: '💡', label: 'Utilities' },
  { id: 'food', emoji: '🍔', label: 'Food & Dining' },
  { id: 'health', emoji: '💊', label: 'Health' },
  { id: 'shopping', emoji: '🛍️', label: 'Shopping' },
  { id: 'other', emoji: '📦', label: 'Other' },
];

export default function AddTransactionScreen() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState('expense');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [amount, setAmount] = useState('0');

  const handleNumberPress = (num: string) => {
    if (amount === '0' && num !== '.') {
      setAmount(num);
    } else if (num === '.' && amount.includes('.')) {
      return;
    } else {
      setAmount(amount + num);
    }
  };

  const handleDelete = () => {
    if (amount.length > 1) {
      setAmount(amount.slice(0, -1));
    } else {
      setAmount('0');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f1f5f9' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <XStack
          padding="$4"
          alignItems="center"
          justifyContent="space-between"
          backgroundColor="white"
          borderBottomWidth={1}
          borderBottomColor="#e2e8f0"
        >
          <Button
            variant="ghost"
            size="sm"
            onPress={() => router.back()}
            padding="$2"
          >
            <X size={24} color="#64748b" />
          </Button>
          <Heading level={3}>Add Transaction</Heading>
          <YStack width={40} />
        </XStack>

        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          {/* Transaction Type */}
          <YStack padding="$4" gap="$3">
            <BodyText fontWeight="600" color="$neutral600">Transaction Type</BodyText>
            <XStack gap="$2">
              {transactionTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = selectedType === type.id;
                return (
                  <YStack
                    key={type.id}
                    flex={1}
                    padding="$3"
                    borderRadius="$3"
                    backgroundColor={isSelected ? type.color : 'white'}
                    alignItems="center"
                    gap="$2"
                    onPress={() => setSelectedType(type.id)}
                    pressStyle={{ opacity: 0.8 }}
                  >
                    <Icon size={24} color={isSelected ? 'white' : type.color} />
                    <BodyText
                      size="sm"
                      fontWeight="500"
                      color={isSelected ? 'white' : '$neutral600'}
                    >
                      {type.label}
                    </BodyText>
                  </YStack>
                );
              })}
            </XStack>
          </YStack>

          {/* Amount Display */}
          <YStack padding="$4" alignItems="center" gap="$2">
            <BodyText size="sm" color="$neutral500">Amount</BodyText>
            <Heading level={1} fontSize={48}>
              ${amount}
            </Heading>
          </YStack>

          {/* Category Selection */}
          <YStack padding="$4" gap="$3">
            <BodyText fontWeight="600" color="$neutral600">Category</BodyText>
            <XStack flexWrap="wrap" gap="$2">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <YStack
                    key={cat.id}
                    padding="$3"
                    borderRadius="$3"
                    backgroundColor={isSelected ? '#6366f1' : 'white'}
                    alignItems="center"
                    gap="$1"
                    minWidth={80}
                    onPress={() => setSelectedCategory(cat.id)}
                    pressStyle={{ opacity: 0.8 }}
                  >
                    <BodyText fontSize={24}>{cat.emoji}</BodyText>
                    <BodyText
                      size="xs"
                      fontWeight="500"
                      color={isSelected ? 'white' : '$neutral600'}
                    >
                      {cat.label}
                    </BodyText>
                  </YStack>
                );
              })}
            </XStack>
          </YStack>

          {/* Number Pad */}
          <YStack padding="$4" gap="$2">
            {[['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9'], ['.', '0', '⌫']].map((row, i) => (
              <XStack key={i} gap="$2" justifyContent="center">
                {row.map((num) => (
                  <YStack
                    key={num}
                    width={80}
                    height={56}
                    borderRadius="$3"
                    backgroundColor="white"
                    alignItems="center"
                    justifyContent="center"
                    onPress={() => num === '⌫' ? handleDelete() : handleNumberPress(num)}
                    pressStyle={{ opacity: 0.7, backgroundColor: '#f1f5f9' }}
                  >
                    <BodyText fontSize={24} fontWeight="500">{num}</BodyText>
                  </YStack>
                ))}
              </XStack>
            ))}
          </YStack>

          {/* Save Button */}
          <YStack padding="$4">
            <Button
              variant="primary"
              size="lg"
              onPress={() => {
                // Handle save - for now just go back
                router.back();
              }}
            >
              <BodyText color="white" fontWeight="600">Save Transaction</BodyText>
            </Button>
          </YStack>

          {/* Bottom padding */}
          <YStack height={40} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
