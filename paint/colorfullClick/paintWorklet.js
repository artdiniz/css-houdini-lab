console.log("Pintor")

const reduceColor = (color, percentage = 1) => parseInt(color * Math.max(Math.min(1,percentage), 0))

const rgbColorStringToObject = (string) => {
    const {1:red, 2:green, 3:blue} = string.trim().match(/^rgb\(([1-2]*[1-9]*[1-9]+)\s*,\s*([1-2]*[1-9]*[1-9]+)\s*,\s*([1-2]*[1-9]*[1-9]+)\)$/)
    return {red: parseInt(red), green: parseInt(green), blue: parseInt(blue)}
}

const objectToRGBString = (colorObject) => `rgb(${colorObject.red}, ${colorObject.green}, ${colorObject.blue})`

const diffColors = (color1, color2) => ({
    red: parseInt(color2.red - color1.red)
    ,green: parseInt(color2.green - color1.green)
    ,blue: parseInt(color2.blue - color1.blue)
})

const msStringToInt = (string) => parseInt(string.replace(/ms$/, ""))

registerPaint('colorfull-click', class {
    static get inputProperties() { return ['background-color', '--colorfull-click-x', '--colorfull-click-y', '--colorfull-click-animation-tick', '--colorfull-click-animation-duration'] }
    paint(ctx, geom, props){
        const xPercentage = parseFloat(props.get('--colorfull-click-x').toString()) / geom.width
        const yPercentage = parseFloat(props.get('--colorfull-click-y').toString()) / geom.height
        
        const duration = msStringToInt(props.get('--colorfull-click-animation-duration').toString())
        const tick = Math.min(duration, Math.max(0, parseFloat(props.get('--colorfull-click-animation-tick').toString())))      
        const animationPercentage = Math.abs(Math.abs(tick - (duration/2)) / (duration/2) - 1)

        const bgColor = rgbColorStringToObject(props.get('background-color').toString())

        const objectiveColor = {
            red: reduceColor(255, xPercentage)
            ,green: reduceColor(255, yPercentage)
            ,blue: reduceColor(255, (xPercentage / yPercentage)%1)
        }

        const colorDelta = diffColors(bgColor, objectiveColor)

        const currentColor = {
            red: bgColor.red + reduceColor(colorDelta.red, animationPercentage)
            ,green: bgColor.green + reduceColor(colorDelta.green, animationPercentage)
            ,blue: bgColor.blue + reduceColor(colorDelta.blue, animationPercentage)
        }

        console.log("Original: ", objectToRGBString(bgColor))
        console.log("Objective: ", objectToRGBString(objectiveColor))
        console.log("Delta: ", objectToRGBString(colorDelta))
        console.log("Current: ", objectToRGBString(currentColor))
        

        ctx.fillStyle = objectToRGBString(currentColor)
        ctx.fillRect(0, 0, geom.width, geom.height);
        ctx.fillRect(0, 0, geom.width, geom.height);
    }
})