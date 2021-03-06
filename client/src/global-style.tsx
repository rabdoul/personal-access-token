import * as styled from 'styled-components';

const GlobalStyle = styled.createGlobalStyle`
  @font-face {
    font-family: 'Open Sans';
    src: url('https://assets.mylectra.com/fonts/OpenSans-Regular.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Open Sans';
    src: url('https://assets.mylectra.com/fonts/OpenSans-Italic.ttf') format('truetype');
    font-weight: normal;
    font-style: italic;
    font-display: swap;
  }

  @font-face {
    font-family: 'Open Sans';
    src: url('https://assets.mylectra.com/fonts/OpenSans-Light.ttf') format('truetype');
    font-weight: 300;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Open Sans';
    src: url('https://assets.mylectra.com/fonts/OpenSans-LightItalic.ttf') format('truetype');
    font-weight: 300;
    font-style: italic;
    font-display: swap;
  }

  @font-face {
    font-family: 'Open Sans';
    src: url('https://assets.mylectra.com/fonts/OpenSans-SemiBold.ttf') format('truetype');
    font-weight: 600;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Open Sans';
    src: url('https://assets.mylectra.com/fonts/OpenSans-SemiBold.ttf') format('truetype');
    font-weight: 700;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Open Sans';
    src: url('https://assets.mylectra.com/fonts/OpenSans-SemiBoldItalic.ttf') format('truetype');
    font-weight: 600;
    font-style: italic;
    font-display: swap;
  }

  @font-face {
    font-family: 'Open Sans';
    src: url('https://assets.mylectra.com/fonts/OpenSans-Bold.ttf') format('truetype');
    font-weight: bold;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Open Sans';
    src: url('https://assets.mylectra.com/fonts/OpenSans-BoldItalic.ttf') format('truetype');
    font-weight: bold;
    font-style: italic;
    font-display: swap;
  }

  @font-face {
    font-family: 'Open Sans';
    src: url('https://assets.mylectra.com/fonts/OpenSans-ExtraBold.ttf') format('truetype');
    font-weight: 900;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Open Sans';
    src: url('https://assets.mylectra.com/fonts/OpenSans-ExtraBoldItalic.ttf') format('truetype');
    font-weight: 900;
    font-style: italic;
    font-display: swap;
  }

  * {
    box-sizing: border-box;
    margin: 0;
  }

  html body {
    font-family: 'Segoe UI', 'Open Sans', sans-serif;
    font-size: 14px;
    background-color: #fff;
    overflow: hidden;
  }

  #root {
    bottom: 0;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    height: 100vh;
  }

  ::-webkit-scrollbar {
    width: 7px;
    height: 7px;
  }

  ::-webkit-scrollbar-corner {
    background-color: transparent;
  }

  ::-webkit-scrollbar-track {
    border-radius: 10px;
    background-color: rgba(45, 49, 51, 0.1);
  }

  ::-webkit-scrollbar-thumb:vertical {
    border-radius: 25px;
    background: black url('/assets/scroll.png') no-repeat center;
    background-size: 4px;
  }

  ::-webkit-scrollbar-thumb:vertical:hover {
    background: black url('/assets/scroll.png') no-repeat center;
    background-size: 4px;
  }

  ::-webkit-scrollbar-thumb:horizontal {
    border-radius: 25px;
    background: black url('/assets/scroll_horizontal.png') no-repeat center;
    background-size: 4px;
  }

  ::-webkit-scrollbar-thumb:horizontal:hover {
    background: black url('/assets/scroll_horizontal.png') no-repeat center;
    background-size: 4px;
  }

  ::-webkit-scrollbar-button:start:decrement,
  ::-webkit-scrollbar-button:end:increment {
    height: 13px;
    width: 7px;
    display: block;
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
  }

  ::-webkit-scrollbar-button:end:increment {
    background-image: url('/assets/arrow_down.png');
  }

  ::-webkit-scrollbar-button:start:decrement {
    background-image: url('/assets/arrow_up.png');
  }

  ::-webkit-scrollbar-button:end:horizontal:increment {
    background-image: url('/assets/arrow_right.png');
    background-position: right;
  }

  ::-webkit-scrollbar-button:start:horizontal:decrement {
    background-image: url('/assets/arrow_left.png');
    background-position: left;
  }
`;

export const Title = styled.default.div<{ weight?: string }>`
  color: #16a085;
  font-size: 24px;
  font-weight: ${props => props.weight ?? 'lighter'};
  margin-bottom: 20px;
`;

export default GlobalStyle;
