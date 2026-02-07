import { useQRScannerLogic } from '@app/shared';
import type { QRScannerWidgetDef, WidgetRendererProps } from '@app/types';
import {
  YStack,
  XStack,
  BodyText,
  Button,
  Section,
  Spinner,
  QRScannerResult,
  QRScannerHistory,
} from '@app/ui';
import { CameraView, useCameraPermissions, type BarcodeScanningResult } from 'expo-camera';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Linking, Vibration } from 'react-native';

export function QRScannerWidget({
  definition,
  screenContext,
}: WidgetRendererProps<QRScannerWidgetDef>) {
  const [permission, requestPermission] = useCameraPermissions();
  const [copySuccess, setCopySuccess] = useState(false);

  const {
    state,
    onScan,
    onError,
    startScanning,
    stopScanning,
    reset,
    clearHistory,
    setPermission,
    copyToClipboard,
    isUrl,
    formatTimestamp,
  } = useQRScannerLogic({ vibrate: true, scanDelay: 2000 });

  useEffect(() => {
    if (permission) setPermission(permission.granted);
  }, [permission, setPermission]);

  const handleBarCodeScanned = useCallback(
    (result: BarcodeScanningResult) => {
      if (!state.isActive) return;
      Vibration.vibrate(100);
      onScan(result.data, result.type);
      stopScanning();
      if (definition.onScan) screenContext.executeLink(definition.onScan);
    },
    [state.isActive, onScan, stopScanning, definition.onScan, screenContext]
  );

  const handleCopy = async () => {
    const success = await copyToClipboard();
    if (success) {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const handleOpenUrl = async (url: string) => {
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) await Linking.openURL(url);
  };

  const handleScanAgain = () => {
    reset();
    startScanning();
  };

  const handleRequestPermission = async () => {
    const result = await requestPermission();
    if (result.granted) {
      startScanning();
    } else {
      onError('Camera permission denied. Please enable it in settings.');
    }
  };

  if (!permission) {
    return (
      <YStack alignItems="center" justifyContent="center" padding="$4" minHeight={200}>
        <Spinner size="large" />
        <BodyText muted marginTop="$2">
          Checking camera permission...
        </BodyText>
      </YStack>
    );
  }

  if (!permission.granted && !state.isActive) {
    return (
      <YStack alignItems="center" justifyContent="center" gap="$4" padding="$4">
        <YStack
          backgroundColor="$yellow2"
          padding="$4"
          borderRadius="$4"
          borderWidth={1}
          borderColor="$yellow6"
          maxWidth={300}
        >
          <BodyText textAlign="center">Camera access is required to scan QR codes.</BodyText>
        </YStack>
        <Button variant="primary" onPress={handleRequestPermission}>
          Grant Camera Access
        </Button>
      </YStack>
    );
  }

  return (
    <YStack gap="$4">
      {!state.result && (
        <Section gap="$4">
          {state.isActive ? (
            <YStack borderRadius="$4" overflow="hidden" position="relative" height={300}>
              <CameraView
                style={styles.camera}
                facing="back"
                barcodeScannerSettings={{ barcodeTypes: ['qr', 'aztec', 'datamatrix'] }}
                onBarcodeScanned={handleBarCodeScanned}
              />
              <YStack
                position="absolute"
                top={0}
                left={0}
                right={0}
                bottom={0}
                alignItems="center"
                justifyContent="center"
                pointerEvents="none"
              >
                <YStack
                  width={200}
                  height={200}
                  borderWidth={2}
                  borderColor="$green10"
                  borderRadius="$4"
                  opacity={0.8}
                />
                <BodyText
                  color="white"
                  marginTop="$4"
                  backgroundColor="rgba(0,0,0,0.5)"
                  paddingHorizontal="$3"
                  paddingVertical="$2"
                  borderRadius="$2"
                >
                  Point camera at QR code
                </BodyText>
              </YStack>
            </YStack>
          ) : state.error ? (
            <YStack
              backgroundColor="$red2"
              padding="$4"
              borderRadius="$4"
              alignItems="center"
              gap="$3"
            >
              <BodyText color="$red10" textAlign="center">
                {state.error}
              </BodyText>
              <Button variant="outline" onPress={startScanning}>
                Try Again
              </Button>
            </YStack>
          ) : (
            <YStack
              backgroundColor="$gray2"
              padding="$6"
              borderRadius="$4"
              alignItems="center"
              justifyContent="center"
              gap="$4"
              minHeight={200}
            >
              <BodyText muted textAlign="center">
                Tap the button below to start scanning QR codes
              </BodyText>
              <Button variant="primary" size="lg" onPress={startScanning}>
                Start Scanning
              </Button>
            </YStack>
          )}
          {state.isActive && (
            <Button variant="outline" onPress={stopScanning}>
              Stop Scanning
            </Button>
          )}
        </Section>
      )}

      {state.result && (
        <QRScannerResult
          result={state.result}
          onCopy={handleCopy}
          onOpenUrl={handleOpenUrl}
          onScanAgain={handleScanAgain}
          copySuccess={copySuccess}
          formatTimestamp={formatTimestamp}
          isUrl={isUrl}
        />
      )}

      {definition.showHistory !== false && state.history.length > 0 && !state.isActive && (
        <QRScannerHistory
          history={state.history}
          onItemPress={(item) => onScan(item.content, item.format)}
          onClear={clearHistory}
          formatTimestamp={formatTimestamp}
        />
      )}
    </YStack>
  );
}

const styles = StyleSheet.create({
  camera: { flex: 1 },
});
