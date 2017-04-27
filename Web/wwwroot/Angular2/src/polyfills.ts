/////<reference path="../../../node_modules/@types/node/index.d.ts"/>

import 'reflect-metadata'
import 'core-js/es6';
import 'core-js/es7/reflect';
import 'es6-shim'
require('zone.js/dist/zone'); 

 if (process.env.ENV === 'production') {
   // Production
 } else {
  // Development and test
  Error['stackTraceLimit'] = Infinity; 
  require('zone.js/dist/long-stack-trace-zone');
}