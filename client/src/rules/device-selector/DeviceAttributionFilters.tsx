import React, { Dispatch } from 'react';
import { useIntl } from 'react-intl';
import BasicButton from '@lectra/basicbutton';
import Select from '@lectra/select';
import SpanTooltip from '@lectra/spantooltip';
import { PopupFilters } from './DeviceAttribution';
import { ClearFiltersContainer, Filter, Filters, FilterTitle } from './styles';
import { CuttingRoom } from '../AssignDeviceRule';

type DeviceAttributionFiltersProps = { filters: PopupFilters; setFilters: Dispatch<PopupFilters>; cuttingRoom: CuttingRoom };

const DeviceAttributionFilters: React.FC<DeviceAttributionFiltersProps> = ({ filters, setFilters, cuttingRoom }) => {
  const { formatMessage } = useIntl();

  const allArray = [{ label: formatMessage({ id: 'common.label.all' }), value: 'all' }];

  const backlogItems = allArray.concat(cuttingRoom.backlogs);
  const spreaderGroupItems = allArray.concat(cuttingRoom.spreaderGroups);
  const cutterGroupItems = allArray.concat(cuttingRoom.cutterGroups);

  const isResetDisabled = () => {
    return filters.filterBacklog === 'all' && filters.filterCutterGroup === 'all' && filters.filterSpreaderGroup === 'all';
  };

  return (
    <Filters>
      <FilterTitle>
        <SpanTooltip text={formatMessage({ id: 'common.label.filters' })} />
      </FilterTitle>
      <Filter>
        <SpanTooltip text={formatMessage({ id: 'common.label.backlogs' })} />
      </Filter>
      <Select
        data-xlabel="backlog-filter"
        value={filters.filterBacklog}
        listItems={backlogItems}
        width={160}
        onChange={(item: any) => setFilters({ ...filters, filterBacklog: item.value })}
      />
      <Filter>
        <SpanTooltip text={formatMessage({ id: 'common.label.spreader.groups' })} />
      </Filter>
      <Select
        data-xlabel="spreader-group-filter"
        value={filters.filterSpreaderGroup}
        listItems={spreaderGroupItems}
        width={160}
        onChange={(item: any) => setFilters({ ...filters, filterSpreaderGroup: item.value })}
      />
      <Filter>
        <SpanTooltip text={formatMessage({ id: 'common.label.cutter.groups' })} />
      </Filter>
      <Select
        data-xlabel="cutter-group-filter"
        value={filters.filterCutterGroup}
        listItems={cutterGroupItems}
        width={160}
        onChange={(item: any) => setFilters({ ...filters, filterCutterGroup: item.value })}
      />
      <ClearFiltersContainer>
        <BasicButton
          type="white"
          width={160}
          disabled={isResetDisabled()}
          onClick={() => {
            if (!isResetDisabled()) setFilters({ filterBacklog: 'all', filterSpreaderGroup: 'all', filterCutterGroup: 'all' });
          }}
          xlabel="clear-filters"
        >
          {formatMessage({ id: 'common.label.clear.filters' })}
        </BasicButton>
      </ClearFiltersContainer>
    </Filters>
  );
};

export default DeviceAttributionFilters;
