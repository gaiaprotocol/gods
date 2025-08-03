import { createConnectButton, createRainbowKit } from '@gaiaprotocol/client-common';

document.body.appendChild(createRainbowKit());
document.querySelector('.connect-button-container')?.append(createConnectButton());
