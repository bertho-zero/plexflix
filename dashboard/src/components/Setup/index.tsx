'use client';

import { useState } from 'react';
import Login from './Login';
import Settings from './Settings';

interface SetupProps {
  isLogged?: boolean;
}

export default function Setup({ isLogged = false }: SetupProps) {
  const [currentStep, setCurrentStep] = useState(isLogged ? 2 : 1);

  return (
    <div>
      {currentStep === 1 ? (
        <Login onComplete={() => setCurrentStep(2)} />
      ) : null}
      {currentStep === 2 ? (
        <Settings />
      ) : null}
    </div>
  );
};
