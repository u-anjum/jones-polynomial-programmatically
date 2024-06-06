import EventEmitter from '../Utils/EventEmitter.js'
import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'

export default class UI extends EventEmitter
{
    constructor()
    {
        super()

        this.mode = 'drawing'
        this.crossing_mode = 'overcrossing'
        this.point_visibile = true

        this.drawing = document.querySelector('.drawing-icon')
        this.editing = document.querySelector('.editing-icon')
        this.add = document.querySelector('.add-icon')
        this.remove = document.querySelector('.remove-icon')

        this.overcrossing = document.querySelector('.overcrossing-icon')
        this.undercrossing = document.querySelector('.undercrossing-icon')

        this.show = document.querySelector('.show-icon')
        this.hide = document.querySelector('.hide-icon')

        const clickables = document.getElementsByClassName('icons')

        for(let i=0; i<clickables.length; i++) {
            clickables[i].addEventListener('mousedown', (e) => {
                e.stopPropagation()
                const target = e.srcElement;
                this.uiAction(target.dataset.action)
            })
        }

        this.initializeTooltips();
    }

    initializeTooltips() {
        var tooltipElements = document.querySelectorAll('[data-tooltip]');
        
        tooltipElements.forEach((element) => {
            var tooltipText = element.getAttribute('data-tooltip');

            tippy(element, {
                content: tooltipText,
            });
        });
    }

    uiAction(action) {
        switch(action) {
            case "set-edit-mode":
                this.setMode('editing')
            break;

            case "set-draw-mode":
                if(!this.drawing.classList.contains('disabled'))
                    this.setMode('drawing')
            break;

            case "add-point-mode":
                this.setMode('add')
            break;

            case "remove-point-mode":
                this.setMode('remove')
            break;

            case "set-overcrossing-mode":
                this.setCrossingMode('overcrossing')
            break;

            case "set-undercrossing-mode":
                this.setCrossingMode('undercrossing')
            break;

            case "show-point-mode":
                this.setPointVisibility(true);
                break;

            case "hide-point-mode":
                this.setPointVisibility(false);
                break;
        }
    }

    setPointVisibility(v) {
        this.point_visibile = v

        if(this.point_visibile) {
            this.show.classList.add('active')
            this.hide.classList.remove('active')
        }
        else {
            this.show.classList.remove('active')
            this.hide.classList.add('active')
        }
    }

    setCrossingMode(m, trigger=true) {
        this.crossing_mode = m

        if(this.crossing_mode === 'overcrossing') {
            this.overcrossing.classList.add('active')
            this.undercrossing.classList.remove('active')

            if(trigger)
                this.trigger('set_crossing_mode', [true])
        }
        else {
            this.overcrossing.classList.remove('active')
            this.undercrossing.classList.add('active')

            if(trigger)
                this.trigger('set_crossing_mode', [false])
        }
    }

    setMode(m) {
        this.mode = m

        if(this.mode === 'drawing') {
            this.drawing.classList.add('active')
            this.editing.classList.remove('active')
            this.add.classList.remove('active')
            this.remove.classList.remove('active')
        }
        else if(this.mode === "editing") {
            this.add.classList.remove('active')
            this.remove.classList.remove('active')
            this.drawing.classList.remove('active')
            this.editing.classList.add('active')
        }
        else if(this.mode === "add") {
            this.add.classList.add('active')
            this.remove.classList.remove('active')
            this.drawing.classList.remove('active')
            this.editing.classList.remove('active')
        }
        else if(this.mode === "remove") {
            this.add.classList.remove('active')
            this.drawing.classList.remove('active')
            this.editing.classList.remove('active')
            this.remove.classList.add('active')
        }

        this.trigger('set_mode', [m])
    }

    disableDrawing() {
        this.drawing.classList.add('disabled')
    }

    getMode() {
        return this.mode
    }
}