import { YStack } from 'tamagui';
import { Heading, BodyText } from '../components/Typography';

interface BudgetContentProps {
  icon?: React.ReactNode;
}

export function BudgetContent({ icon }: BudgetContentProps) {
  return (
    <YStack flex={1} alignItems="center" justifyContent="center" padding="$6" gap="$4">
      {icon || (
        <YStack
          width={80}
          height={80}
          borderRadius={40}
          backgroundColor="#e0e7ff"
          alignItems="center"
          justifyContent="center"
        >
          <BodyText fontSize={32}>📅</BodyText>
        </YStack>
      )}
      <Heading level={2}>Budget</Heading>
      <BodyText color="$neutral500" textAlign="center">
        Manage your monthly budgets and spending limits.
      </BodyText>
      <BodyText color="$neutral400" size="sm">
        Coming soon...
      </BodyText>
    </YStack>
  );
}
