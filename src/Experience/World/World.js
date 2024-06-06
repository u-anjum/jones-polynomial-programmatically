import Experience from '../Experience.js'
import Curve from './QuadraticCurve.js'
import Controls from './Controls.js'
import Statistics from "./Statistics.js"

export default class World
{
    constructor()
    {
        this.experience = new Experience()
        this.context = this.experience.context
        this.userEvents = this.experience.userEvents
        this.time = this.experience.time
        this.ui = this.experience.ui

        this.curve = new Curve()
        this.controls = new Controls(this.curve)
        this.statistics = new Statistics(this.curve)

        this.userEvents.on('keyup', (key) => this.onKeyUp(key))
        this.userEvents.on('mousedown', (x, y, button) => this.onMouseDown(x, y, button))
        this.userEvents.on('mousemove', (x, y, is_dragging, shift_pressed) => this.onMouseMove(x, y, is_dragging, shift_pressed))
        this.userEvents.on('mouseup', () => this.onMouseUp())

        this.time.on('tick', () => this.render())

        this.ui.on('set-mode', m => this.controls.setDrawing(m === 'drawing'))
        this.ui.on('set-crossing-mode', m => this.controls.setCrossing(m))
    }

    onKeyUp(key) {
        if(key == 'Escape') {
            this.ui.setMode('editing')
        }
    }

    onMouseDown(x, y, button) {
        if(button == 2) {
            this.ui.setMode('editing')
        }

        const mode = this.ui.getMode();

        switch(mode) {
            case "drawing":
                if(this.curve.add(x, y, this.ui.crossing_mode)) {
                    this.ui.setMode('editing')
                    this.ui.disableDrawing()
                }
                break;

            case "editing":
                this.controls.select(x, y)
                break;

            case "remove":
                this.controls.remove(x, y)
                break;

            case "add":
                this.controls.add(x, y)
                break;
        }
            
    }

    onMouseMove(x, y, is_dragging, shift_pressed) {
        this.controls.setCursor(x, y, is_dragging, shift_pressed)
    }

    onMouseUp() {
        this.controls.deselect()
        this.statistics.render()
    }

    render() {
        this.curve.render()
        this.controls.render()
        this.statistics.renderCrossings()
    }
}