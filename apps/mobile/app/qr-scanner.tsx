import { useQRScannerLogic } from '@app/shared';
import { YStack, XStack, Heading, BodyText, Button, Section, Spinner , QRScannerResult, QRScannerHistory } from '@app/ui';
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useEffect, useState, useCallback } from 'react';
import { StyleSheet, Linking, Vibration } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function QRScannerScreen() {
  const router = useRouter();
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

  // Sync permission state
  useEffect(() => {
    if (permission) {
      setPermission(permission.granted);
    }
  }, [permission, setPermission]);

  const handleBarCodeScanned = useCallback(
    (result: BarcodeScanningResult) => {
      if (!state.isActive) return;

      // Vibrate on scan
      Vibration.vibrate(100);

      onScan(result.data, result.type);
      stopScanning();
    },
    [state.isActive, onScan, stopScanning]
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
    if (canOpen) {
      await Linking.openURL(url);
    }
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

  // Permission not yet determined
  if (!permission) {
    return (
      <SafeAreaView style={styles.container}>
        <YStack flex={1} alignItems="center" justifyContent="center" padding="$4">
          <Spinner size="large" />
          <BodyText muted marginTop="$2">Checking camera permission...</BodyText>
        </YStack>
      </SafeAreaView>
    );
  }

  // Permission denied
  if (!permission.granted && !state.isActive) {
    return (
      <SafeAreaView style={styles.container}>
        <YStack flex={1} padding="$4" gap="$6">
          <XStack justifyContent="space-between" alignItems="center">
            <Heading level={3}>QR Scanner</Heading>
            <Button variant="ghost" size="sm" onPress={() => router.back()}>
              Close
            </Button>
          </XStack>

          <YStack flex={1} alignItems="center" justifyContent="center" gap="$4">
            <YStack
              backgroundColor="$yellow2"
              padding="$4"
              borderRadius="$4"
              borderWidth={1}
              borderColor="$yellow6"
              maxWidth={300}
            >
              <BodyText textAlign="center">
                Camera access is required to scan QR codes.
              </BodyText>
            </YStack>
            <Button variant="primary" onPress={handleRequestPermission}>
              Grant Camera Access
            </Button>
            <Button variant="ghost" onPress={() => router.back()}>
              Go Back
            </Button>
          </YStack>
        </YStack>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <YStack flex={1} padding="$4" gap="$4">
        <XStack justifyContent="space-between" alignItems="center">
          <Heading level={3}>QR Scanner</Heading>
          <Button variant="ghost" size="sm" onPress={() => router.back()}>
            Close
          </Button>
        </XStack>

        {/* Camera View */}
        {!state.result && (
          <Section gap="$4" flex={1}>
            {state.isActive ? (
              <YStack flex={1} borderRadius="$4" overflow="hidden" position="relative">
                <CameraView
                  style={styles.camera}
                  facing="back"
                  barcodeScannerSettings={{
                    barcodeTypes: ['qr', 'aztec', 'datamatrix'],
                  }}
                  onBarcodeScanned={handleBarCodeScanned}
                />

                {/* Scanning overlay */}
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
                flex={1}
                backgroundColor="$red2"
                padding="$4"
                borderRadius="$4"
                alignItems="center"
                justifyContent="center"
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
                flex={1}
                backgroundColor="$gray2"
                padding="$6"
                borderRadius="$4"
                alignItems="center"
                justifyContent="center"
                gap="$4"
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

        {/* Scan Result */}
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

        {/* Scan History */}
        {state.history.length > 0 && !state.isActive && (
          <QRScannerHistory
            history={state.history}
            onItemPress={(item) => {
              onScan(item.content, item.format);
            }}
            onClear={clearHistory}
            formatTimestamp={formatTimestamp}
          />
        )}
      </YStack>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  camera: {
    flex: 1,
  },
});
