import './globals.css';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <html lang="ja">
      <head>
        <title>宇宙物理学クイズアプリ</title>
      </head>
      <body>
        <div className="container mx-auto p-4">
          {children}
        </div>
      </body>
    </html>
  );
};

export default Layout;
