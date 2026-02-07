import { useQRScannerLogic } from '@app/shared';
import {
  YStack,
  XStack,
  Heading,
  BodyText,
  Button,
  Section,
  Spinner,
  QRScannerResult,
  QRScannerHistory,
} from '@app/ui';
import jsQR from 'jsqr';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// Declare BarcodeDetector for TypeScript (optional native API)
declare global {
  interface Window {
    BarcodeDetector?: new (options?: { formats: string[] }) => {
      detect: (source: ImageBitmapSource) => Promise<Array<{ rawValue: string; format: string }>>;
    };
  }
}

type ScanMode = 'native' | 'jsqr';

export function QRScannerScreen() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number>(0);
  const detectorRef = useRef<InstanceType<NonNullable<Window['BarcodeDetector']>> | null>(null);

  const [copySuccess, setCopySuccess] = useState(false);
  const [scanMode, setScanMode] = useState<ScanMode | null>(null);

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

  // Check if BarcodeDetector is supported, fallback to jsQR
  useEffect(() => {
    const checkSupport = async () => {
      if ('BarcodeDetector' in window) {
        try {
          // Check if QR code format is supported
          const formats = (await (
            window.BarcodeDetector as unknown as { getSupportedFormats: () => Promise<string[]> }
          ).getSupportedFormats?.()) ?? ['qr_code'];

          if (formats.includes('qr_code')) {
            // Create detector instance
            detectorRef.current = new window.BarcodeDetector!({ formats: ['qr_code'] });
            setScanMode('native');
            return;
          }
        } catch {
          // Native API failed, fall through to jsQR
        }
      }
      // Fallback to jsQR (works in all browsers)
      setScanMode('jsqr');
    };
    checkSupport();
  }, []);

  // Start camera stream
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });

      streamRef.current = stream;
      setPermission(true);
      // First set scanning active so the video element renders
      startScanning();
    } catch (err) {
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          onError('Camera permission denied. Please allow camera access to scan QR codes.');
          setPermission(false);
        } else {
          onError(`Failed to access camera: ${err.message}`);
        }
      }
    }
  }, [setPermission, startScanning, onError]);

  // Attach stream to video element when it becomes available
  useEffect(() => {
    if (state.isActive && streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch((err) => {
        onError(`Failed to play video: ${err.message}`);
      });
    }
  }, [state.isActive, onError]);

  // Stop camera stream
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    stopScanning();
  }, [stopScanning]);

  // Scan for QR codes using native API or jsQR fallback
  const scanFrame = useCallback(async () => {
    if (!state.isActive || !videoRef.current || !canvasRef.current || !scanMode) {
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (video.readyState === video.HAVE_ENOUGH_DATA && ctx) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      try {
        if (scanMode === 'native' && detectorRef.current) {
          // Use native BarcodeDetector API
          const barcodes = await detectorRef.current.detect(canvas);
          if (barcodes.length > 0) {
            const barcode = barcodes[0];
            onScan(barcode.rawValue, barcode.format);
          }
        } else {
          // Use jsQR fallback
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert',
          });
          if (code) {
            onScan(code.data, 'qr_code');
          }
        }
      } catch {
        // Detection failed, continue scanning
      }
    }

    animationRef.current = requestAnimationFrame(scanFrame);
  }, [state.isActive, onScan, scanMode]);

  // Start scanning loop when active
  useEffect(() => {
    if (state.isActive) {
      animationRef.current = requestAnimationFrame(scanFrame);
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [state.isActive, scanFrame]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  const handleCopy = async () => {
    const success = await copyToClipboard();
    if (success) {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const handleOpenUrl = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleScanAgain = () => {
    reset();
    startCamera();
  };

  // Still checking support
  if (scanMode === null) {
    return (
      <YStack gap="$6" paddingVertical="$4" alignItems="center">
        <Section alignItems="center" gap="$4" maxWidth={500}>
          <Heading level={2}>QR Scanner</Heading>
          <Spinner size="large" />
          <BodyText muted>Initializing scanner...</BodyText>
        </Section>
      </YStack>
    );
  }

  return (
    <YStack gap="$6" paddingVertical="$4">
      <XStack justifyContent="space-between" alignItems="center">
        <Heading level={2}>QR Scanner</Heading>
        <Button variant="ghost" onPress={() => navigate(-1)}>
          ← Back
        </Button>
      </XStack>

      <YStack gap="$4" maxWidth={600} alignItems="center">
        {/* Camera View */}
        {!state.result && (
          <Section gap="$4" alignItems="center" width="100%">
            {state.isActive ? (
              <YStack alignItems="center" gap="$3">
                {/* Square camera preview */}
                <YStack
                  position="relative"
                  width={280}
                  height={280}
                  backgroundColor="$gray12"
                  borderRadius="$4"
                  overflow="hidden"
                >
                  <video
                    ref={videoRef}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                    playsInline
                    muted
                  />
                  <canvas ref={canvasRef} style={{ display: 'none' }} />

                  {/* Corner markers overlay */}
                  <YStack
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    pointerEvents="none"
                  >
                    {/* Top-left corner */}
                    <YStack position="absolute" top={20} left={20}>
                      <YStack width={40} height={4} backgroundColor="$green10" borderRadius={2} />
                      <YStack width={4} height={40} backgroundColor="$green10" borderRadius={2} />
                    </YStack>
                    {/* Top-right corner */}
                    <YStack position="absolute" top={20} right={20} alignItems="flex-end">
                      <YStack width={40} height={4} backgroundColor="$green10" borderRadius={2} />
                      <YStack
                        width={4}
                        height={40}
                        backgroundColor="$green10"
                        borderRadius={2}
                        alignSelf="flex-end"
                      />
                    </YStack>
                    {/* Bottom-left corner */}
                    <YStack position="absolute" bottom={20} left={20}>
                      <YStack width={4} height={40} backgroundColor="$green10" borderRadius={2} />
                      <YStack width={40} height={4} backgroundColor="$green10" borderRadius={2} />
                    </YStack>
                    {/* Bottom-right corner */}
                    <YStack position="absolute" bottom={20} right={20} alignItems="flex-end">
                      <YStack
                        width={4}
                        height={40}
                        backgroundColor="$green10"
                        borderRadius={2}
                        alignSelf="flex-end"
                      />
                      <YStack width={40} height={4} backgroundColor="$green10" borderRadius={2} />
                    </YStack>
                  </YStack>
                </YStack>

                <BodyText muted size="sm" textAlign="center">
                  Position QR code within the frame
                </BodyText>

                <Button variant="outline" onPress={stopCamera}>
                  Stop Scanning
                </Button>
              </YStack>
            ) : state.error ? (
              <YStack
                backgroundColor="$red2"
                padding="$4"
                borderRadius="$4"
                alignItems="center"
                gap="$3"
                maxWidth={300}
              >
                <BodyText color="$red10" textAlign="center">
                  {state.error}
                </BodyText>
                <Button variant="outline" onPress={startCamera}>
                  Try Again
                </Button>
              </YStack>
            ) : (
              <YStack
                backgroundColor="$gray2"
                padding="$6"
                borderRadius="$4"
                alignItems="center"
                gap="$4"
                width={280}
                height={280}
                justifyContent="center"
              >
                <YStack
                  width={80}
                  height={80}
                  backgroundColor="$gray4"
                  borderRadius="$3"
                  alignItems="center"
                  justifyContent="center"
                >
                  <BodyText fontSize={32}>📷</BodyText>
                </YStack>
                <BodyText muted textAlign="center" size="sm">
                  Tap to start scanning
                </BodyText>
                <Button variant="primary" onPress={startCamera}>
                  Start Camera
                </Button>
              </YStack>
            )}
          </Section>
        )}

        {/* Scan Result */}
        <QRScannerResult
          result={state.result}
          onCopy={handleCopy}
          onOpenUrl={handleOpenUrl}
          onScanAgain={handleScanAgain}
          copySuccess={copySuccess}
          formatTimestamp={formatTimestamp}
          isUrl={isUrl}
        />

        {/* Scan History */}
        {state.history.length > 0 && (
          <QRScannerHistory
            history={state.history}
            onItemPress={(item) => onScan(item.content, item.format)}
            onClear={clearHistory}
            formatTimestamp={formatTimestamp}
          />
        )}
      </YStack>
    </YStack>
  );
}
