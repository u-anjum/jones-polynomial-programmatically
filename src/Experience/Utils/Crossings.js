import { getDistance

 } from "./Math";
export const getCrossings = (curve) => {
    let pt_dict = [];
    let crossings = []

    for(let index = 0; index < curve.points.length-1; index += 2) {
        for(let t=0; t <= 1; t += 0.01) {
            const p1 = curve.points[index];
            const p2 = curve.points[(index+1) % curve.points.length]
            const p3 = curve.points[(index+2) % curve.points.length]

            // console.log(p1, p2, p3, index)
            const pt = curve.getCurve(p1, p2, p3, t);
            const point_index = 'x-' + Math.floor(pt.x * 1) + '-y-' + Math.floor(pt.y * 1)
            pt_dict.push({
                x: pt.x, y: pt.y, index
            })

            const start_point = index == curve.points.length - 3 ? 50 : 0

            for(let j=start_point; j<pt_dict.length - 200; j++) {
                if(getDistance(pt_dict[j], pt) < 3) {
                    crossings.push({
                        x: pt.x,
                        y: pt.y,
                        t: t,
                        index: index,
                        index2: pt_dict[j].index
                    })
                }
            }

            pt_dict[point_index] = index;
        }
    }

    //remove crossings that are too close to each other
    const new_cross_array = []
    for(let i=0; i<crossings.length; i++) {
        if(getDistance(crossings[i], crossings[(i+1) % crossings.length]) > 15)
            new_cross_array.push(crossings[i])
    }
    
    return new_cross_array
}