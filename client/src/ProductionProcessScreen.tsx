import React, { useContext } from 'react';
import styled from 'styled-components';
import Ribbon from '@lectra/embed-ribbon';
import { Switch, Route } from 'react-router-dom';

import { Help, HelpContext } from './base/Help';
import ActivityList from './activities/ActivityList';
import SequencingRule from './rules/SequencingRule';
import StepDescription from './rules/common/StepDescription';
import useRibbonConfig from './ribbon/useRibbonConfig';
import useRibbonListener from './ribbon/useRibbonListener';
import Notifier from './Notification';
import ValidateMTMProductRule from './rules/ValidateMTMProductRule';
import AssociateCuttingRequirementsRule from './rules/AssociateCuttingRequirementsRule';
import { PublishRule } from './rules/PublishRule';

const ProductionProcessScreen = () => {
  useRibbonListener();
  const { aliases } = useContext<Help>(HelpContext);
  const config = useRibbonConfig(aliases);
  return (
    <Screen>
      <Notifier />
      <Ribbon config={config} />
      <Content>
        <ActivityList />
        <Switch>
          <Route exact path="/setup-sequencing" component={SequencingRule} />
          <Route exact path="/validate-mtm-product" component={ValidateMTMProductRule} />
          <Route exact path="/associate-cutting-requirements" component={AssociateCuttingRequirementsRule} />
          <Route exact path="/publish" component={PublishRule} />
          <Route
            path="/:activityId"
            render={() => (
              <div style={{ padding: '20px' }}>
                <StepDescription />
              </div>
            )}
          />
        </Switch>
      </Content>
    </Screen>
  );
};

const Screen = styled.div`
  height: 100%;
`;

const Content = styled.div`
  display: flex;
  height: 100%;
`;

export default ProductionProcessScreen;
