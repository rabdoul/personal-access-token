import { renderHook } from '@testing-library/react-hooks';
import React, { ReactNode } from 'react';
import { HelpContext, Help, useHelpUrls } from '../Help';

describe('HelpProvider', () => {
  const StaticHelpProvider: React.FC<{ children: ReactNode; help: Help }> = ({ children, help }) => {
    return <HelpContext.Provider value={help}>{children}</HelpContext.Provider>;
  };

  describe('useHelpUrl', () => {
    it('should return empty array if help is not active', () => {
      const wrapper: React.FC = ({ children }) => (
        <StaticHelpProvider
          help={{
            isActive: false,
            aliases: {
              PARAMS_DISPLAY: 'https://help.dev.mylectra.com/help/systemmanager/FR/Content/03-Parametres-Avances/01-Afficher.htm'
            }
          }}
        >
          {children}
        </StaticHelpProvider>
      );

      const { result } = renderHook(() => useHelpUrls('PARAMS_TAB'), { wrapper });
      expect(result.current).toEqual([]);
    });

    it('should return tooltipUrl if help is active and key exists', () => {
      const wrapper: React.FC = ({ children }) => (
        <StaticHelpProvider
          help={{
            isActive: true,
            aliases: {
              PARAMS_DISPLAY: 'https://help.dev.mylectra.com/help/systemmanager/FR/Content/03-Parametres-Avances/01-Afficher.htm'
            }
          }}
        >
          {children}
        </StaticHelpProvider>
      );

      const { result } = renderHook(() => useHelpUrls('PARAMS_DISPLAY'), { wrapper });
      expect(result.current).toEqual(['https://help.dev.mylectra.com/help/systemmanager/FR/Content/03-Parametres-Avances/01-Afficher.htm']);
    });

    it('should return empty array if help is active but no key', () => {
      const wrapper: React.FC = ({ children }) => (
        <StaticHelpProvider
          help={{
            isActive: false,
            aliases: {
              PARAMS_DISPLAY: 'https://help.dev.mylectra.com/help/systemmanager/FR/Content/03-Parametres-Avances/01-Afficher.htm'
            }
          }}
        >
          {children}
        </StaticHelpProvider>
      );

      const { result } = renderHook(() => useHelpUrls('PARAMS_TAB'), { wrapper });
      expect(result.current).toEqual([]);
    });
  });
});
