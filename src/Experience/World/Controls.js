import Experience from '../Experience.js'
import { getDistance } from '../Utils/Math.js'

export default class Controls
{
    constructor(curve)
    {
        this.experience = new Experience()
        this.ui = this.experience.ui
        this.userEvents = this.experience.userEvents
        this.context = this.experience.context
        this.curve = curve
        this.isDrawing = true
        this.cursor = {x: 0, y: 0}
        this.selected_point = -1
        this.active_point = -1
    }

    select(x, y) {
        const pointIndex = this.getPointAt(x, y);

        if(pointIndex !== -1) {
            this.selected_point = pointIndex

            if(pointIndex % 2 == 0) {
                this.active_point = pointIndex
                this.ui.setCrossingMode(this.curve.getPoints()[this.active_point].isUpper? "overcrossing" : "undercrossing", false)
            }
        }
    }

    getPointAt(x, y) {
        const points = this.curve.getPoints()

        const startPoint = this.curve.isClosed ? 1 : 0
        for(let i=startPoint; i<points.length; i++) {
            const distance = getDistance(points[i], {x,y})

            if(distance < 15) { //collision with a point
                return i
            }
        }

        return -1
    }

    remove(x, y) {
        const p = this.getPointAt(x, y)
        const points = this.curve.getPoints()

        if(p !== -1 && p % 2 == 0) {
            this.curve.remove(p)
            this.curve.remove(p - 1)
        }

        this.selected_point = -1
        this.active_point = -1
        this.ui.setMode('editing')
    }

    add(x, y) {
        const p = this.curve.getPointOfCurve(x, y)
        this.curve.addAt(x, y, p, this.ui.crossing_mode)
        this.selected_point = -1
        this.active_point = -1
        this.ui.setMode('editing')
    }

    deselect() {
        this.selected_point = -1
    }

    setDrawing(d) {
        this.isDrawing = d
    }

    setCursor(x, y, is_dragging, shift_pressed) {
        this.cursor.x = x
        this.cursor.y = y

        if(this.selected_point !== -1) {
            this.curve.setPointPosition(x, y, this.selected_point, shift_pressed)
        }
    }

    setCrossing(m) {
        if(this.active_point !== -1)
            this.curve.setPointCrossing(this.active_point, m)
    }

    render()
    {
        const points = this.curve.getPoints()

        if(this.isDrawing && points.length > 0) {
            this.context.beginPath();
            this.context.setLineDash([]);
            this.context.lineWidth = 1
            this.context.strokeStyle = '#000000'

            this.context.beginPath()
            const point = points[points.length - 1]

            this.context.moveTo(point.x, point.y)
            this.context.lineTo(this.cursor.x, this.cursor.y)
            this.context.stroke()
        }

        const startPoint = this.curve.isClosed ? 1 : 0

        for(let i=startPoint; i < points.length; i++) {
            if(i % 2 !== 0 &&  !this.ui.point_visibile) 
                continue

            this.context.beginPath();
            this.context.setLineDash([]);
            this.context.lineWidth = 1;
            this.context.strokeStyle = '#000000';

            if(i === this.active_point)
                this.context.fillStyle = '#EDE080'
            else if(i % 2 == 0) //endpoint
                this.context.fillStyle = '#ffffff'
            else //shape parameters
                this.context.fillStyle = points[i].color

            this.context.arc(points[i].x, points[i].y, 15, 2 * Math.PI, false);

            this.context.stroke();
            this.context.fill();

            if(i % 2 == 0) { //add an extra small circle
                this.context.beginPath();
                this.context.fillStyle = points[i].color
                this.context.arc(points[i].x, points[i].y, 5, 2 * Math.PI, false);
                this.context.fill();

                //Add text telling this is undercrossing or over crossing
                // this.context.font = "20px Arial";
                // this.context.fillStyle = '#000'
                // this.context.fillText(points[i].isUpper? "O" : "U", points[i].x - 8, points[i].y + 7);
            }
        }
    }
}