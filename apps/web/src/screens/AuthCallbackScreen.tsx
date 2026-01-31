import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { YStack, Spinner, BodyText } from '@app/ui';

export function AuthCallbackScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    // This page handles OAuth callbacks
    // The actual token extraction is handled by the popup window
    // If we're here in the main window, redirect to home
    const isPopup = window.opener !== null;

    if (!isPopup) {
      // We're in the main window, redirect to home after a short delay
      const timer = setTimeout(() => {
        navigate('/', { replace: true });
      }, 1000);
      return () => clearTimeout(timer);
    }
    // If we're in a popup, the parent window will close us
  }, [navigate]);

  return (
    <YStack flex={1} alignItems="center" justifyContent="center" gap="$4">
      <Spinner size="large" />
      <BodyText>Completing authentication...</BodyText>
    </YStack>
  );
}
