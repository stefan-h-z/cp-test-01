import { useState } from 'react';
import { YStack, XStack } from 'tamagui';
import { Heading, BodyText } from '../components/Typography';
import { Button } from '../components/Button';
import { transactionCategories } from './screenData';

interface TransactionType {
  id: string;
  label: string;
  color: string;
}

const transactionTypes: TransactionType[] = [
  { id: 'expense', label: 'Expense', color: '#ef4444' },
  { id: 'income', label: 'Income', color: '#10b981' },
  { id: 'transfer', label: 'Transfer', color: '#6366f1' },
];

interface AddTransactionContentProps {
  onClose?: () => void;
  onSave?: (data: { type: string; category: string; amount: string }) => void;
  typeIcons?: Record<string, React.ReactNode>;
}

export function AddTransactionContent({ onClose, onSave, typeIcons }: AddTransactionContentProps) {
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

  const handleSave = () => {
    if (onSave && selectedCategory) {
      onSave({ type: selectedType, category: selectedCategory, amount });
    }
    onClose?.();
  };

  return (
    <YStack flex={1}>
      {/* Transaction Type */}
      <YStack padding="$4" gap="$3">
        <BodyText fontWeight="600" color="$neutral600">Transaction Type</BodyText>
        <XStack gap="$2">
          {transactionTypes.map((type) => {
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
                cursor="pointer"
              >
                {typeIcons?.[type.id] || (
                  <BodyText fontSize={24}>
                    {type.id === 'expense' ? '⬇️' : type.id === 'income' ? '⬆️' : '🔄'}
                  </BodyText>
                )}
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
          {transactionCategories.map((cat) => {
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
                cursor="pointer"
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
                cursor="pointer"
              >
                <BodyText fontSize={24} fontWeight="500">{num}</BodyText>
              </YStack>
            ))}
          </XStack>
        ))}
      </YStack>

      {/* Save Button */}
      <YStack padding="$4">
        <Button variant="primary" size="lg" onPress={handleSave}>
          <BodyText color="white" fontWeight="600">Save Transaction</BodyText>
        </Button>
      </YStack>
    </YStack>
  );
}
