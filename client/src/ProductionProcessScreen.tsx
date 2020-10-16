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
import ValidateMarkerRule from './rules/ValidateMarkerRule';
import AssociateCuttingActivitiesRule from './rules/AssociateCuttingActivitiesRule';
import RollAssignmentRule from './rules/RollAssignmentRule';

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
          <Route exact path="/validate-marker" component={ValidateMarkerRule} />
          <Route exact path="/associate-cutting-requirements" component={AssociateCuttingRequirementsRule} />
          <Route exact path="/associate-cutting-activities" component={AssociateCuttingActivitiesRule} />
          <Route exact path="/after-nesting-roll-allocation" component={RollAssignmentRule} />
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
