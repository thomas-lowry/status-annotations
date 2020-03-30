'use strict';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

//vars
let uiWidth = 184; // default ui width
let uiHeight = 210; // default ui height
let spacing = 8; // spacing of annotations from top of frame
let page = figma.currentPage;
let updateCount = 0;
let removeCount = 0;
cleanUp();
if (figma.command === 'refresh') {
    cleanUp();
    figma.closePlugin();
}
else {
    //show the UI of the plugin
    figma.showUI(__html__, { width: uiWidth, height: uiHeight });
}
//recieves msgs from the UI
figma.ui.onmessage = msg => {
    switch (msg.type) {
        case 'height':
            uiHeight = msg.height;
            figma.ui.resize(uiWidth, uiHeight);
            break;
        case 'addStatus':
            let status = msg.status;
            createAnnotations(status);
            break;
        case 'delete':
            deleteSelected();
            break;
        case 'deleteAll':
            deleteAll();
            break;
        case 'refresh':
            cleanUp();
            break;
    }
};
//function to get frames within the selection
function getFramesInSelection() {
    let selection = page.selection;
    let framesInSelection = [];
    if (selection) {
        selection.forEach(node => {
            if (node.type === 'FRAME') {
                framesInSelection.push(node);
            }
        });
    }
    return framesInSelection;
}
//create specified annotation
function createAnnotations(status) {
    return __awaiter(this, void 0, void 0, function* () {
        let selection = getFramesInSelection();
        if (selection.length !== 0) {
            //counter
            let count = 0;
            //create the frame with auto layout
            let annotionFrame = figma.createFrame();
            annotionFrame.counterAxisSizingMode = 'AUTO';
            annotionFrame.layoutMode = 'HORIZONTAL';
            annotionFrame.itemSpacing = 4;
            annotionFrame.horizontalPadding = 6;
            annotionFrame.verticalPadding = 4;
            annotionFrame.name = 'annotation';
            annotionFrame.topLeftRadius = 3;
            annotionFrame.topRightRadius = 3;
            //style the stroke
            annotionFrame.strokes = [{
                    type: 'SOLID',
                    visible: true,
                    opacity: 1,
                    blendMode: 'NORMAL',
                    color: hexToFigmaRgb('#DBDBDB')
                }];
            annotionFrame.strokeWeight = 1;
            //create and style the text node
            let text = figma.createText();
            text.name = status.title;
            //define and load the font
            let fontName = {
                'family': 'Inter',
                'style': 'Regular'
            };
            yield figma.loadFontAsync(fontName);
            //apply the font properties to the text node
            text.fontName = fontName;
            text.fontSize = 12;
            text.lineHeight = {
                'value': 16,
                'unit': 'PIXELS'
            };
            //add text to the text node
            text.characters = status.title;
            //create the icon
            let icon = figma.createNodeFromSvg(status.icon);
            icon.name = 'icon-' + status.slug;
            icon.layoutAlign = 'CENTER';
            //add icon and text to annotation
            annotionFrame.insertChild(0, text);
            annotionFrame.insertChild(1, icon);
            //group the frame and put it into an array
            let itemsToGroup = [];
            itemsToGroup.push(annotionFrame);
            let annotation = figma.group(itemsToGroup, page);
            annotation.name = status.title;
            //create the inner shadow
            let innerShadowColor = hexToFigmaRgb(status.color);
            innerShadowColor = Object.assign({ a: 1.0 }, innerShadowColor);
            annotation.effects = [{
                    blendMode: 'NORMAL',
                    color: innerShadowColor,
                    offset: { x: 0, y: -2 },
                    radius: 0,
                    type: 'INNER_SHADOW',
                    visible: true
                }];
            //loop through each frame
            selection.forEach(frame => {
                let statusAnnotation;
                //remove existing status if there is one
                removeStatus(frame);
                //check to see if first annotation
                if (count === 0) {
                    statusAnnotation = annotation;
                }
                else {
                    statusAnnotation = annotation.clone();
                }
                //get the frame id
                let frameId = frame.id;
                //set the position of the annotation
                let y = frame.y - statusAnnotation.height - spacing;
                let x = (frame.x + frame.width) - statusAnnotation.width;
                statusAnnotation.x = x;
                statusAnnotation.y = y;
                //add meta data to the annotation
                statusAnnotation.setPluginData('frameId', frameId);
                //add to group with annotations or create one
                let annotationGroup = page.findOne(x => x.type === 'GROUP' && x.name === 'status_annotations');
                if (annotationGroup) {
                    annotationGroup.appendChild(statusAnnotation);
                }
                else {
                    let annotationsToGroup = [];
                    annotationsToGroup.push(statusAnnotation);
                    let newAnnotationGroup = figma.group(annotationsToGroup, page);
                    newAnnotationGroup.name = 'status_annotations';
                    newAnnotationGroup.locked = true;
                    newAnnotationGroup.expanded = false;
                }
                //set plugin relaunch data
                frame.setRelaunchData({ status: status.title });
                frame.setSharedPluginData('statusannotations', 'status', status.title);
                //add plugin relaunch data to the page
                page.setRelaunchData({ refresh: '' });
                //increase the counter
                count++;
            });
        }
        else {
            figma.notify('Please select a frame');
        }
    });
}
//clears the status on selected frames
function deleteSelected() {
    let selection = getFramesInSelection();
    if (selection.length !== 0) {
        selection.forEach(frame => {
            removeStatus(frame);
            frame.setRelaunchData({});
        });
        if (removeCount === 1) {
            figma.notify('1 annotation removed');
        }
        else if (removeCount > 1) {
            figma.notify(removeCount + ' annotations deleted.');
        }
    }
    else {
        figma.notify('Please select a frame with a status');
    }
    removeCount = 0;
}
//clear all annotations
function deleteAll() {
    let annotationGroup = page.findOne(x => x.type === 'GROUP' && x.name === 'status_annotations');
    if (annotationGroup) {
        annotationGroup.remove();
    }
    //need to make this more performant
    let frames = page.findAll(x => x.type === 'FRAME');
    frames.forEach(frame => {
        frame.setRelaunchData({});
    });
    //remove the plugin relaunch button
    page.setRelaunchData({});
    //notify the user
    figma.notify('All annotations removed');
}
//remove the status msg from a frame
function removeStatus(frame) {
    let targetId = frame.id;
    let annotationGroup = page.findOne(x => x.type === 'GROUP' && x.name === 'status_annotations');
    //remove shared plugin data
    frame.setSharedPluginData('statusannotations', 'status', '');
    if (annotationGroup) {
        annotationGroup.children.forEach(annotation => {
            let refId = annotation.getPluginData('frameId');
            if (targetId === refId) {
                annotation.remove();
                removeCount++;
            }
        });
    }
}
//this function removes unused annotations and also updates the position
function cleanUp() {
    let annotationGroup = page.findOne(x => x.type === 'GROUP' && x.name === 'status_annotations');
    if (annotationGroup) {
        annotationGroup.children.forEach(annotation => {
            let refId = annotation.getPluginData('frameId');
            let frame = figma.getNodeById(refId);
            if (frame) {
                let y = frame.y - annotation.height - spacing;
                let x = (frame.x + frame.width) - annotation.width;
                if (annotation.x != x && annotation.y != y) {
                    updateCount++;
                }
                annotation.x = x;
                annotation.y = y;
            }
            else {
                annotation.remove();
                updateCount++;
            }
        });
        if (updateCount === 1) {
            figma.notify('1 annotation updated');
        }
        else if (updateCount > 1) {
            figma.notify(updateCount + ' annotations updated');
        }
    }
    updateCount = 0;
}
//Helper Functions
//hex to figma color system
function hexToFigmaRgb(hex) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: (parseInt(result[1], 16)) / 255,
        g: (parseInt(result[2], 16)) / 255,
        b: (parseInt(result[3], 16)) / 255
    } : null;
}
