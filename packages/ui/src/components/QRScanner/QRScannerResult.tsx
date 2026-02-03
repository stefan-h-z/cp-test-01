import { styled, YStack, XStack, GetProps } from 'tamagui';
import { Heading } from '../Typography';
import { BodyText } from '../Typography';
import { Button } from '../Button';
import type { QRScanResult } from '@app/types';

const ResultContainer = styled(YStack, {
  backgroundColor: '$background',
  padding: '$4',
  borderRadius: '$4',
  borderWidth: 1,
  borderColor: '$borderColor',
  gap: '$3',
});

const ContentBox = styled(YStack, {
  backgroundColor: '$gray2',
  padding: '$4',
  borderRadius: '$3',
  borderWidth: 1,
  borderColor: '$gray4',
});

const MetaRow = styled(XStack, {
  justifyContent: 'space-between',
  alignItems: 'center',
});

const ActionRow = styled(XStack, {
  gap: '$2',
  flexWrap: 'wrap',
});

const UrlText = styled(BodyText, {
  color: '$blue10',
  textDecorationLine: 'underline',
});

export type QRScannerResultProps = GetProps<typeof ResultContainer> & {
  /** The scan result to display */
  result: QRScanResult | null;
  /** Callback when copy button is pressed */
  onCopy?: () => void;
  /** Callback when open URL button is pressed */
  onOpenUrl?: (url: string) => void;
  /** Callback when scan again button is pressed */
  onScanAgain?: () => void;
  /** Whether copy was successful (for feedback) */
  copySuccess?: boolean;
  /** Format timestamp for display */
  formatTimestamp?: (timestamp: number) => string;
  /** Check if content is a URL */
  isUrl?: (content: string) => boolean;
};

/**
 * Displays the result of a QR code scan
 * Shows the content, metadata, and action buttons
 */
export function QRScannerResult({
  result,
  onCopy,
  onOpenUrl,
  onScanAgain,
  copySuccess,
  formatTimestamp,
  isUrl,
  ...props
}: QRScannerResultProps) {
  if (!result) {
    return (
      <ResultContainer {...props}>
        <YStack alignItems="center" padding="$4" gap="$2">
          <Heading level={4}>No QR Code Scanned</Heading>
          <BodyText muted textAlign="center">
            Point your camera at a QR code to scan it
          </BodyText>
        </YStack>
      </ResultContainer>
    );
  }

  const contentIsUrl = isUrl?.(result.content) ?? false;
  const formattedTime = formatTimestamp?.(result.timestamp) ?? new Date(result.timestamp).toLocaleString();

  return (
    <ResultContainer {...props}>
      <Heading level={4}>Scan Result</Heading>

      <ContentBox>
        {contentIsUrl ? (
          <UrlText
            numberOfLines={5}
            onPress={() => onOpenUrl?.(result.content)}
          >
            {result.content}
          </UrlText>
        ) : (
          <BodyText
            numberOfLines={10}
            style={{ wordBreak: 'break-all' }}
          >
            {result.content}
          </BodyText>
        )}
      </ContentBox>

      <YStack gap="$2">
        <MetaRow>
          <BodyText size="sm" muted>Format</BodyText>
          <BodyText size="sm">{result.format || 'QR Code'}</BodyText>
        </MetaRow>
        <MetaRow>
          <BodyText size="sm" muted>Scanned at</BodyText>
          <BodyText size="sm">{formattedTime}</BodyText>
        </MetaRow>
        <MetaRow>
          <BodyText size="sm" muted>Length</BodyText>
          <BodyText size="sm">{result.content.length} characters</BodyText>
        </MetaRow>
      </YStack>

      <ActionRow>
        {onCopy && (
          <Button
            variant={copySuccess ? 'primary' : 'outline'}
            size="sm"
            onPress={onCopy}
            flex={1}
          >
            {copySuccess ? 'Copied!' : 'Copy'}
          </Button>
        )}
        {contentIsUrl && onOpenUrl && (
          <Button
            variant="primary"
            size="sm"
            onPress={() => onOpenUrl(result.content)}
            flex={1}
          >
            Open URL
          </Button>
        )}
        {onScanAgain && (
          <Button
            variant="outline"
            size="sm"
            onPress={onScanAgain}
            flex={1}
          >
            Scan Again
          </Button>
        )}
      </ActionRow>
    </ResultContainer>
  );
}

export type QRScannerHistoryProps = {
  /** History of scan results */
  history: QRScanResult[];
  /** Callback when a history item is pressed */
  onItemPress?: (result: QRScanResult) => void;
  /** Callback to clear history */
  onClear?: () => void;
  /** Format timestamp for display */
  formatTimestamp?: (timestamp: number) => string;
};

/**
 * Displays the history of scanned QR codes
 */
export function QRScannerHistory({
  history,
  onItemPress,
  onClear,
  formatTimestamp,
}: QRScannerHistoryProps) {
  if (history.length === 0) {
    return null;
  }

  return (
    <YStack gap="$3">
      <XStack justifyContent="space-between" alignItems="center">
        <Heading level={5}>Recent Scans</Heading>
        {onClear && (
          <Button variant="ghost" size="sm" onPress={onClear}>
            Clear
          </Button>
        )}
      </XStack>
      <YStack gap="$2">
        {history.map((item, index) => (
          <XStack
            key={`${item.timestamp}-${index}`}
            backgroundColor="$gray2"
            padding="$3"
            borderRadius="$2"
            pressStyle={{ backgroundColor: '$gray3' }}
            onPress={() => onItemPress?.(item)}
            gap="$2"
            alignItems="center"
          >
            <YStack flex={1}>
              <BodyText numberOfLines={1} size="sm">
                {item.content}
              </BodyText>
              <BodyText size="xs" muted>
                {formatTimestamp?.(item.timestamp) ?? new Date(item.timestamp).toLocaleTimeString()}
              </BodyText>
            </YStack>
          </XStack>
        ))}
      </YStack>
    </YStack>
  );
}
