import styled from 'styled-components/macro';
import Popup from '@lectra/popup';
import BasicButton from '@lectra/basicbutton';

export const PopupStyled = styled(Popup)`
  width: auto;
`;

export const Content = styled(Popup.Content)`
  display: flex;
  padding: 0;
`;

export const ApplyButton = styled(BasicButton)`
  margin-right: 10px;
`;

export const Filters = styled.div`
  border-right: 1px solid #ccc;
  cursor: default;
  padding: 20px;
  width: 200px;

  & select {
    cursor: default;
  }
`;

export const FilterTitle = styled.div`
  color: #16a085;
  font-size: 14px;
  margin-bottom: 20px;
`;

export const Filter = styled.div`
  margin: 20px 0 10px 0;
`;

export const ClearFiltersContainer = styled.div`
  margin-top: 30px;
`;

export const Lists = styled.div`
  cursor: default;
  padding: 20px;
`;

export const Message = styled.div`
  color: #808080;
  font-size: 16px;
  margin-bottom: 15px;
`;

export const HorizontalZone = styled.div`
  display: grid;
  grid-column-gap: 20px;
  grid-template-columns: 1fr 1fr;
`;

export const ListTitle = styled.div`
  color: #16a085;
  font-size: 24px;
  font-weight: lighter;
  margin-bottom: 10px;
`;

export const List = styled.div`
  background-color: #f2f2f2;
  border: 1px solid #ccc;
  height: 390px;
  min-height: 390px;
  overflow: auto;
  width: 300px;
`;

export const ItemContent = styled.div<{ selected: boolean; available: boolean }>`
  align-items: center;
  background-color: white;
  border-bottom: 1px solid #ccc;
  color: ${props => (props.available ? 'rgba(0, 0, 0, 1)' : 'rgba(0, 0, 0, 0.3)')};
  display: flex;
  font-size: 14px;
  height: 48px;
  min-height: 48px;
  padding: 0 10px;

  &:hover {
    background-color: #e6e6e6;
  }

  .KUISpanTooltip {
    padding-bottom: 5px;
  }
`;

export const Check = styled.div`
  margin-right: 10px;
`;

export const EmptyCheck = styled.div<{ available: boolean }>`
  background-color: white;
  border: 2px solid #b2b2b2;
  border-radius: 50%;
  height: 20px;
  opacity: ${props => (props.available ? 1 : 0.3)};
  width: 20px;
`;

export const EmptyLabel = styled.div`
  color: #808080;
  font-size: 14px;
  padding: 10px;
`;

export const DeviceContainer = styled.div`
  display: grid;
  font-weight: lighter;
  grid-gap: 10px 20px;
  grid-template-columns: max-content 1fr;
  margin-right: 20px;
`;

export const DeviceName = styled.span`
  font-weight: 600;
`;

export const DeviceButton = styled.div`
  display: flex;
  align-items: center;

  button {
    margin-right: 5px;
  }
`;
