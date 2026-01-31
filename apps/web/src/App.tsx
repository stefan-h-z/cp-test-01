import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TamaguiProvider, Theme } from '@app/ui';
import { AppProvider } from '@app/shared';
import { config } from './tamagui.config';
import { HomeScreen } from './screens/HomeScreen';
import { DetailsScreen } from './screens/DetailsScreen';
import { Layout } from './Layout';

export function App() {
  return (
    <TamaguiProvider config={config}>
      <Theme name="light">
        <AppProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<HomeScreen />} />
                <Route path="/details/:id" element={<DetailsScreen />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AppProvider>
      </Theme>
    </TamaguiProvider>
  );
}
