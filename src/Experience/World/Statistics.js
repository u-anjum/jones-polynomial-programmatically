import Experience from '../Experience.js'
import { getCrossings } from '../Utils/Crossings.js'

export default class Statistics
{
    constructor(curve)
    {
        this.experience = new Experience()
        this.context = this.experience.context
        this.crossings = 0
        this.curve = curve

        this.box = document.getElementById('knot-details')
    }

    render() {
        if(!this.curve.isClosed) {
            this.box.innerHTML = "<b style='color:red'>Knot is not closed, please join the starting and ending strands</b>"
        }
        else {
            this.crossings = getCrossings(this.curve);

            this.box.innerHTML = `
                <table width='100%'>
                    <tr>
                        <td>Crossings</td>
                        <td>${this.crossings.length}</td>
                    </tr>
                </table>
            `;
        }
    }

    renderCrossings() {
        for(let i=0; i<this.crossings.length; i++) {
            this.context.beginPath();
            this.context.strokeStyle = "#f00"
            this.context.arc(this.crossings[i].x, this.crossings[i].y, 25, 2 * Math.PI, false);
            this.context.stroke();
        }
    }
}