import React, { Dispatch } from 'react';
import { useIntl } from 'react-intl';
import uniqBy from 'lodash/unionBy';
import Icon from '@lectra/icon';
import SpanTooltip from '@lectra/spantooltip';
import { CuttingRoom, DeviceItem } from '../AffectCuttingLineRule';
import { Check, EmptyCheck, EmptyLabel, HorizontalZone, ItemContent, List, Lists, ListTitle, Message } from './styles';
import { AttributionState, PopupFilters } from './DeviceAttribution';

type DeviceAttributionListsProps = { attributionState: AttributionState; setAttributionState: Dispatch<AttributionState>; filters: PopupFilters; cuttingRoom: CuttingRoom };

const DeviceAttributionLists: React.FC<DeviceAttributionListsProps> = ({ attributionState, setAttributionState, filters, cuttingRoom }) => {
  const { formatMessage } = useIntl();
  const [filteredCutters, setFilteredCutters] = React.useState<DeviceItem[]>([]);
  const [filteredSpreaders, setFilteredSpreaders] = React.useState<DeviceItem[]>([]);

  const filterDevices = (filterValue: string, devicesArray: DeviceItem[]) => {
    if (filterValue !== 'all') {
      return devicesArray.filter(device => device.groupId === filterValue);
    }
    return devicesArray;
  };

  React.useEffect(() => {
    const updateFiltersValues = (cutters: DeviceItem[], spreaders: DeviceItem[]) => {
      setFilteredCutters(filterDevices(filters.filterCutterGroup, cutters));
      setFilteredSpreaders(filterDevices(filters.filterSpreaderGroup, spreaders));
    };

    if (filters.filterBacklog === 'all') {
      updateFiltersValues(
        uniqBy(
          cuttingRoom.backlogs.flatMap(backlog => backlog.cutters),
          'value'
        ),
        uniqBy(
          cuttingRoom.backlogs.flatMap(backlog => backlog.spreaders),
          'value'
        )
      );
    } else {
      const backlogItems = cuttingRoom.backlogs.find(backlogItem => backlogItem.value === filters.filterBacklog);

      if (backlogItems) {
        updateFiltersValues(backlogItems.cutters, backlogItems.spreaders);
      } else {
        setFilteredCutters([]);
        setFilteredSpreaders([]);
      }
    }
  }, [filters, cuttingRoom]);

  const isDeviceAvailable = (deviceItem: DeviceItem, type: string) => {
    if (type === 'cutter') {
      const availableSpreaders = cuttingRoom.pairings.filter(pair => pair.to === deviceItem.value).map(availablePair => availablePair.from);
      return attributionState.selectedSpreader ? availableSpreaders.includes(attributionState.selectedSpreader) : true;
    } else {
      const availableCutters = cuttingRoom.pairings.filter(pair => pair.from === deviceItem.value).map(availablePair => availablePair.to);
      return attributionState.selectedCutter ? availableCutters.includes(attributionState.selectedCutter) : true;
    }
  };

  return (
    <Lists>
      <Message>{formatMessage({ id: 'common.allocation.message' })}</Message>
      <HorizontalZone>
        <div>
          <ListTitle>
            <SpanTooltip text={formatMessage({ id: 'common.allocation.spreaders' })} />
          </ListTitle>
          <List>
            {filteredSpreaders.length > 0 ? (
              filteredSpreaders.map((spreaderItem: DeviceItem, index: number) => (
                <ItemElement
                  key={`spreader-${index}`}
                  available={isDeviceAvailable(spreaderItem, 'spreader')}
                  item={spreaderItem}
                  selected={spreaderItem.value === attributionState.selectedSpreader}
                  onClick={spreaderItem =>
                    setAttributionState({ ...attributionState, selectedSpreader: attributionState.selectedSpreader === spreaderItem.value ? undefined : spreaderItem.value })
                  }
                />
              ))
            ) : (
              <EmptyLabel>{formatMessage({ id: 'common.allocation.empty.spreaders' })}</EmptyLabel>
            )}
          </List>
        </div>
        <div>
          <ListTitle>
            <SpanTooltip text={formatMessage({ id: 'common.allocation.cutters' })} />
          </ListTitle>
          <List>
            {filteredCutters.length > 0 ? (
              filteredCutters.map((cutterItem: DeviceItem, index: number) => (
                <ItemElement
                  key={`cutter-${index}`}
                  available={isDeviceAvailable(cutterItem, 'cutter')}
                  item={cutterItem}
                  selected={cutterItem.value === attributionState.selectedCutter}
                  onClick={cutterItem =>
                    setAttributionState({ ...attributionState, selectedCutter: attributionState.selectedCutter === cutterItem.value ? undefined : cutterItem.value })
                  }
                />
              ))
            ) : (
              <EmptyLabel>{formatMessage({ id: 'common.allocation.empty.cutters' })}</EmptyLabel>
            )}
          </List>
        </div>
      </HorizontalZone>
    </Lists>
  );
};

export default DeviceAttributionLists;

const ItemElement: React.FC<{ item: DeviceItem; selected: boolean; onClick: (item: DeviceItem) => void; available: boolean }> = ({ item, available, selected, onClick }) => {
  return (
    <ItemContent
      data-xname={item.label}
      data-available={available}
      selected={selected}
      available={available}
      onClick={() => {
        if (available) {
          onClick(item);
        }
      }}
    >
      <Check data-selected={selected}>{selected ? <Icon type="default" color="#2980B9" size={20} /> : <EmptyCheck available={available} />}</Check>
      <SpanTooltip text={item.label} />
    </ItemContent>
  );
};
