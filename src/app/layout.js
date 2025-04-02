import './globals.css';

export const metadata = {
  title: 'Expense Tracker',
  description: 'Track your expenses with Google Sheets integration',
  manifest: '/manifest.json',
  themeColor: '#22223b',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  appleMobileWebAppCapable: 'yes',
  appleMobileWebAppStatusBarStyle: 'black-translucent'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}