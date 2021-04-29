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
<<<<<<< Updated upstream
***************************************************************************** */function e(e,t,a,n){return new(a||(a=Promise))((function(i,o){function r(e){try{s(n.next(e))}catch(e){o(e)}}function l(e){try{s(n.throw(e))}catch(e){o(e)}}function s(e){var t;e.done?i(e.value):(t=e.value,t instanceof a?t:new a((function(e){e(t)}))).then(r,l)}s((n=n.apply(e,t||[])).next())}))}let t=210,a=0,n=0;function i(e){let t=[];return e&&e.forEach((e=>{e.parent===figma.currentPage&&("COMPONENT"!==e.type&&"COMPONENT_SET"!==e.type&&"FRAME"!==e.type&&"INSTANCE"!==e.type&&"GROUP"!==e.type||t.push(e))})),t}function o(e){let t=e.id,a=figma.currentPage.findOne((e=>"GROUP"===e.type&&"status_annotations"===e.name));e.setSharedPluginData("statusannotations","status",""),a&&a.children.forEach((e=>{let a=e.getPluginData("frameId");t===a&&(e.remove(),n++)}))}function r(){let e=figma.currentPage.findOne((e=>"GROUP"===e.type&&"status_annotations"===e.name));e&&(e.children.forEach((e=>{let t=e.getPluginData("frameId"),n=figma.getNodeById(t);if(n){let t=n.y-e.height-8,i=n.x+n.width-e.width;e.x!=i&&e.y!=t&&a++,e.x=i,e.y=t}else e.remove(),a++})),1===a?figma.notify("1 annotation updated"):a>1&&figma.notify(a+" annotations updated"),e.parent.insertChild(e.parent.children.length,e)),a=0}function l(e){let t=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);return t?{r:parseInt(t[1],16)/255,g:parseInt(t[2],16)/255,b:parseInt(t[3],16)/255}:null}r(),"refresh"===figma.command?(r(),figma.closePlugin()):figma.showUI(__html__,{width:184,height:t}),figma.ui.onmessage=a=>{switch(a.type){case"height":t=a.height,figma.ui.resize(184,t);break;case"addStatus":!function(t){e(this,void 0,void 0,(function*(){let e=i(figma.currentPage.selection);if(0!==e.length){let a=0,n=figma.createFrame();n.counterAxisSizingMode="AUTO",n.layoutMode="HORIZONTAL",n.itemSpacing=4,n.horizontalPadding=6,n.verticalPadding=4,n.name="annotation",n.topLeftRadius=3,n.topRightRadius=3,n.strokes=[{type:"SOLID",visible:!0,opacity:1,blendMode:"NORMAL",color:l("#DBDBDB")}],n.strokeWeight=1;let i=figma.createText();i.name=t.title;let r={family:"Inter",style:"Regular"};yield figma.loadFontAsync(r),i.fontName=r,i.fontSize=12,i.lineHeight={value:16,unit:"PIXELS"},i.characters=t.title;let s=figma.createNodeFromSvg(t.icon);s.name="icon-"+t.slug,s.layoutAlign="CENTER",n.insertChild(0,i),n.insertChild(1,s);let f=[];f.push(n);let c=figma.group(f,figma.currentPage);c.name=t.title;let g=l(t.color);g=Object.assign({a:1},g),c.effects=[{blendMode:"NORMAL",color:g,offset:{x:0,y:-2},radius:0,spread:0,type:"INNER_SHADOW",visible:!0}],e.forEach((e=>{let n;o(e),n=0===a?c:c.clone();let i=e.id,r=e.y-n.height-8,l=e.x+e.width-n.width;n.x=l,n.y=r,n.setPluginData("frameId",i);let s=figma.currentPage.findOne((e=>"GROUP"===e.type&&"status_annotations"===e.name));if(s)s.appendChild(n),s.parent.insertChild(0,s);else{let e=[];e.push(n);let t=figma.group(e,figma.currentPage);t.name="status_annotations",t.locked=!0,t.expanded=!1,t.parent.insertChild(t.parent.children.length,t),console.log("hello")}"INSTANCE"!=e.type&&e.setRelaunchData({status:t.title}),e.setSharedPluginData("statusannotations","status",t.title),figma.currentPage.setRelaunchData({refresh:""}),a++}))}else figma.notify("Please select a top level frame, component, or group")}))}(a.status);break;case"delete":!function(){let e=i(figma.currentPage.selection);0!==e.length?(e.forEach((e=>{o(e),"INSTANCE"!=e.type&&e.setRelaunchData({})})),1===n?figma.notify("1 annotation removed"):n>1&&figma.notify(n+" annotations removed")):figma.notify("Please select a frame, component, or group with a status");n=0}();break;case"deleteAll":!function(){let e=figma.currentPage.findOne((e=>"GROUP"===e.type&&"status_annotations"===e.name));e&&e.remove();i(figma.currentPage.children).forEach((e=>{"INSTANCE"!=e.type&&e.setRelaunchData({})})),figma.currentPage.setRelaunchData({}),figma.notify("All annotations removed")}();break;case"refresh":r()}};
=======
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
function getTopLevelNodes(nodes) {
    let topLevelNodesInSelection = [];
    if (nodes) {
        nodes.forEach(node => {
            if (node.parent === figma.currentPage) {
                if (node.type === 'COMPONENT' || node.type === 'FRAME' || node.type === 'INSTANCE' || node.type === 'GROUP') {
                    topLevelNodesInSelection.push(node);
                }
            }
        });
    }
    return topLevelNodesInSelection;
}
//create specified annotation
function createAnnotations(status) {
    return __awaiter(this, void 0, void 0, function* () {
        let selection = getTopLevelNodes(figma.currentPage.selection);
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
            let annotation = figma.group(itemsToGroup, figma.currentPage);
            annotation.name = status.title;
            //create the inner shadow
            let innerShadowColor = hexToFigmaRgb(status.color);
            innerShadowColor = Object.assign({ a: 1.0 }, innerShadowColor);
            annotation.effects = [{
                    blendMode: 'NORMAL',
                    color: innerShadowColor,
                    offset: { x: 0, y: -2 },
                    radius: 0,
                    spread: 0,
                    type: 'INNER_SHADOW',
                    visible: true
                }];
            //loop through each frame
            selection.forEach(node => {
                let statusAnnotation;
                //remove existing status if there is one
                removeStatus(node);
                //check to see if first annotation
                if (count === 0) {
                    statusAnnotation = annotation;
                }
                else {
                    statusAnnotation = annotation.clone();
                }
                //get the frame id
                let nodeId = node.id;
                //set the position of the annotation
                let y = node.y - statusAnnotation.height - spacing;
                let x = (node.x + node.width) - statusAnnotation.width;
                statusAnnotation.x = x;
                statusAnnotation.y = y;
                //add meta data to the annotation
                statusAnnotation.setPluginData('frameId', nodeId);
                //add to group with annotations or create one
                let annotationGroup = figma.currentPage.findOne(x => x.type === 'GROUP' && x.name === 'status_annotations');
                if (annotationGroup) {
                    annotationGroup.appendChild(statusAnnotation);
                    annotationGroup.parent.insertChild(0, annotationGroup);
                }
                else {
                    let annotationsToGroup = [];
                    annotationsToGroup.push(statusAnnotation);
                    let newAnnotationGroup = figma.group(annotationsToGroup, figma.currentPage);
                    newAnnotationGroup.name = 'status_annotations';
                    newAnnotationGroup.locked = true;
                    newAnnotationGroup.expanded = false;
                    newAnnotationGroup.parent.insertChild(0, newAnnotationGroup);
                }
                //set plugin relaunch data
                if (node.type != 'INSTANCE') {
                    node.setRelaunchData({ status: status.title });
                }
                node.setSharedPluginData('statusannotations', 'status', status.title);
                //add plugin relaunch data to the page
                figma.currentPage.setRelaunchData({ refresh: '' });
                //increase the counter
                count++;
            });
        }
        else {
            figma.notify('Please select a top level frame, component, or group');
        }
    });
}
//clears the status on selected frames
function deleteSelected() {
    let selection = getTopLevelNodes(figma.currentPage.selection);
    if (selection.length !== 0) {
        selection.forEach(node => {
            removeStatus(node);
            if (node.type != 'INSTANCE') {
                node.setRelaunchData({});
            }
        });
        if (removeCount === 1) {
            figma.notify('1 annotation removed');
        }
        else if (removeCount > 1) {
            figma.notify(removeCount + ' annotations removed');
        }
    }
    else {
        figma.notify('Please select a frame, component, or group with a status');
    }
    removeCount = 0;
}
//clear all annotations
function deleteAll() {
    let annotationGroup = figma.currentPage.findOne(x => x.type === 'GROUP' && x.name === 'status_annotations');
    if (annotationGroup) {
        annotationGroup.remove();
    }
    //need to make this more performant
    let topLevelNodes = getTopLevelNodes(figma.currentPage.children);
    topLevelNodes.forEach(node => {
        if (node.type != 'INSTANCE') {
            node.setRelaunchData({});
        }
    });
    //remove the plugin relaunch button
    figma.currentPage.setRelaunchData({});
    //notify the user
    figma.notify('All annotations removed');
}
//remove the status msg from a frame
function removeStatus(frame) {
    let targetId = frame.id;
    let annotationGroup = figma.currentPage.findOne(x => x.type === 'GROUP' && x.name === 'status_annotations');
    //remove shared plugin data`
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
    let annotationGroup = figma.currentPage.findOne(x => x.type === 'GROUP' && x.name === 'status_annotations');
    if (annotationGroup) {
        annotationGroup.children.forEach(annotation => {
            let refId = annotation.getPluginData('frameId');
            let node = figma.getNodeById(refId);
            if (node) {
                let y = node.y - annotation.height - spacing;
                let x = (node.x + node.width) - annotation.width;
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
        //talk to the user
        if (updateCount === 1) {
            figma.notify('1 annotation updated');
        }
        else if (updateCount > 1) {
            figma.notify(updateCount + ' annotations updated');
        }
        //move the annotations to the bottom
        annotationGroup.parent.insertChild(0, annotationGroup);
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
>>>>>>> Stashed changes
