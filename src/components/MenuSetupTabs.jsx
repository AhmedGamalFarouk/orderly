import React from 'react';

const MenuSetupTabs = ({ menuOption, setMenuOption }) => {
  return (
    <div role="tablist" className="tabs tabs-lifted w-full">
      <button
        type="button"
        role="tab"
        className={`tab font-body text-lg ${menuOption === 'createNew' ? 'tab-active bg-primary text-primary-content' : 'bg-base-200 text-neutral'}`}
        onClick={() => setMenuOption('createNew')}
      >
        Create New Menu
      </button>
      <button
        type="button"
        role="tab"
        className={`tab font-body text-lg ${menuOption === 'useFavourite' ? 'tab-active bg-primary text-primary-content' : 'bg-base-200 text-neutral'}`}
        onClick={() => setMenuOption('useFavourite')}
      >
        Use Favourite Menu
      </button>
    </div>
  );
};

export default MenuSetupTabs;
