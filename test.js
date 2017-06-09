'use strict'

require('enable-mobile')
const optics = require('./')

document.body.style.padding = '2rem'

let inputEl = document.body.appendChild(document.createElement('input'))
inputEl.style.display = 'block'
inputEl.style.width = '4rem'
inputEl.style.fontSize = '1.5rem'
inputEl.style.marginBottom = '1rem'
inputEl.maxlength = 1
inputEl.value = '|'
inputEl.onchange = e => {
	let v = inputEl.value[0]
	inputEl.value = v

	update(v)
}

let itemsEl = document.body.appendChild(document.createElement('div'))
itemsEl.style.position = 'absolute'
itemsEl.style.top = '2rem'
itemsEl.style.left = '7rem'
itemsEl.style.lineHeight = '2rem'
itemsEl.style.fontSize = '1.5rem'
let chars = '●✝+×✕▲▼_▇◌◦□⧖⧓◆✦✶❇'
for (let i = 0; i < chars.length; i++) {
	let el = itemsEl.appendChild(document.createElement('span'))
	el.innerHTML = chars[i]
}



//create canvases
let w = 300
let h = 300
let fs = 150

let canvasIn = document.body.appendChild(document.createElement('canvas'))
let ctxIn = canvasIn.getContext('2d')
canvasIn.width = w
canvasIn.height = h
canvasIn.style.marginRight = '1rem'

let canvasOut = document.body.appendChild(document.createElement('canvas'))
let ctxOut = canvasOut.getContext('2d')
canvasOut.width = w
canvasOut.height = h

update(inputEl.value)

function update (char) {
	ctxIn.fillStyle = 'black'
	ctxIn.fillRect(0, 0, w, h)

	ctxIn.fillStyle = 'rgba(0, 150, 250, .25)'
	ctxIn.fillRect(w/2, 0, 1, h)
	ctxIn.fillRect(0, h/2, w, 1)

	ctxIn.textBaseline = 'middle'
	ctxIn.textAlign = 'center'
	ctxIn.font = fs + 'px sans-serif'
	ctxIn.fillStyle = 'white'
	ctxIn.fillText(char, w/2, h/2)


	console.time(char + ' time')
	let props = optics(char, {size: w, fontSize: fs})
	console.timeEnd(char + ' time')
	console.log(char + ' properties:', props)

	let {bounds: box, center, radius} = props
	let maxSide = Math.max( (box[3]-box[1])/2 , (box[2]-box[0])/2 )
	let maxDist = radius*.5 + maxSide*.5
	let scale = h*.25/maxDist
	let diff = [Math.floor(w/2 - center[0]), h/2 - center[1]]

	//center of mass cross
	ctxIn.fillStyle = 'rgba(250, 150, 0, .5)'
	ctxIn.fillRect(center[0], 0, 1, h)
	ctxIn.fillRect(0, center[1], w, 1)

	//bounding box
	ctxIn.strokeStyle = 'rgba(0, 250, 150, .5)'
	ctxIn.strokeRect(box[0], box[1], box[2] - box[0], box[3] - box[1])

	//render output
	ctxOut.fillStyle = 'black'
	ctxOut.fillRect(0, 0, w, h)

	//font
	ctxOut.fillStyle = 'white'
	ctxOut.textBaseline = 'middle'
	ctxOut.textAlign = 'center'
	ctxOut.font = fs*scale + 'px sans-serif'
	ctxOut.fillText(char, w/2 + diff[0]*scale, h/2 + diff[1]*scale)

	//center cross
	ctxOut.fillStyle = 'rgba(0, 150, 250, .25)'
	ctxOut.fillRect(w/2, 0, 1, h)
	ctxOut.fillRect(0, h/2, w, 1)

	//circumference
	ctxIn.strokeStyle = 'rgba(250, 250, 0, .5)'
	ctxIn.beginPath()
	ctxIn.arc(center[0], center[1], radius, 0, 2 * Math.PI)
	ctxIn.closePath()
	ctxIn.stroke();

	//circumference
	ctxOut.strokeStyle = 'rgba(0, 150, 250, .33)'
	ctxOut.beginPath()
	ctxOut.arc(w/2, h/2, w/4, 0, 2 * Math.PI)
	ctxOut.closePath()
	ctxOut.stroke();

}


// drawHTML('●✝+×✕▲▼_▇◌◦□⧖⧓◆✦✶❇')
drawCanvas('●✝+×✕▲▼_▇◌◦□⧖⧓◆✦✶❇')


//draw set of letters
function drawHTML(chars) {
	let topEl = document.body.appendChild(document.createElement('div'))
	topEl.style.marginTop = '1rem'
	topEl.style.marginRight = '1rem'
	topEl.style.position = 'relative'
	topEl.style.minWidth = w + 'px'
	topEl.style.lineHeight = '2rem'

	let step = 100
	let fs = 50
	let fontRatio = 4.5

	for (let i = 0; i < chars.length; i++) {
		let char = chars[i]
		let el = topEl.appendChild(document.createElement('span'))
		el.innerHTML = char
		el.style.fontSize = '2rem'
	}

	let bottomEl = document.body.appendChild(document.createElement('div'))
	bottomEl.style.position = 'relative'
	bottomEl.style.minWidth = w + 'px'
	bottomEl.style.lineHeight = '2rem'
	bottomEl.style.marginTop = '1rem'

	for (let i = 0; i < chars.length; i++) {
		let char = chars[i]

		let el = bottomEl.appendChild(document.createElement('span'))
		el.innerHTML = char

		let {center, bounds, radius} = optics(chars[i], {size: step, fontSize: fs})
		center[0] /= step, center[1] /= step, radius /= step, bounds[3] /= step, bounds[1] /= step
		let scale = .25/radius
		let diff = .5 - center[1]

		el.style.fontSize = 2*scale + 'rem';
		el.style.position = 'relative'
		el.style.display = 'inline-block'
		el.style.verticalAlign = 'middle'
		el.style.top = fontRatio*diff*scale + 'rem';
	}
}

//draw set of letters
function drawCanvas(chars) {
	let canvas = document.body.appendChild(document.createElement('canvas'))
	canvas.width = 720
	canvas.height = 200
	canvas.style.marginTop = '1rem'
	let ctx = canvas.getContext('2d')

	let w = canvas.width, h = canvas.height
	let step = 40
	let fs = 20

	// ctx.fillStyle = 'black'
	// ctx.fillRect(0, 0, w, h)

	ctx.textBaseline = 'middle'
	ctx.textAlign = 'center'

	for (let i = 0; i < chars.length; i++) {
		let char = chars[i]

		ctx.fillStyle = 'rgba(0, 150, 250, .25)'
		ctx.fillRect(i*step + step/2, 0, 1, step)
		ctx.fillRect(i*step, step/2, step, 1)

		ctx.font = fs + 'px sans-serif'
		ctx.fillStyle = 'black'
		ctx.fillText(chars[i], i*step + step/2, step/2)

		let {center, bounds, radius} = optics(chars[i], {size: step*10, fontSize: fs*10})
		center[0] /= 10, center[1] /= 10, radius /= 10, bounds[3] /= 10, bounds[1] /= 10, bounds[0] /= 10, bounds[2] /= 10

		// let maxDist = radius*.5 + Math.max( bounds[3]-bounds[1] , bounds[2]-bounds[0] )*.5
		let maxDist = radius*.5 + Math.max( (bounds[3]-bounds[1])*.5 , (bounds[2]-bounds[0])*.5 )*.5
		let scale = step*.25/maxDist
		let diff = [Math.floor(step/2 - center[0]), step/2 - center[1]]
		let off = (.5*(bounds[3] + bounds[1]) - h*.5)

		ctx.fillStyle = 'rgba(250, 150, 0, .25)'
		ctx.fillRect(i*step + step/2, step, 1, step)
		ctx.fillRect(i*step, step + step/2, step, 1)

		ctx.fillStyle = 'black'
		ctx.font = fs*scale + 'px sans-serif'
		ctx.fillText(chars[i], i*step + step/2 + diff[0]*scale + .5, step + step/2 + diff[1]*scale + .5)
	}
}
