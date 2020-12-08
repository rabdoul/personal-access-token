import React, { ReactNode, useEffect, useContext, useState } from 'react';
import Tooltip from '@lectra/tooltip';
import BasicButton from '@lectra/basicbutton';
import CheckBox from '@lectra/checkbox';
import { fetchData } from 'raspberry-fetch';

import { AuthenticationContext } from './Authentication';
import { UserPreferenceContext } from './UserPreference';
import styled from 'styled-components';
import Select from '@lectra/select';

export type Help = {
  isActive: boolean;
  aliases: Record<string, string>;
};

export const HelpContext = React.createContext<Help>({
  isActive: false,
  aliases: {}
});

const HelpProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const token = useContext(AuthenticationContext).accessToken();
  const lectraLocale = useContext(UserPreferenceContext).lectraLocale;
  const [aliases, setAliases] = useState<Record<string, string>>({});
  const [isActive, setActive] = useState<boolean>(false);

  useEffect(() => {
    fetchData(token, `help?lang=${lectraLocale.code.toUpperCase()}`).then(aliases => setAliases(aliases));
  }, [token, lectraLocale]);

  useEffect(() => {
    const helpActionListener = ((e: CustomEvent) => {
      setActive(e.detail.active);
    }) as EventListener;
    document.addEventListener('HELP_MODE', helpActionListener);
    return () => document.removeEventListener('HELP_MODE', helpActionListener);
  }, [isActive]);

  return <HelpContext.Provider value={{ isActive, aliases }}>{children}</HelpContext.Provider>;
};

export const useHelpUrls = (...keys: string[]) => {
  const context = useContext<Help>(HelpContext);
  return context.isActive ? keys.map(key => context.aliases[key]) : [];
};

interface WithHelpTooltipProps {
  helpUrl?: string;
}

export const withHelpTooltip = <P extends object>(Component: React.ComponentType<P>): React.FC<P & WithHelpTooltipProps> => ({ helpUrl, ...props }: WithHelpTooltipProps) => {
  if (!helpUrl) {
    return <Component {...(props as P)} />;
  }

  return (
    <StyledTooltip placement="bottom-start" duration={800} tippyProps={{ interactive: true }} content={<iframe id="frame" title="frame" src={helpUrl} frameBorder="0" />}>
      <Component {...(props as P)} />
    </StyledTooltip>
  );
};

export default HelpProvider;

const StyledTooltip = styled(Tooltip)`
  max-width: 500px !important;
  width: 500px;
`;

export const ButtonWithHelpTooltip = withHelpTooltip(BasicButton);
export const LabelWithHelpTooltip = withHelpTooltip((props: any) => <label {...props} data-xhelp="online-help" />);
export const CheckBoxWithHelpTooltip = withHelpTooltip(CheckBox);
export const SelectWithHelpTooltip = withHelpTooltip(Select);
