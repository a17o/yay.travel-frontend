import React from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";

interface PageContainerProps {
  children: React.ReactNode;
  headerButtons?: React.ReactNode;
  ariaLabel?: string;
}

const PageContainer: React.FC<PageContainerProps> = ({ 
  children, 
  headerButtons, 
  ariaLabel = "Page Interface" 
}) => {
  return (
    <Card 
      className="max-w-xl w-[32rem] h-[200vh] min-h-[800px] max-h-[800px] glassmorphic-card pt-10 pb-4 px-4 flex flex-col items-center gap-4 shadow-2xl border-0 font-telegraph bg-white/70 backdrop-blur-xl" 
      role="region" 
      aria-label={ariaLabel}
    >
      <CardContent className="w-full h-full flex flex-col items-center gap-4 p-0">
        <header className="w-full flex flex-col items-center mb-2 gap-2">
          <img src="/yay-logo-square.png" alt="Yay logo" className="w-24 h-24" />
          <div className="text-2xl font-bold font-lilita text-center">yay.travel</div>
          {/* Always reserve space for buttons to prevent layout shifts */}
          <div className="flex items-center justify-center gap-2">
            {headerButtons}
          </div>
        </header>
        <div className="w-full flex-1 flex flex-col overflow-y-auto">
          {children}
        </div>
      </CardContent>
    </Card>
  );
};

export default PageContainer; 