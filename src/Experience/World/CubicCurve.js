import Experience from '../Experience.js'
import { getDistance } from '../Utils/Math.js'

export default class Curve
{
    constructor(world)
    {
        this.experience = new Experience()
        this.userEvents = this.experience.userEvents
        this.context = this.experience.context
        
        this.points = []
        this.cursor = {x: 0, y: 0}

        this.isDrawing = true
        this.isClosed = false
    }

    render()
    {
        if(this.points.length < 4)
            return;

        this.context.lineWidth = 10

        for(let i=0; i + 3 < this.points.length; i += 3) {
            if(this.points[i+1].isUpper)
                continue;

            this.drawCurve(i)
        }

        for(let i=0; i + 3 < this.points.length; i += 3) {
            if(!this.points[i+1].isUpper)
                continue;

            this.drawCurve(i)
        }
    }

    drawCurve(i) {
        this.context.beginPath()
        const point1 = this.points[i]
        const point2 = this.points[i+1]
        const point3 = this.points[i+2]
        const point4 = this.points[i+3]

        this.context.strokeStyle = point4.color

        this.context.moveTo(point1.x, point1.y)
        this.context.bezierCurveTo(point2.x, point2.y, point3.x, point3.y, point4.x, point4.y)

        this.context.stroke()
    }

    setPointCrossing(i, is_upper) {
        this.points[i].isUpper = is_upper;

        if(i > 0) {
            this.points[i-1].isUpper = is_upper;
            this.points[i-2].isUpper = is_upper;
        }
    }

    getPointOfCurve(x, y) {
        let index = 0;

        for(let index = 0; index < this.points.length; index += 3) {
            for(let t=0; t <= 1; t += 0.01) {
                const p1 = this.points[index];
                const p2 = this.points[index+1];
                const p3 = this.points[index+2];
                const p4 = this.points[index+3];

                const pt = this.getCurve(p1, p2, p3, p4, t);

                if(getDistance(pt, {x,y}) < 15) {
                    return index + 3;
                }
            }
        }
    }

    setPointPosition(x, y, i) {
        //Reset control points
        if(i % 3 == 0) {
            //Points before this one
            // if(i > 0) {
            //     const last_point = this.points[i - 3];
            //     const point1 = this.getLine(last_point, {x, y} , 1/3)
            //     this.points[i-2].x = point1.x
            //     this.points[i-2].y = point1.y

            //     const point2 = this.getLine(last_point, {x, y} , 2/3)
            //     this.points[i-1].x = point2.x
            //     this.points[i-1].y = point2.y
            // }

            // if(i < this.points.length - 1) {
            //     const next_point = this.points[i + 3];
            //     const point1 = this.getLine(next_point, {x, y} , 1/3)
            //     this.points[i+1].x = point1.x
            //     this.points[i+1].y = point1.y

            //     const point2 = this.getLine(next_point, {x, y} , 2/3)
            //     this.points[i+2].x = point2.x
            //     this.points[i+2].y = point2.y
            // }
        }

        this.points[i].x = x
        this.points[i].y = y

        if(this.isClosed && i === this.points.length - 1) {
            this.points[0].x = x
            this.points[0].y = y

            // const next_point = this.points[3];
            // const point1 = this.getLine(next_point, {x, y} , 1/3)
            // this.points[1].x = point1.x
            // this.points[1].y = point1.y

            // const point2 = this.getLine(next_point, {x, y} , 2/3)
            // this.points[2].x = point2.x
            // this.points[2].y = point2.y
        }
    }

    addAt(x, y, p, crossing_mode) {
        const color = this.getRandomColor()
        const is_upper = crossing_mode === 'overcrossing'? 1 : 0

        //straight existing line
        const last_point = this.points[p - 3];
        const current_point = this.points[p];

        const point1 = this.getLine({x, y}, current_point , 1/3)
        this.points[p-2].x = point1.x
        this.points[p-2].y = point1.y

        const point2 = this.getLine({x,y}, current_point , 2/3)
        this.points[p-1].x = point2.x
        this.points[p-1].y = point2.y

        //insert new
        const point3 = this.getLine(last_point, {x, y} , 2/3)
        const point4 = this.getLine(last_point, {x, y} , 1/3)
        this.points.splice(p - 2, 0, {x: x, y: y, isUpper: is_upper, color, ismain: true})
        this.points.splice(p - 2, 0, {x: point3.x, y: point3.y, isUpper: is_upper, color, ispotion: true})
        this.points.splice(p - 2, 0, {x: point4.x, y: point4.y, isUpper: is_upper, color, ispotion: true})
    }

    add(x, y, crossing_mode) {
        const color = this.getRandomColor()
        const is_upper = crossing_mode === 'overcrossing'? 1 : 0

        if(this.points.length == 0)
            this.points.push({x, y, isUpper: is_upper, color})
        else {
            const last_point = this.points[this.points.length - 1];

            //add a point 1/3 of the way
            const point1 = this.getLine(last_point, {x, y} , 1/3)
            this.points.push({ x: point1.x, y: point1.y, isUpper: is_upper, color})

            //add a point 2/3 of the way
            const point2 = this.getLine(last_point, {x, y}, 2/3)
            this.points.push({ x: point2.x, y: point2.y, isUpper: is_upper, color})

            if(this.isClosing(x, y)) {
                this.isClosed = true;
                this.points.push({x: this.points[0].x, y: this.points[0].y, isUpper: is_upper, color})
                return true
            }
            else {
                this.points.push({x, y, isUpper: is_upper, color})
                return false
            }
        }
    }

    remove(index) {
        if(index < this.points.length - 1)
            this.points.splice(index, 1)

        if(this.points.length == 5) {
            this.points.splice(this.points.length - 1, 1)
        }

        const lp = this.points[this.points.length - 1];
        const fp = this.points[0];

        if(fp.x !== lp.x || fp.y !== lp.y) {
            this.isClosed = false
            //TODO
        }
    }

    isClosing(x, y) {
        if(getDistance({x: this.points[0].x, y: this.points[0].y}, {x,y}) < 15) { //collision with a point
            return true
        }

        return false
    }

    getCurve(p0, p1, p2, p3, t) {
        return {
            x: Math.pow(1-t, 3) * p0.x +
            Math.pow(1-t, 2) * 3 * t * p1.x +
            (1 - t) * 3 * t * t * p2.x +
            t * t * t * p3.x,

            y: Math.pow(1-t, 3) * p0.y +
            Math.pow(1-t, 2) * 3 * t * p1.y +
            (1 - t) * 3 * t * t * p2.y +
            t * t * t * p3.y
        }
    }

    getLine(p1, p2, t) {
        return {
            x: (1 - t) * p1.x + t * p2.x,
            y: (1 - t) * p1.y + t * p2.y,
        }
    }

    getPoints() {
        return this.points
    }

    getRandomColor() {
        // Generating random values for R, G, and B
        var r = Math.floor(Math.random() * 256);
        var g = Math.floor(Math.random() * 256);
        var b = Math.floor(Math.random() * 256);

        // Converting decimal to hex
        var hexR = r.toString(16).padStart(2, '0');
        var hexG = g.toString(16).padStart(2, '0');
        var hexB = b.toString(16).padStart(2, '0');

        // Constructing the hex color code
        var hexColor = '#' + hexR + hexG + hexB;

        return hexColor;
    }
}