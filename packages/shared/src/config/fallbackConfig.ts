import { defaultAppConfig, defaultAuthConfig, defaultI18nConfig } from '@app/config';
import type { RemoteAppConfig, ScreenDefinition } from '@app/types';

/**
 * Screen definitions for config-driven screens.
 * Each screen defines its widget tree, referenced by routes via screenCode.
 */
const screens: Record<string, ScreenDefinition> = {
  home: {
    code: 'home',
    title: 'Home',
    components: [
      {
        type: 'Header',
        width: 12,
        label: 'Welcome to FinanceApp!',
        level: 1,
      },
      {
        type: 'Text',
        width: 12,
        label: 'Select a tile below to get started.',
        muted: true,
        size: 'lg',
      },
      {
        type: 'Spacer',
        width: 12,
        size: '$2',
      },
      {
        type: 'Card',
        width: 4,
        responsiveWidth: { xs: 12, sm: 6 },
        variant: 'elevated',
        header: 'Budget',
        description: 'Track your monthly budget and spending habits.',
        buttons: [
          {
            type: 'Button',
            label: 'View Budget',
            variant: 'primary',
            fullWidth: true,
            link: { type: 'SCREEN', code: 'budget' },
          },
        ],
      },
      {
        type: 'Card',
        width: 4,
        responsiveWidth: { xs: 12, sm: 6 },
        variant: 'elevated',
        header: 'Transactions',
        description: 'View and manage your recent transactions.',
        buttons: [
          {
            type: 'Button',
            label: 'View Transactions',
            variant: 'primary',
            fullWidth: true,
            link: { type: 'SCREEN', code: 'transactions' },
          },
        ],
      },
      {
        type: 'Card',
        width: 4,
        responsiveWidth: { xs: 12, sm: 6 },
        variant: 'elevated',
        header: 'Accounts',
        description: 'Manage your bank accounts and credit cards.',
        buttons: [
          {
            type: 'Button',
            label: 'View Accounts',
            variant: 'primary',
            fullWidth: true,
            link: { type: 'SCREEN', code: 'accounts' },
          },
        ],
      },
      {
        type: 'Card',
        width: 4,
        responsiveWidth: { xs: 12, sm: 6 },
        variant: 'elevated',
        header: 'Workflow',
        description: 'Demo-Workflow mit 4 Schritten und allen Formular-Elementen.',
        buttons: [
          {
            type: 'Button',
            label: 'Workflow starten',
            variant: 'primary',
            fullWidth: true,
            link: { type: 'SCREEN', code: 'workflow-demo' },
          },
        ],
      },
      {
        type: 'Spacer',
        width: 12,
        size: '$4',
      },
      {
        type: 'Card',
        width: 4,
        responsiveWidth: { xs: 12, sm: 6 },
        variant: 'outlined',
        featureFlag: 'qrScanner',
        header: 'QR Scanner',
        description: 'Scan QR codes to quickly add transactions or links.',
        buttons: [
          {
            type: 'Button',
            label: 'Open Scanner',
            variant: 'outline',
            fullWidth: true,
            link: { type: 'SCREEN', code: 'qr-scanner' },
          },
        ],
      },
    ],
  },

  budget: {
    code: 'budget',
    title: 'Budget',
    components: [
      {
        type: 'Header',
        width: 12,
        label: 'Budget Overview',
        level: 2,
      },
      {
        type: 'Text',
        width: 12,
        label: 'Track your monthly spending and stay within your budget.',
        muted: true,
      },
      {
        type: 'Divider',
        width: 12,
      },
      {
        type: 'Card',
        width: 6,
        responsiveWidth: { xs: 12 },
        variant: 'elevated',
        header: 'Monthly Budget',
        description: 'You have spent $1,250 of your $2,000 monthly budget.',
      },
      {
        type: 'Card',
        width: 6,
        responsiveWidth: { xs: 12 },
        variant: 'elevated',
        header: 'Savings Goal',
        description: 'You are 65% towards your $5,000 savings goal.',
      },
      {
        type: 'Spacer',
        width: 12,
        size: '$3',
      },
      {
        type: 'Button',
        width: 4,
        responsiveWidth: { xs: 12 },
        label: 'Back to Home',
        variant: 'outline',
        link: { type: 'SCREEN', code: 'home' },
      },
    ],
  },

  transactions: {
    code: 'transactions',
    title: 'Transactions',
    components: [
      {
        type: 'Header',
        width: 12,
        label: 'Transactions',
        level: 2,
      },
      {
        type: 'Text',
        width: 12,
        label: 'View and manage your recent transactions.',
        muted: true,
      },
      {
        type: 'Divider',
        width: 12,
      },
      {
        type: 'Card',
        width: 12,
        variant: 'outlined',
        header: 'Recent Transactions',
        description: 'No transactions to display yet. Add your first transaction to get started.',
        buttons: [
          {
            type: 'Button',
            label: 'Add Transaction',
            variant: 'primary',
            link: { type: 'SCREEN', code: 'add-transaction' },
          },
        ],
      },
      {
        type: 'Spacer',
        width: 12,
        size: '$3',
      },
      {
        type: 'Button',
        width: 4,
        responsiveWidth: { xs: 12 },
        label: 'Back to Home',
        variant: 'outline',
        link: { type: 'SCREEN', code: 'home' },
      },
    ],
  },

  accounts: {
    code: 'accounts',
    title: 'Accounts',
    components: [
      {
        type: 'Header',
        width: 12,
        label: 'Accounts',
        level: 2,
      },
      {
        type: 'Text',
        width: 12,
        label: 'Manage your bank accounts and credit cards.',
        muted: true,
      },
      {
        type: 'Divider',
        width: 12,
      },
      {
        type: 'Card',
        width: 6,
        responsiveWidth: { xs: 12 },
        variant: 'elevated',
        header: 'Checking Account',
        description: 'Balance: $3,450.00',
      },
      {
        type: 'Card',
        width: 6,
        responsiveWidth: { xs: 12 },
        variant: 'elevated',
        header: 'Savings Account',
        description: 'Balance: $12,800.00',
      },
      {
        type: 'Spacer',
        width: 12,
        size: '$3',
      },
      {
        type: 'Button',
        width: 4,
        responsiveWidth: { xs: 12 },
        label: 'Back to Home',
        variant: 'outline',
        link: { type: 'SCREEN', code: 'home' },
      },
    ],
  },

  'qr-scanner': {
    code: 'qr-scanner',
    title: 'QR Scanner',
    components: [
      {
        type: 'Header',
        width: 12,
        label: 'QR Scanner',
        level: 2,
      },
      {
        type: 'Text',
        width: 12,
        label: 'Scan a QR code to quickly capture data.',
        muted: true,
      },
      {
        type: 'QRScanner',
        width: 12,
        showHistory: true,
      },
      {
        type: 'Spacer',
        width: 12,
        size: '$3',
      },
      {
        type: 'Button',
        width: 4,
        responsiveWidth: { xs: 12 },
        label: 'Back to Home',
        variant: 'outline',
        link: { type: 'SCREEN', code: 'home' },
      },
    ],
  },

  onboarding: {
    code: 'onboarding',
    title: 'Onboarding',
    components: [
      {
        type: 'Header',
        width: 12,
        label: 'Get Started',
        level: 2,
      },
      {
        type: 'Workflow',
        width: 12,
        config: {
          variant: 'horizontal',
          allowBack: true,
          allowStepClick: false,
          labels: {
            next: 'Continue',
            back: 'Go Back',
            submit: 'Complete Setup',
            cancel: 'Skip for Now',
          },
          onComplete: {
            type: 'SCREEN',
            code: 'home',
          },
          onCancel: {
            type: 'SCREEN',
            code: 'home',
          },
          steps: [
            {
              id: 'personal',
              title: 'Personal Information',
              description: 'Tell us about yourself.',
              icon: 'User',
              fields: [
                {
                  name: 'firstName',
                  label: 'First Name',
                  placeholder: 'John',
                  type: 'text',
                  required: true,
                  width: 6,
                  responsiveWidth: { xs: 12 },
                  validation: [
                    { type: 'required', message: 'First name is required' },
                    { type: 'minLength', value: 2, message: 'Must be at least 2 characters' },
                  ],
                },
                {
                  name: 'lastName',
                  label: 'Last Name',
                  placeholder: 'Doe',
                  type: 'text',
                  required: true,
                  width: 6,
                  responsiveWidth: { xs: 12 },
                  validation: [{ type: 'required', message: 'Last name is required' }],
                },
                {
                  name: 'email',
                  label: 'Email Address',
                  placeholder: 'john@example.com',
                  type: 'email',
                  required: true,
                  width: 12,
                  validation: [
                    { type: 'required' },
                    { type: 'email', message: 'Please enter a valid email' },
                  ],
                },
              ],
            },
            {
              id: 'preferences',
              title: 'Preferences',
              description: 'Customize your experience.',
              icon: 'Settings',
              fields: [
                {
                  name: 'currency',
                  label: 'Preferred Currency',
                  type: 'select',
                  required: true,
                  width: 6,
                  responsiveWidth: { xs: 12 },
                  options: [
                    { value: 'USD', label: 'US Dollar ($)' },
                    { value: 'EUR', label: 'Euro (EUR)' },
                    { value: 'GBP', label: 'British Pound (GBP)' },
                  ],
                  defaultValue: 'USD',
                  validation: [{ type: 'required' }],
                },
                {
                  name: 'budgetGoal',
                  label: 'Monthly Budget Goal',
                  placeholder: '2000',
                  type: 'number',
                  required: true,
                  width: 6,
                  responsiveWidth: { xs: 12 },
                  validation: [
                    { type: 'required' },
                    { type: 'min', value: 100, message: 'Budget must be at least 100' },
                    { type: 'max', value: 1000000, message: 'Budget cannot exceed 1,000,000' },
                  ],
                },
                {
                  name: 'notifications',
                  label: 'Enable notifications',
                  type: 'checkbox',
                  defaultValue: true,
                  width: 12,
                },
              ],
            },
            {
              id: 'confirmation',
              title: 'Confirmation',
              description: 'Review and confirm your setup.',
              icon: 'CheckCircle',
              fields: [
                {
                  name: 'acceptTerms',
                  label: 'I accept the terms and conditions',
                  type: 'checkbox',
                  required: true,
                  width: 12,
                  validation: [
                    { type: 'required', message: 'You must accept the terms to continue' },
                  ],
                },
              ],
              children: [
                {
                  type: 'Text',
                  label:
                    'By completing this setup, your account will be configured with the preferences you selected.',
                  muted: true,
                  size: 'sm',
                },
              ],
            },
          ],
        },
      },
    ],
  },

  'add-transaction': {
    code: 'add-transaction',
    title: 'Add Transaction',
    components: [
      {
        type: 'Header',
        width: 12,
        label: 'Add Transaction',
        level: 2,
      },
      {
        type: 'Text',
        width: 12,
        label: 'Enter the details for your new transaction.',
        muted: true,
      },
      {
        type: 'Divider',
        width: 12,
      },
      {
        type: 'FormField',
        width: 12,
        name: 'description',
        label: 'Description',
        placeholder: 'e.g. Grocery shopping',
        fieldType: 'text',
        required: true,
      },
      {
        type: 'FormField',
        width: 6,
        responsiveWidth: { xs: 12 },
        name: 'amount',
        label: 'Amount',
        placeholder: '0.00',
        fieldType: 'number',
        required: true,
      },
      {
        type: 'FormField',
        width: 6,
        responsiveWidth: { xs: 12 },
        name: 'category',
        label: 'Category',
        fieldType: 'select',
        options: [
          { value: 'food', label: 'Food & Dining' },
          { value: 'transport', label: 'Transportation' },
          { value: 'shopping', label: 'Shopping' },
          { value: 'bills', label: 'Bills & Utilities' },
          { value: 'other', label: 'Other' },
        ],
      },
      {
        type: 'Spacer',
        width: 12,
        size: '$3',
      },
      {
        type: 'Row',
        width: 12,
        children: [
          {
            type: 'Button',
            width: 4,
            responsiveWidth: { xs: 6 },
            label: 'Cancel',
            variant: 'outline',
            link: { type: 'SCREEN', code: 'transactions' },
          },
          {
            type: 'Button',
            width: 4,
            responsiveWidth: { xs: 6 },
            label: 'Save Transaction',
            variant: 'primary',
            link: {
              type: 'ACTION',
              action: 'showToast',
              payload: { message: 'Transaction saved!' },
            },
          },
        ],
      },
    ],
  },

  'workflow-demo': {
    code: 'workflow-demo',
    title: 'Workflow Demo',
    components: [
      {
        type: 'Header',
        width: 12,
        label: 'Workflow Demo',
        level: 2,
      },
      {
        type: 'Text',
        width: 12,
        label: 'Dieser Workflow demonstriert alle verfügbaren Formular-Elemente mit Validierung.',
        muted: true,
      },
      {
        type: 'Workflow',
        width: 12,
        config: {
          variant: 'horizontal',
          allowBack: true,
          allowStepClick: false,
          labels: {
            next: 'Weiter',
            back: 'Zurück',
            submit: 'Abschließen',
            cancel: 'Abbrechen',
          },
          onComplete: {
            type: 'SCREEN',
            code: 'home',
          },
          onCancel: {
            type: 'SCREEN',
            code: 'home',
          },
          steps: [
            {
              id: 'personal',
              title: 'Persönliche Daten',
              description: 'Geben Sie Ihre persönlichen Informationen ein.',
              icon: 'User',
              fields: [
                {
                  name: 'fullName',
                  label: 'Vollständiger Name',
                  placeholder: 'Max Mustermann',
                  type: 'text',
                  required: true,
                  width: 6,
                  responsiveWidth: { xs: 12 },
                  validation: [
                    { type: 'required', message: 'Name ist erforderlich' },
                    { type: 'minLength', value: 2, message: 'Mindestens 2 Zeichen erforderlich' },
                  ],
                },
                {
                  name: 'email',
                  label: 'E-Mail-Adresse',
                  placeholder: 'max@beispiel.de',
                  type: 'email',
                  required: true,
                  width: 6,
                  responsiveWidth: { xs: 12 },
                  validation: [
                    { type: 'required', message: 'E-Mail ist erforderlich' },
                    { type: 'email', message: 'Bitte geben Sie eine gültige E-Mail ein' },
                  ],
                },
                {
                  name: 'phone',
                  label: 'Telefonnummer',
                  placeholder: '+49 170 1234567',
                  type: 'tel',
                  width: 6,
                  responsiveWidth: { xs: 12 },
                  validation: [
                    { type: 'phone', message: 'Bitte geben Sie eine gültige Telefonnummer ein' },
                  ],
                },
                {
                  name: 'birthDate',
                  label: 'Geburtsdatum',
                  type: 'date',
                  required: true,
                  width: 6,
                  responsiveWidth: { xs: 12 },
                  validation: [{ type: 'required', message: 'Geburtsdatum ist erforderlich' }],
                },
                {
                  name: 'bio',
                  label: 'Über mich',
                  placeholder: 'Erzählen Sie etwas über sich...',
                  type: 'textarea',
                  width: 12,
                  validation: [
                    { type: 'maxLength', value: 500, message: 'Maximal 500 Zeichen erlaubt' },
                  ],
                },
              ],
            },
            {
              id: 'address',
              title: 'Adresse & Kontakt',
              description: 'Geben Sie Ihre Adressdaten ein.',
              icon: 'MapPin',
              fields: [
                {
                  name: 'street',
                  label: 'Straße und Hausnummer',
                  placeholder: 'Musterstraße 1',
                  type: 'text',
                  required: true,
                  width: 12,
                  validation: [{ type: 'required', message: 'Straße ist erforderlich' }],
                },
                {
                  name: 'zip',
                  label: 'Postleitzahl',
                  placeholder: '10115',
                  type: 'text',
                  required: true,
                  width: 4,
                  responsiveWidth: { xs: 12, sm: 6 },
                  validation: [
                    { type: 'required', message: 'PLZ ist erforderlich' },
                    {
                      type: 'pattern',
                      value: '^\\d{5}$',
                      message: 'Bitte geben Sie eine gültige 5-stellige PLZ ein',
                    },
                  ],
                },
                {
                  name: 'city',
                  label: 'Stadt',
                  placeholder: 'Berlin',
                  type: 'text',
                  required: true,
                  width: 8,
                  responsiveWidth: { xs: 12, sm: 6 },
                  validation: [{ type: 'required', message: 'Stadt ist erforderlich' }],
                },
                {
                  name: 'country',
                  label: 'Land',
                  type: 'select',
                  required: true,
                  width: 6,
                  responsiveWidth: { xs: 12 },
                  options: [
                    { value: 'DE', label: 'Deutschland' },
                    { value: 'AT', label: 'Österreich' },
                    { value: 'CH', label: 'Schweiz' },
                  ],
                  validation: [{ type: 'required', message: 'Land ist erforderlich' }],
                },
                {
                  name: 'website',
                  label: 'Website',
                  placeholder: 'https://www.beispiel.de',
                  type: 'url',
                  width: 6,
                  responsiveWidth: { xs: 12 },
                  validation: [{ type: 'url', message: 'Bitte geben Sie eine gültige URL ein' }],
                },
              ],
            },
            {
              id: 'settings',
              title: 'Einstellungen',
              description: 'Konfigurieren Sie Ihre Einstellungen.',
              icon: 'Settings',
              fields: [
                {
                  name: 'password',
                  label: 'Passwort',
                  placeholder: 'Mindestens 8 Zeichen',
                  type: 'password',
                  required: true,
                  width: 6,
                  responsiveWidth: { xs: 12 },
                  validation: [
                    { type: 'required', message: 'Passwort ist erforderlich' },
                    {
                      type: 'minLength',
                      value: 8,
                      message: 'Passwort muss mindestens 8 Zeichen lang sein',
                    },
                  ],
                },
                {
                  name: 'confirmPassword',
                  label: 'Passwort bestätigen',
                  placeholder: 'Passwort wiederholen',
                  type: 'password',
                  required: true,
                  width: 6,
                  responsiveWidth: { xs: 12 },
                  validation: [
                    { type: 'required', message: 'Passwort-Bestätigung ist erforderlich' },
                    { type: 'minLength', value: 8, message: 'Mindestens 8 Zeichen erforderlich' },
                  ],
                },
                {
                  name: 'language',
                  label: 'Sprache',
                  type: 'radio',
                  required: true,
                  width: 6,
                  responsiveWidth: { xs: 12 },
                  options: [
                    { value: 'de', label: 'Deutsch' },
                    { value: 'en', label: 'English' },
                    { value: 'fr', label: 'Français' },
                  ],
                  validation: [{ type: 'required', message: 'Bitte wählen Sie eine Sprache' }],
                },
                {
                  name: 'budget',
                  label: 'Budget (€)',
                  placeholder: '0',
                  type: 'number',
                  required: true,
                  width: 6,
                  responsiveWidth: { xs: 12 },
                  validation: [
                    { type: 'required', message: 'Budget ist erforderlich' },
                    { type: 'min', value: 0, message: 'Budget darf nicht negativ sein' },
                    { type: 'max', value: 100000, message: 'Budget darf maximal 100.000 betragen' },
                  ],
                },
                {
                  name: 'newsletter',
                  label: 'Newsletter abonnieren',
                  type: 'checkbox',
                  defaultValue: true,
                  width: 6,
                  responsiveWidth: { xs: 12 },
                },
                {
                  name: 'agreeTerms',
                  label: 'Ich stimme den Nutzungsbedingungen zu',
                  type: 'checkbox',
                  required: true,
                  width: 6,
                  responsiveWidth: { xs: 12 },
                  validation: [
                    { type: 'required', message: 'Sie müssen den Nutzungsbedingungen zustimmen' },
                  ],
                },
              ],
            },
            {
              id: 'summary',
              title: 'Zusammenfassung',
              description: 'Überprüfen Sie Ihre Angaben und schließen Sie den Workflow ab.',
              icon: 'CheckCircle',
              fields: [
                {
                  name: 'comments',
                  label: 'Kommentare',
                  placeholder: 'Optionale Anmerkungen...',
                  type: 'textarea',
                  width: 12,
                  validation: [
                    { type: 'maxLength', value: 1000, message: 'Maximal 1000 Zeichen erlaubt' },
                  ],
                },
                {
                  name: 'rating',
                  label: 'Bewertung',
                  type: 'select',
                  required: true,
                  width: 6,
                  responsiveWidth: { xs: 12 },
                  options: [
                    { value: '1', label: '1 Stern' },
                    { value: '2', label: '2 Sterne' },
                    { value: '3', label: '3 Sterne' },
                    { value: '4', label: '4 Sterne' },
                    { value: '5', label: '5 Sterne' },
                  ],
                  validation: [{ type: 'required', message: 'Bitte wählen Sie eine Bewertung' }],
                },
              ],
              children: [
                {
                  type: 'Text',
                  label:
                    'Mit dem Abschließen bestätigen Sie, dass alle Angaben korrekt sind. Sie können jederzeit zurückgehen und Änderungen vornehmen.',
                  muted: true,
                  size: 'sm',
                },
              ],
            },
          ],
        },
      },
    ],
  },
};

/**
 * Fallback configuration used when remote config is unavailable.
 * This provides a working app even when offline or backend is down.
 */
export const fallbackConfig: RemoteAppConfig = {
  ...defaultAppConfig,
  name: 'FinanceApp',
  version: '1.0.0',

  navigation: {
    ...defaultAppConfig.navigation,
    initialRoute: 'home',
    routes: [
      {
        id: 'home',
        path: '/',
        title: 'Home',
        icon: 'Activity',
        screen: 'DynamicScreen',
        screenCode: 'home',
        access: { type: 'authenticated' },
        visibility: { showInTabs: true, showInSidebar: true },
      },
      {
        id: 'budget',
        path: '/budget',
        title: 'Budget',
        icon: 'Calendar',
        screen: 'DynamicScreen',
        screenCode: 'budget',
        access: { type: 'authenticated' },
        visibility: { showInTabs: true, showInSidebar: true },
      },
      {
        id: 'transactions',
        path: '/transactions',
        title: 'Transactions',
        icon: 'List',
        screen: 'DynamicScreen',
        screenCode: 'transactions',
        access: { type: 'authenticated' },
        visibility: { showInTabs: true, showInSidebar: true },
      },
      {
        id: 'accounts',
        path: '/accounts',
        title: 'Accounts',
        icon: 'CreditCard',
        screen: 'DynamicScreen',
        screenCode: 'accounts',
        access: { type: 'authenticated' },
        visibility: { showInTabs: true, showInSidebar: true },
      },
      {
        id: 'add-transaction',
        path: '/add',
        title: 'Add Transaction',
        icon: 'Plus',
        screen: 'DynamicScreen',
        screenCode: 'add-transaction',
        access: { type: 'authenticated' },
        visibility: { showInTabs: false, showInSidebar: false },
      },
      {
        id: 'onboarding',
        path: '/onboarding',
        title: 'Onboarding',
        icon: 'UserPlus',
        screen: 'DynamicScreen',
        screenCode: 'onboarding',
        access: { type: 'authenticated' },
        visibility: { showInTabs: false, showInSidebar: false },
      },
      {
        id: 'qr-scanner',
        path: '/qr-scanner',
        title: 'QR Scanner',
        icon: 'QrCode',
        screen: 'DynamicScreen',
        screenCode: 'qr-scanner',
        access: { type: 'authenticated' },
        featureFlag: 'qrScanner',
        visibility: { showInTabs: false, showInSidebar: true },
      },
      {
        id: 'workflow-demo',
        path: '/workflow-demo',
        title: 'Workflow Demo',
        icon: 'List',
        screen: 'DynamicScreen',
        screenCode: 'workflow-demo',
        access: { type: 'authenticated' },
        visibility: { showInTabs: false, showInSidebar: true },
      },
      {
        id: 'settings',
        path: '/settings',
        title: 'Settings',
        icon: 'Settings',
        screen: 'SettingsScreen',
        access: { type: 'authenticated' },
        visibility: { showInTabs: false, showInSidebar: true },
      },
      {
        id: 'login',
        path: '/login',
        title: 'Login',
        screen: 'LoginScreen',
        layout: 'AuthLayout',
        access: { type: 'public' },
        visibility: { showInTabs: false, showInSidebar: false },
      },
      {
        id: 'auth-callback',
        path: '/auth/callback',
        title: 'Auth Callback',
        screen: 'AuthCallbackScreen',
        layout: 'AuthLayout',
        access: { type: 'public' },
        visibility: { showInTabs: false, showInSidebar: false },
      },
    ],
    tabs: {
      position: 'bottom',
      showLabels: true,
      variant: 'default',
      tabs: [
        { route: 'home', icon: 'Activity' },
        { route: 'budget', icon: 'Calendar' },
        { route: 'transactions', icon: 'List' },
        { route: 'accounts', icon: 'CreditCard' },
      ],
      fab: { route: 'add-transaction', icon: 'Plus' },
    },
    sidebar: {
      header: {
        title: 'FinanceApp',
        showUserInfo: true,
      },
      items: [],
      footer: undefined,
      groups: [
        {
          id: 'main',
          items: [
            { route: 'home', icon: 'Activity' },
            { route: 'budget', icon: 'Calendar' },
            { route: 'transactions', icon: 'List' },
            { route: 'accounts', icon: 'CreditCard' },
          ],
        },
        {
          id: 'tools',
          title: 'Tools',
          items: [
            { route: 'qr-scanner', icon: 'QrCode' },
            { route: 'workflow-demo', icon: 'List' },
          ],
        },
        {
          id: 'settings',
          title: 'Settings',
          items: [{ route: 'settings', icon: 'Settings' }],
        },
      ],
      collapsible: true,
    },
    fallback: {
      notFound: '/',
      unauthorized: '/login',
    },
  },

  screens,

  features: {
    darkMode: true,
    notifications: true,
    analytics: false,
    offlineMode: true,
    qrScanner: true,
    budgetTracking: true,
  },

  theme: {
    primaryColor: '#6366f1',
    secondaryColor: '#a855f7',
    fontFamily: 'Inter',
    darkMode: false,
  },

  api: defaultAppConfig.api,
  auth: defaultAuthConfig,
  i18n: defaultI18nConfig,

  _meta: {
    version: 'fallback-v1',
    fetchedAt: 0,
    expiresAt: Number.MAX_SAFE_INTEGER,
  },
};

/**
 * Get a route definition by ID from the fallback config
 */
export function getRouteById(routeId: string) {
  return fallbackConfig.navigation.routes.find((r) => r.id === routeId);
}

/**
 * Get all routes that should be shown in tabs
 */
export function getTabRoutes() {
  return fallbackConfig.navigation.routes.filter((r) => r.visibility?.showInTabs);
}

/**
 * Get all routes that should be shown in sidebar
 */
export function getSidebarRoutes() {
  return fallbackConfig.navigation.routes.filter((r) => r.visibility?.showInSidebar);
}
