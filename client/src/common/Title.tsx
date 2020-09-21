import styled from 'styled-components';

const Title = styled.div<{ weight?: string }>`
  color: #16a085;
  font-size: 24px;
  font-weight: ${props => props.weight ?? 'lighter'};
  margin-bottom: 20px;
`;

export default Title;
