//vars
let uiWidth = 184 // default ui width
let uiHeight = 210; // default ui height
let spacing = 8; // spacing of annotations from top of frame
let page = figma.currentPage;

cleanUp();

if (figma.command === 'refresh') {
	cleanUp();
	figma.closePlugin();
} else {
	//show the UI of the plugin
	figma.showUI(__html__, {width: uiWidth, height: uiHeight });
}

//recieves msgs from the UI
figma.ui.onmessage = msg => {

	switch(msg.type){

		case 'height':
			uiHeight = msg.height;
			figma.ui.resize(uiWidth, uiHeight);
		break;

		case 'addStatus':
			let status:object = msg.status;
			createAnnotations(status);
		break;

		case 'clear':
			clearSelected();
		break;

		case 'clearAll':
			clearAll();
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
		})
	}
	return framesInSelection as FrameNode[];
}

//create specified annotation
async function createAnnotations(status) {

	let selection:FrameNode[] = getFramesInSelection();

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
		}
		await figma.loadFontAsync(fontName);

		//apply the font properties to the text node
		text.fontName = fontName;
		text.fontSize = 12;
		text.lineHeight = {
			'value': 16,
			'unit': 'PIXELS'
		}

		//add text to the text node
		text.characters = status.title;

		//create the icon
		let icon = figma.createNodeFromSvg(status.icon);
		icon.name = 'icon-' + status.slug;
		icon.layoutAlign = 'CENTER';

		//add icon and text to annotation
		annotionFrame.insertChild(0,text);
		annotionFrame.insertChild(1,icon);

		//group the frame and put it into an array
		let itemsToGroup = [];
		itemsToGroup.push(annotionFrame);
		let annotation = figma.group(itemsToGroup, page);
		annotation.name = status.title;

		//create the inner shadow
		let innerShadowColor = hexToFigmaRgb(status.color);
		innerShadowColor = Object.assign({a: 1.0}, innerShadowColor);
		annotation.effects = [{
			blendMode: 'NORMAL',
			color: innerShadowColor,
			offset: {x: 0, y: -2},
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
			} else {
				statusAnnotation = annotation.clone();
			}

			//get the frame id
			let frameId:string = frame.id;

			//set the position of the annotation
			let y = frame.y - statusAnnotation.height - spacing;
			let x = (frame.x + frame.width) - statusAnnotation.width;
			statusAnnotation.x = x;
			statusAnnotation.y = y;

			//add meta data to the annotation
			statusAnnotation.setPluginData('frameId',frameId);

			//add to group with annotations or create one
			let annotationGroup = page.findOne(x => x.type === 'GROUP' && x.name === 'status_annotations') as GroupNode;
			if (annotationGroup) {
				annotationGroup.appendChild(statusAnnotation);
			} else {
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

	} else {
		figma.notify('Please select a frame');
	}
}

//clears the status on selected frames
function clearSelected() {
	let selection:FrameNode[] = getFramesInSelection();
	if (selection) {
		selection.forEach(frame => {
			removeStatus(frame);
			frame.setRelaunchData({ });
		})
	} else {
		figma.notify('Please select a frame with a status')
	}
}

//clear all annotations
function clearAll() {
	let annotationGroup = page.findOne(x => x.type === 'GROUP' && x.name === 'status_annotations') as GroupNode;
	
	if (annotationGroup) {
		annotationGroup.remove();
	}

	//need to make this more performant
	let frames = page.findAll(x => x.type === 'FRAME') as FrameNode[];
	frames.forEach(frame => {
		frame.setRelaunchData({ });
	})

	//remove the plugin relaunch button
	page.setRelaunchData({ });
}

//remove the status msg from a frame
function removeStatus(frame) {

	let targetId = frame.id;
	let annotationGroup = page.findOne(x => x.type === 'GROUP' && x.name === 'status_annotations') as GroupNode;

	//remove shared plugin data
	frame.setSharedPluginData('statusannotations', 'status', '');

	if (annotationGroup) {
		annotationGroup.children.forEach(annotation => {
			let refId = annotation.getPluginData('frameId');
			if (targetId === refId) {
				annotation.remove();
			}
		})
	}
}

//this function removes unused annotations and also updates the position
function cleanUp() {
	let annotationGroup = page.findOne(x => x.type === 'GROUP' && x.name === 'status_annotations') as GroupNode;
	if (annotationGroup) {
		annotationGroup.children.forEach(annotation => {
			let refId = annotation.getPluginData('frameId');
			let frame = figma.getNodeById(refId) as FrameNode;
			if (frame) {
				let y = frame.y - annotation.height - spacing;
				let x = (frame.x + frame.width) - annotation.width;
				annotation.x = x;
				annotation.y = y;
			} else {
				annotation.remove();
			}
		})
	}
}

//Helper Functions

//hex to figma color system
function hexToFigmaRgb(hex:string) {
	let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? {
	  r: (parseInt(result[1], 16))/255,
	  g: (parseInt(result[2], 16))/255,
	  b: (parseInt(result[3], 16))/255
	} : null;
}