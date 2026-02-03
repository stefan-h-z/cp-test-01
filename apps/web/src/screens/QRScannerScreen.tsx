import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { YStack, XStack, Heading, BodyText, Button, Section, Spinner } from '@app/ui';
import { QRScannerResult, QRScannerHistory } from '@app/ui';
import { useQRScannerLogic } from '@app/shared';

// Declare BarcodeDetector for TypeScript
declare global {
  interface Window {
    BarcodeDetector?: new (options?: { formats: string[] }) => {
      detect: (source: ImageBitmapSource) => Promise<Array<{ rawValue: string; format: string }>>;
    };
  }
}

export function QRScannerScreen() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number>(0);
  const detectorRef = useRef<InstanceType<NonNullable<Window['BarcodeDetector']>> | null>(null);

  const [copySuccess, setCopySuccess] = useState(false);
  const [isSupported, setIsSupported] = useState<boolean | null>(null);

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

  // Check if BarcodeDetector is supported
  useEffect(() => {
    const checkSupport = async () => {
      if ('BarcodeDetector' in window) {
        try {
          // Check if QR code format is supported
          const formats = await (window.BarcodeDetector as unknown as { getSupportedFormats: () => Promise<string[]> }).getSupportedFormats?.() ?? ['qr_code'];
          setIsSupported(formats.includes('qr_code'));

          // Create detector instance
          detectorRef.current = new window.BarcodeDetector!({ formats: ['qr_code'] });
        } catch {
          setIsSupported(false);
        }
      } else {
        setIsSupported(false);
      }
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

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        startScanning();
      }
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

  // Scan for QR codes
  const scanFrame = useCallback(async () => {
    if (!state.isActive || !videoRef.current || !canvasRef.current || !detectorRef.current) {
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
        const barcodes = await detectorRef.current.detect(canvas);
        if (barcodes.length > 0) {
          const barcode = barcodes[0];
          onScan(barcode.rawValue, barcode.format);
        }
      } catch {
        // Detection failed, continue scanning
      }
    }

    animationRef.current = requestAnimationFrame(scanFrame);
  }, [state.isActive, onScan]);

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

  // Browser not supported
  if (isSupported === false) {
    return (
      <YStack gap="$6" paddingVertical="$4" alignItems="center">
        <Section alignItems="center" gap="$4" maxWidth={500}>
          <Heading level={2}>QR Scanner</Heading>
          <YStack
            backgroundColor="$yellow2"
            padding="$4"
            borderRadius="$4"
            borderWidth={1}
            borderColor="$yellow6"
          >
            <BodyText textAlign="center">
              Your browser doesn't support the Barcode Detection API.
              Please use a modern browser like Chrome, Edge, or Safari on macOS.
            </BodyText>
          </YStack>
          <Button variant="outline" onPress={() => navigate(-1)}>
            Go Back
          </Button>
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

      <YStack gap="$4" maxWidth={600}>
        {/* Camera View */}
        {!state.result && (
          <Section gap="$4">
            {state.isActive ? (
              <YStack
                position="relative"
                backgroundColor="$gray12"
                borderRadius="$4"
                overflow="hidden"
                aspectRatio={4 / 3}
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
                backgroundColor="$red2"
                padding="$4"
                borderRadius="$4"
                alignItems="center"
                gap="$3"
              >
                <BodyText color="$red10" textAlign="center">
                  {state.error}
                </BodyText>
                <Button variant="outline" onPress={startCamera}>
                  Try Again
                </Button>
              </YStack>
            ) : isSupported === null ? (
              <YStack alignItems="center" padding="$6">
                <Spinner size="large" />
                <BodyText muted marginTop="$2">Checking browser support...</BodyText>
              </YStack>
            ) : (
              <YStack
                backgroundColor="$gray2"
                padding="$6"
                borderRadius="$4"
                alignItems="center"
                gap="$4"
                aspectRatio={4 / 3}
                justifyContent="center"
              >
                <BodyText muted textAlign="center">
                  Click the button below to start scanning QR codes
                </BodyText>
                <Button variant="primary" size="lg" onPress={startCamera}>
                  Start Camera
                </Button>
              </YStack>
            )}

            {state.isActive && (
              <Button variant="outline" onPress={stopCamera}>
                Stop Scanning
              </Button>
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
