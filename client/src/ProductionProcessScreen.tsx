import React from 'react';
import styled from 'styled-components';
import Ribbon from '@lectra/embed-ribbon';
import { Switch, Route } from 'react-router-dom';

import ActivityList from './activities/ActivityList';
import SequencingRule from './rules/SequencingRule';
import StepDescription from './rules/StepDescription';
import useRibbonConfig from './ribbon/useRibbonConfig';
import useRibbonListener from './ribbon/useRibbonListener';
import Notifier from './Notification';
import { useUIDispatch } from './UIState';
import ValidateMTMProductRule from './rules/ValidateMTMProductRule';

const ProductionProcessScreen = () => {
  useRibbonListener();
  const config = useRibbonConfig();
  const dispatch = useUIDispatch();

  return (
    <Screen>
      <Notifier dispatch={dispatch} />
      <Ribbon config={config} />
      <Content>
        <ActivityList />
        <Switch>
          <Route exact path="/setup-sequencing" component={SequencingRule} />
          <Route exact path="/validate-mtm-product" component={ValidateMTMProductRule} />
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
