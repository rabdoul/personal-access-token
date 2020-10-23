import React, { useContext } from 'react';
import { Switch, Route } from 'react-router-dom';
import styled from 'styled-components';
import Ribbon from '@lectra/embed-ribbon';
import { Flags } from '@lectra/ld-react-feature-flags';

import { Help, HelpContext } from './base/Help';
import ActivityList from './activities/ActivityList';
import StepDescription from './rules/common/StepDescription';
import useRibbonConfig from './ribbon/useRibbonConfig';
import useRibbonListener from './ribbon/useRibbonListener';
import Notifier from './Notification';
import SequencingRule from './rules/SequencingRule';
import ValidateMTMProductRule from './rules/ValidateMTMProductRule';
import AssociateCuttingRequirementsRule from './rules/AssociateCuttingRequirementsRule';
import PublishRule from './rules/PublishRule';
import ValidateMarkerRule from './rules/ValidateMarkerRule';
import AssociateCuttingActivitiesRule from './rules/AssociateCuttingActivitiesRule';
import RollAssignmentRule from './rules/RollAssignmentRule';
import GenerateSectionPlanRule from './rules/GenerateSectionPlanRule';
import GenerateBatchRule from './rules/GenerateBatchRule';
import GenerateSpreadingPlanRule from './rules/GenerateSpreadingPlanRule';
import OffloadingRule from './rules/OffloadingRule';
import AffectCuttingLineRule from './rules/AffectCuttingLineRule';
import GenerateCuttingOrderRule from './rules/GenerateCuttingOrderRule';
import GenerateCuttingOrderODRule from './rules/GenerateCuttingOrderODRule';
import MaterialValidationRule from './rules/MaterialValidationRule';
import GenerateMarkerRule from './rules/GenerateMarkerRule';

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
          <Route exact path="/generate-batch" component={GenerateBatchRule} />
          <Route exact path="/generate-marker" component={GenerateMarkerRule} />
          <Route exact path="/validate-marker" component={ValidateMarkerRule} />
          <Route exact path="/associate-cutting-requirements" component={AssociateCuttingRequirementsRule} />
          <Route exact path="/associate-cutting-activities" component={AssociateCuttingActivitiesRule} />
          <Route exact path="/publish" component={PublishRule} />
          <Route exact path="/after-nesting-roll-allocation" component={RollAssignmentRule} />
          <Route exact path="/generate-section-plan" component={GenerateSectionPlanRule} />
          <Route
            exact
            path="/generate-cutting-order"
            render={() => (
              <Flags flag="massprod-workflow-enabled" fallbackRender={() => <GenerateCuttingOrderODRule />}>
                <GenerateCuttingOrderRule />
              </Flags>
            )}
          />
          <Route exact path="/generate-spreading-plan" component={GenerateSpreadingPlanRule} />
          <Route exact path="/assist-offloading" component={OffloadingRule} />
          <Route exact path="/affect-cutting-line" component={AffectCuttingLineRule} />
          <Route exact path="/validate-marker-width" component={MaterialValidationRule} />
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
