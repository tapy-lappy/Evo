// import 'reflect-metadata'   //must be first in list to prevent error: Cannot resolve all parameters for 'Parser'(?).... ==> https://github.com/angular/angular/issues/13609
// require('zone.js/dist/zone');          //Error: Angular requires Zone.js prolyfill

// Angular - this file only imports the application's third-party modules
import '@angular/platform-browser';
import '@angular/platform-browser-dynamic';
import '@angular/core';
import '@angular/common';
import '@angular/http';
import '@angular/router';
import '@angular/forms';



// RxJS
import 'rxjs';

// Other vendors for example jQuery, Lodash or Bootstrap
// You can import js, ts, css, sass, ...