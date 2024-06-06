import EventEmitter from './EventEmitter.js'

export default class UserEvents extends EventEmitter
{
    constructor()
    {
        super()

        this.isDragging = false;
        
        // Resize event
        window.addEventListener('mousedown', (e) =>
        {
            this.isDragging = true;
            this.trigger('mousedown', [e.clientX, e.clientY, e.button])
        })

        window.addEventListener('mouseup', e => {
            this.isDragging = false;
            this.trigger('mouseup')
        })

        window.addEventListener('mousemove', e => {
            this.trigger('mousemove', [e.clientX, e.clientY, this.isDragging, e.shiftKey]);
        })

        window.addEventListener('keyup', e => {
            this.trigger('keyup', [e.key]);
        })
    }
}