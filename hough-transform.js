/**
 Hough Transform in JavaScript

 Copyright 2012 Guillaume Marty

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.

 ADAPTED BY Hannah Dee 2014 to show details of Rho and Theta in
 the visualisation, and to have a larger canvas to experiment with
 hmd1@aber.ac.uk/hmd@hannahdee.eu
*/

'use strict';

var THICKNESS = 2;

var $drawing = document.getElementById('drawing');
var $houghSp = document.getElementById('houghSp');

var ctx = $drawing.getContext('2d');
var HSctx = $houghSp.getContext('2d');

var drawingMode = false;

var drawingWidth = $drawing.width;
var drawingHeight = $drawing.height;

var numAngleCells = 360;
var rhoMax = Math.sqrt(drawingWidth * drawingWidth + drawingHeight * drawingHeight);
var accum = Array(numAngleCells);

// Set the size of the Hough space.
var border = 20;
$houghSp.width = numAngleCells+border+border;
$houghSp.height = rhoMax+border+border;

HSctx.fillStyle = 'rgba(0,0,0,.5)';
HSctx.strokeStyle = 'rgba(0,0,0,.5)';

HSctx.beginPath();
HSctx.moveTo(border,border);
HSctx.lineTo(border,rhoMax+border);
HSctx.lineTo(numAngleCells+border,rhoMax+border);
HSctx.stroke();

HSctx.font="10px Arial";
HSctx.fillText("Rho",5,border);
HSctx.fillText("Theta",numAngleCells,rhoMax+border+border/2);

HSctx.fillStyle = 'rgba(0,0,0,.1)';


function drawInHough(rho,thetaIndex) {

    HSctx.beginPath();
    HSctx.fillRect(thetaIndex+border, rho, 1, 1);
    HSctx.closePath();
}

$drawing.addEventListener('mousedown', function() {
  drawingMode = true;
});
$drawing.addEventListener('mouseup', function() {
  drawingMode = false;
});
$drawing.addEventListener('mouseout', function() {
  drawingMode = false;
});
$drawing.addEventListener('mousemove', function(e) {
  if (drawingMode) {
    var rect=drawing.getBoundingClientRect();
    var	x= (e.clientX-rect.left)/(rect.right-rect.left)*drawing.width;
    var	y= (e.clientY-rect.top)/(rect.bottom-rect.top)*drawing.height;
    ctx.beginPath();
    ctx.fillRect(x - (THICKNESS / 2), y - (THICKNESS / 2), THICKNESS, THICKNESS);
    ctx.closePath();

    houghAcc(x, y);
  }

});

// Precalculate tables.
var cosTable = Array(numAngleCells);
var sinTable = Array(numAngleCells);
for (var theta = 0, thetaIndex = 0; thetaIndex < numAngleCells; theta += Math.PI / numAngleCells, thetaIndex++) {
  cosTable[thetaIndex] = Math.cos(theta);
  sinTable[thetaIndex] = Math.sin(theta);
}

// Implementation with lookup tables.
function houghAcc(x, y) {
  var rho;
  var thetaIndex = 0;
  x -= drawingWidth / 2;
  y -= drawingHeight / 2;
  for (; thetaIndex < numAngleCells; thetaIndex++) {
    rho = rhoMax + x * cosTable[thetaIndex] + y * sinTable[thetaIndex];
    rho >>= 1;
    if (accum[thetaIndex] == undefined) accum[thetaIndex] = [];
    if (accum[thetaIndex][rho] == undefined) {
      accum[thetaIndex][rho] = 1;
    } else {
      accum[thetaIndex][rho]++;
    }
    drawInHough(rho,thetaIndex);

  }
}

// Classical implementation.
function houghAccClassical(x, y) {
  var rho;
  var theta = 0;
  var thetaIndex = 0;
  x -= drawingWidth / 2;
  y -= drawingHeight / 2;
  for (; thetaIndex < numAngleCells; theta += Math.PI / numAngleCells, thetaIndex++) {
    rho = rhoMax + x * Math.cos(theta) + y * Math.sin(theta);
    rho >>= 1;
    if (accum[thetaIndex] == undefined) accum[thetaIndex] = [];
    if (accum[thetaIndex][rho] == undefined) {
      accum[thetaIndex][rho] = 1;
    } else {
      accum[thetaIndex][rho]++;
    }
    drawInHough(rho,thetaIndex);
  }
}
