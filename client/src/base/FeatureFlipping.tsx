import React, { ReactNode, useContext, useEffect, useState } from 'react';
import { FlagsProvider } from '@lectra/ld-react-feature-flags';

import { AuthenticationContext } from './Authentication';

type FFConfig = {
  clientKey: string;
};

export function useFFConfig(): FFConfig | undefined {
  const [config, setConfig] = useState<FFConfig>();

  useEffect(() => {
    (async () => {
      const res = await fetch('/feature-flipping-config');
      const config = await res.json();
      const configFeatureFlipping = {
        clientKey: config.clientKey
      };
      setConfig(configFeatureFlipping);
    })();
  }, []);

  return config;
}

const FeatureFlippingProvider = (props: { children: ReactNode }) => {
  const userKey = useContext(AuthenticationContext).user().sub;
  const clientKey = useFFConfig()?.clientKey;

  return clientKey ? (
    <FlagsProvider user={{ key: userKey }} clientkey={clientKey}>
      {props.children}
    </FlagsProvider>
  ) : (
    <></>
  );
};

export default FeatureFlippingProvider;
