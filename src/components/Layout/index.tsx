import React, { memo } from 'react';
import './styles.css';

/**
 * Common layout for all app pages
 */
export const Layout = memo(({ children }: React.PropsWithChildren) => {
  return (
    <>
      <header>
        <h1>Click the Fox! Game</h1>
      </header>
      <main>{children}</main>
    </>
  );
});
