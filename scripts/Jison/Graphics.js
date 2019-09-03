const Graphics = (function() {
    let graphics = {};

    graphics.Dot = function(param) {
        let dot = {};

        function build() {
            dot.x = (param.x) ? param.x : 0;
            dot.y = (param.y) ? param.y : 0;
            dot.thickness = (param.thickness) ? param.thickness : 4;
            dot.color = (param.color) ? param.color : 'red';
            dot.parentNode = (param.parentNode) ? param.parentNode : document.body;
            dot.onmove = [];

            dot.element = Creator.createElement({
                classList:['graphics-dot', dot.color],
                parentNode:dot.parentNode
            });

            dot.position();
            dot.element.style.width = param.thickness + 'px';
            dot.element.style.height = param.thickness + 'px';
            dot.element.style.borderRadius = param.thickness + 'px';
        }
        
        dot.position = function() {
            dot.element.style.transform = 'translate('+(dot.x - (dot.thickness / 2))+'px, '+(dot.y - (dot.thickness / 2))+'px)';
        }

        dot.move = function(pos) {
            if (pos.x || pos.x == 0) dot.x = pos.x;
            if (pos.y || pos.y == 0) dot.y = pos.y;
            dot.position();
            for (let callback of dot.onmove)
                callback();
            return dot;
        }
        dot.addOnMove = function(callback) {
            dot.onmove.push(callback);
            return dot;
        }

        build();

        return dot;
    }

    graphics.Line = function(from, to, param) {
        let line = {};

        function build() {
            from.x = (from.x) ? from.x : 0;
            from.y = (from.y) ? from.y : 0;
            to.x = (to.x) ? to.x : 0;
            to.y = (to.y) ? to.y : 0;

            line.from = {x:from.x, y:from.y};
            line.to = {x:to.x, y:to.y};
            line.thickness = (param.thickness) ? param.thickness : 2;
            line.color = (param.color) ? param.color : 'blue';
            line.parentNode = (param.parentNode) ? param.parentNode : document.body;

            line.element = Creator.createElement({
                parentNode:line.parentNode,
                classList:['graphics-line', line.color]
            });

            line.element.style.height = line.thickness + "px";
            line.element.style.borderRadius = line.thickness + 'px';

            line.position();
        }
        
        line.position = function() {
            line.dx = Math.abs(line.from.x - line.to.x);
            line.dy = Math.abs(line.from.y - line.to.y);

            line.size = Math.sqrt(line.dx**2 + line.dy**2);

            line.element.style.width = line.size + "px";

            if (line.to.x >= line.from.x && line.to.y >= line.from.y)
                line.angle =  Math.atan(line.dy / line.dx);
            else if (line.to.x >= line.from.x && line.to.y <= line.from.y)
                line.angle =  -1 * Math.atan(line.dy / line.dx);
            else if (line.to.x <= line.from.x && line.to.y >= line.from.y)
                line.angle = (Math.PI / 2) + Math.atan(line.dx / line.dy);
            else
                line.angle = (Math.PI / -2) - Math.atan(line.dx / line.dy);

            let left = line.from.x - Math.sin(line.angle) * line.thickness / -2;
            let top = line.from.y - Math.cos(line.angle) * line.thickness / 2;

            line.element.style.transform = 'translate('+left+'px, '+top+'px) rotate('+line.angle+'rad)';
        }

        line.move = function(pos) {
            if (pos.from) {
                if (pos.from.x || pos.from.x === 0) line.from.x = pos.from.x;
                if (pos.from.y || pos.from.y === 0) line.from.y = pos.from.y;
            } if (pos.to) {
                if (pos.to.x || pos.to.x === 0) line.to.x = pos.to.x;
                if (pos.to.y || pos.to.y === 0) line.to.y = pos.to.y;
            }
            line.position();
        }

        line.link = function(dots) {
            if (dots.from) dots.from.addOnMove(function() {line.move({from:dots.from}); });
            if (dots.to) dots.to.addOnMove(function() {line.move({to:dots.to}); });
        }

        
        build();
        return line;
    }
    
    return graphics;
})();