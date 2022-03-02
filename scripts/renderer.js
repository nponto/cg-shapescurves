class Renderer {
    // canvas:              object ({id: __, width: __, height: __})
    // num_curve_sections:  int
    constructor(canvas, num_curve_sections, show_points_flag) {
        this.canvas = document.getElementById(canvas.id);
        this.canvas.width = canvas.width;
        this.canvas.height = canvas.height;
        this.ctx = this.canvas.getContext('2d');
        this.slide_idx = 0;
        this.num_curve_sections = num_curve_sections;
        this.show_points = show_points_flag;
    }

    // n:  int
    setNumCurveSections(n) {
        this.num_curve_sections = n;
        this.drawSlide(this.slide_idx);
    }

    // flag:  bool
    showPoints(flag) {
        this.show_points = flag;
        this.drawSlide(this.slide_idx);
    }
    
    // slide_idx:  int
    drawSlide(slide_idx) {
        this.slide_idx = slide_idx;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        switch (this.slide_idx) {
            case 0:
                this.drawSlide0(this.ctx);
                break;
            case 1:
                this.drawSlide1(this.ctx);
                break;
            case 2:
                this.drawSlide2(this.ctx);
                break;
            case 3:
                this.drawSlide3(this.ctx);
                break;
        }
    }

    // ctx:          canvas context
    drawSlide0(ctx) {
        this.drawRectangle(({x: 200, y: 300}), ({x: 400, y: 400}), [125,125,75, 255], ctx);
        
    }

    // ctx:          canvas context
    drawSlide1(ctx) {
        this.drawCircle(({x: 400, y: 400}), 150, [0,255,255,255], ctx);
    }

    // ctx:          canvas context
    drawSlide2(ctx) {
        this.drawBezierCurve(({x: 150, y: 150}), ({x: 200, y: 250}), ({x: 300, y: 350}), ({x: 350, y: 225}), [255,0,255,255], ctx);
    }

    // ctx:          canvas context
    drawSlide3(ctx) {
        this.drawRectangle(({x: 25, y: 150}), ({x: 40, y: 400}), [255,165,0, 255], ctx);
        this.drawBezierCurve(({x: 40, y: 320}), ({x: 60, y: 450}), ({x: 170, y: 480}), ({x: 150, y: 150}), [255,165,0,255], ctx);
        this.drawCircle(({x: 275, y: 225}), 75, [255,165,0,255], ctx);
        this.drawCircle(({x: 450, y: 225}), 75, [255,165,0,255], ctx);
        this.drawRectangle(({x: 520, y: 150}), ({x: 530, y: 300}), [255,165,0, 255], ctx);
        this.drawRectangle(({x: 575, y: 150}), ({x: 590, y: 500}), [255,165,0, 255], ctx);
        this.drawBezierCurve(({x: 590, y: 420}), ({x: 605, y: 450}), ({x: 735, y: 500}), ({x: 715, y: 150}), [255,165,0,255], ctx);


    }

    // left_bottom:  object ({x: __, y: __})
    // right_top:    object ({x: __, y: __})
    // color:        array of int [R, G, B, A]
    // ctx:          canvas context
    drawRectangle(left_bottom, right_top, color, ctx) {
        let pt1 = {x: left_bottom.x, y: right_top.y};
        let pt3 = {x: right_top.x, y: left_bottom.y};

        this.drawLine(left_bottom, pt1, color, ctx);
        this.drawLine(pt1, right_top, color, ctx);
        this.drawLine(right_top, pt3, color, ctx);
        this.drawLine(pt3, left_bottom, color, ctx);

        if (this.show_points) {
            ctx.strokeStyle = "black";
            ctx.strokeRect(left_bottom.x-2.5, left_bottom.y-2.5, 10, 10);
            ctx.strokeRect(pt1.x-2.5, pt1.y-2.5, 10, 10);
            ctx.strokeRect(right_top.x-2.5, right_top.y-2.5, 10, 10);
            ctx.strokeRect(pt3.x-2.5, pt3.y-2.5, 10, 10);
        }

    }

    // center:       object ({x: __, y: __})
    // radius:       int
    // color:        array of int [R, G, B, A]
    // ctx:          canvas context
    drawCircle(center, radius, color, ctx) {
        
        let slider_value = document.getElementById('sections').value;
        let pts = []; // array to keep track of points for point data

        ctx.strokeStyle = 'rgba(' + color[0] + ',' + color[1] + ',' + color[2] + ',' + (color[3]/255.0) + ')';
        ctx.beginPath();
        for (let i = 0; i < slider_value; i++) {
            
            let angle = (i / slider_value) * (2 * Math.PI);
            let newx = center.x + radius * Math.cos(angle);
            let newy = center.y + radius * Math.sin(angle);

            pts.push({x: newx, y: newy});
            ctx.lineTo(newx, newy);
        }

        ctx.closePath();
        ctx.stroke();

        if (this.show_points) {
           for (let i = 0; i < pts.length; i++) {
            ctx.strokeStyle = "black";
            ctx.strokeRect(pts[i].x-2.5, pts[i].y-2.5, 10, 10);
           }
            
        }
        
    }

    // pt0:          object ({x: __, y: __})
    // pt1:          object ({x: __, y: __})
    // pt2:          object ({x: __, y: __})
    // pt3:          object ({x: __, y: __})
    // color:        array of int [R, G, B, A]
    // ctx:          canvas context
    drawBezierCurve(pt0, pt1, pt2, pt3, color, ctx) {
        
        let slider_value = document.getElementById('sections').value;
        let pts = []; // array to keep track of points for point data
        
        ctx.strokeStyle = 'rgba(' + color[0] + ',' + color[1] + ',' + color[2] + ',' + (color[3]/255.0) + ')';
        ctx.beginPath();
        ctx.moveTo(pt0.x, pt0.y);
        let t;
        for (t = 0; t < 1; t+=1/slider_value) {

            let newx = Math.pow((1-t),3) * pt0.x + 3 * Math.pow((1-t), 2) * t * pt1.x + 3 * (1-t) * Math.pow(t, 2) * pt2.x + Math.pow(t,3) * pt3.x;
            let newy = Math.pow((1-t),3) * pt0.y + 3 * Math.pow((1-t), 2) * t * pt1.y + 3 * (1-t) * Math.pow(t, 2) * pt2.y + Math.pow(t,3) * pt3.y;
            
            ctx.lineTo(newx, newy);
            pts.push({x: newx, y: newy});
        }
        t = 1;
        let newnewx = Math.pow((1-t),3) * pt0.x + 3 * Math.pow((1-t), 2) * t * pt1.x + 3 * (1-t) * Math.pow(t, 2) * pt2.x + Math.pow(t,3) * pt3.x;
        let newnewy = Math.pow((1-t),3) * pt0.y + 3 * Math.pow((1-t), 2) * t * pt1.y + 3 * (1-t) * Math.pow(t, 2) * pt2.y + Math.pow(t,3) * pt3.y;

        ctx.lineTo(newnewx, newnewy);
        pts.push({x: newnewx, y: newnewy});
        ctx.stroke();

        if (this.show_points) {
            ctx.strokeStyle = "red";
            ctx.strokeRect(pt1.x, pt1.y, 10, 10);
            ctx.strokeRect(pt2.x, pt2.y, 10, 10);
            ctx.strokeStyle = "black";
            for (let i = 0; i < pts.length; i++) {
             ctx.strokeRect(pts[i].x-2.5, pts[i].y-2.5, 10, 10);
            }
             
         }
        
    }


    // pt0:          object ({x: __, y: __})
    // pt1:          object ({x: __, y: __})
    // color:        array of int [R, G, B, A]
    // ctx:          canvas context
    drawLine(pt0, pt1, color, ctx)
    {
        ctx.strokeStyle = 'rgba(' + color[0] + ',' + color[1] + ',' + color[2] + ',' + (color[3]/255.0) + ')';
        ctx.beginPath();
        ctx.moveTo(pt0.x, pt0.y);
        ctx.lineTo(pt1.x, pt1.y);
        ctx.stroke();
    }
};
