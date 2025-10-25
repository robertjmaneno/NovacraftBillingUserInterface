import React, { createContext, useContext, useState, useEffect } from 'react';

interface SidebarContextType {
  isOpen: boolean;
  isMobile: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  openSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

interface SidebarProviderProps {
  children: React.ReactNode;
}

export const SidebarProvider: React.FC<SidebarProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if screen is mobile size
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024; // lg breakpoint (1024px)
      setIsMobile(mobile);
      
      // On desktop, sidebar should be open by default
      if (!mobile) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    // Check on mount and window resize
    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);
  const openSidebar = () => setIsOpen(true);

  const value = {
    isOpen,
    isMobile,
    toggleSidebar,
    closeSidebar,
    openSidebar
  };

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
};