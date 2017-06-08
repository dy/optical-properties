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
inputEl.value = '▲'
inputEl.onchange = e => {
	let v = inputEl.value[0]
	inputEl.value = v

	update(v)
}



//create canvases
let w = 200
let h = 200
let fs = 100

let canvasIn = document.body.appendChild(document.createElement('canvas'))
let ctxIn = canvasIn.getContext('2d')
canvasIn.width = w
canvasIn.height = h
canvasIn.style.marginRight = '1rem'

let canvasOut = document.body.appendChild(document.createElement('canvas'))
let ctxOut = canvasOut.getContext('2d')
canvasOut.width = w
canvasOut.height = h

update('▲')

document.body.appendChild(optics.canvas)

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
	let props = optics(char)
	console.timeEnd(char + ' time')
	console.log(char + ' properties:', props)

	let {box, center, area} = props

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

	//real center cross
	ctxOut.fillStyle = 'rgba(0, 150, 250, .25)'
	ctxOut.fillRect(w/2, 0, 1, h)
	ctxOut.fillRect(0, h/2, w, 1)

	//font
	ctxOut.fillStyle = 'white'
	ctxOut.textBaseline = 'middle'
	ctxOut.textAlign = 'center'
	ctxOut.font = fs + 'px sans-serif'
	ctxOut.fillText(char, w-props.center[0], h-props.center[1])
}
