import React from 'react';
import styled from 'styled-components';
import Ribbon from '@lectra/embed-ribbon';
import { Switch, Route } from 'react-router-dom';

import ActivityList from './activities/ActivityList';
import SequencingRules from './rules/SequencingRules';
import StepDescription from './rules/StepDescription';
import useRibbonConfig from './ribbon/useRibbonConfig';

const ProductionProcessScreen = () => {
  let config = useRibbonConfig();
  return (
    <Screen>
      <Ribbon config={config} />
      <Content>
        <ActivityList />
        <Switch>
          <Route exact path="/setup-sequencing" component={SequencingRules} />
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
