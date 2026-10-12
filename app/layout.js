import './globals.css';

export const metadata = {
  title: 'Zeon DealBridge | Investment Banking Workspace',
  description: 'A workflow prototype for seller leads, investor matching, blind outreach, readiness, and deal closeout.',
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg'
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
