import React, { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            <div>
                <Header />
                <div className="layout-content">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Layout;
