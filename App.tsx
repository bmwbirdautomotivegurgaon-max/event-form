import React from 'react';
import { HeroPanel } from './components/HeroPanel';
import { RegistrationForm } from './components/RegistrationForm';

const App: React.FC = () => {
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white lg:overflow-hidden">
      <HeroPanel />
      <RegistrationForm />
    </div>
  );
};

export default App;