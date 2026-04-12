#!/usr/bin/env node
import React from 'react';
import { render } from 'ink';
import { App } from './app.js';
import { getConfig } from './config.js';
const config = getConfig();
render(React.createElement(App, { url: config.url, interval: config.interval }));
//# sourceMappingURL=cli.js.map