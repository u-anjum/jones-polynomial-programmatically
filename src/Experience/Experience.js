import Debug from './Utils/Debug.js'
import Sizes from './Utils/Sizes.js'
import Time from './Utils/Time.js'
import UserEvents from './Utils/UserEvents.js'

import UI from './UI/UI.js'
import World from './World/World.js'

import Document from './Document.js'

let instance = null

export default class Experience
{
    constructor(_canvas)
    {
        // Singleton
        if(instance)
        {
            return instance
        }
        instance = this
        
        // Global access
        window.experience = this

        // Options
        this.canvas = _canvas
        this.context = this.canvas.getContext('2d')

        this.canvas.oncontextmenu = (e) => { 
            e.preventDefault(); 
            e.stopPropagation(); 
        }

        // Setup
        this.debug = new Debug()
        this.sizes = new Sizes()
        this.time = new Time()

        this.time.on('tick', () => {
            this.cleanCanvas()
        })

        this.userEvents = new UserEvents()
        this.ui = new UI()
        this.world = new World()

        this.document = new Document()

        
        // Resize event
        this.sizes.on('resize', () =>
        {
            this.resize()
        })

        this.resize()
    }

    cleanCanvas() {
        this.context.clearRect(0, 0, this.sizes.width, this.sizes.height);
    }

    resize()
    {
        this.canvas.width = this.sizes.width;
        this.canvas.height = this.sizes.height;
    }

    destroy()
    {
        this.sizes.off('resize')
        this.time.off('tick')

        if(this.debug.active)
            this.debug.ui.destroy()
    }
}