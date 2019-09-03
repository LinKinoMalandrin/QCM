const Level = (function() {
    let level = {};

    let ILevel = function(element, settings) {
        let level = {};
        
        function build() {
            level.element = element;
            level.from = (settings.from) ? settings.from : 0;
            level.to = (settings.to) ? settings.to : 100;
            level.now = (settings.start) ? settings.start : 0;
            level.step = (settings.step) ? settings.step : 1;
            if (settings.relativeStart) level.now = level.from + ((level.to - level.from) * settings.relativeStart);
            level.onchange = [];
            level.linked = [];
        }

        level.percentage = function() {
            return level.now / (level.to - level.from);
        }

        level.iPercentage = function() {
            return 1 - (level.now / (level.to - level.from));
        }

        level.addOnChange = function(callback) {
            level.onchange.push(callback);
        }

        level.value = function() {
            return level.now;
        }

        level.change = function() {
            for (let callback of level.onchange)
                callback();
            for (let linked of level.linked)
                linked.linkChange(level);
        }

        level.linkedChange = function() {
            for (let callback of level.onchange)
                callback();
        }

        level.link = function(toLink) {
            level.linked.push(toLink);
            toLink.linked.push(level);
        }

        level.linkChange = function(link) {
            level.now = Math.round(link.percentage() * (level.to - level.from));
            level.linkedChange();
        }

        level.setPercentage = function(value) {
            
        }

        build();
        return level;
    }

    let Wheel = function(element, settings) {
        let wheel = new ILevel(element, settings);

        function build() {
            wheel.element.addEventListener("mousewheel", function(e) { wheel.onWheel(e); }, false);
	        wheel.element.addEventListener("DOMMouseScroll", function(e) { wheel.onWheel(e); }, false);
        }

        build();
        return wheel;
    }

    level.Wheel = function(element, settings) {
        let wheel = new Wheel(element, settings);

        wheel.onWheel = function(e) {
            e = window.event || e;
            e.preventDefault();
            if (e.ctrlKey) return;

            let delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
            let move = delta * wheel.step;
            wheel.now += move;
            if (wheel.now < wheel.from || wheel.now > wheel.to)
                wheel.now -= move;
            wheel.change();
        }

        return wheel;
    }
    level.ControlWheel = function(element, settings) {
        let wheel = new Wheel(element, settings);

        wheel.onWheel = function(e) {
            e = window.event || e;
            e.preventDefault();
            if (!(e.ctrlKey)) return;

            let delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
            let move = delta * wheel.step;
            wheel.now += move;
            if (wheel.now < wheel.from || wheel.now > wheel.to)
                wheel.now -= move;
            wheel.change();
        }

        return wheel;
    }
    level.DualWheel = function(element, settings) {
        let wheel = {};

        function build() {
            wheel.control = new level.ControlWheel(element, settings.control);
            wheel.normal = new level.Wheel(element, settings.normal);
        }

        wheel.change = function() {
            wheel.control.change();
            wheel.normal.change();
        }

        wheel.addOnChange = function(onchange) {
            if (onchange.normal) wheel.normal.addOnChange(onchange.normal);
            if (onchange.control) wheel.control.addOnChange(onchange.control);

            return wheel;
        }

        build();

        return wheel;
    }

    let Hover = function(element, settings) {
        let hover = new ILevel(element, settings);

        function build() {
            hover.active = false;
            hover.element.addEventListener('mouseover', function(e) { hover.active = true; });
            hover.element.addEventListener('mouseleave', function(e) { hover.active = false; });
            hover.element.addEventListener('mousemove', function(e) { if (hover.active) hover.onHover(e); });
        }

        build();
        return hover;
    }

    level.HorizontalHover = function(element, settings) {
        settings.merge({ to:element.offsetWidth });
        let hover = new Hover(element, settings);

        hover.onHover = function(e) {
            e = window.event || e;
            e.preventDefault();

            hover.now = e.clientX - hover.element.getBoundingClientRect().left;

            if (hover.now > hover.to) hover.now = hover.to;
            if (hover.now < hover.from) hover.now = hover.from;

            hover.change();
        }

        return hover;
    }
    level.VerticalHover = function(element, settings) {
        settings.merge({ to:element.offsetHeight });
        let hover = new Hover(element, settings);

        hover.onHover = function(e) {
            e = window.event || e;
            e.preventDefault();
            
            hover.now = e.clientY - hover.element.getBoundingClientRect().top;

            if (hover.now > hover.to) hover.now = hover.to;
            if (hover.now < hover.from) hover.now = hover.from;

            hover.change();
        }

        return hover;
    }
    level.DualHover = function(element, settings) {
        let hover = {};

        function build() {
            hover.x = new level.HorizontalHover(element, settings.x);
            hover.y = new level.VerticalHover(element, settings.y);
        }

        hover.change = function() {
            hover.x.change();
            hover.y.change();
        }

        hover.addOnChange = function(onchange) {
            if (onchange.x) hover.x.addOnChange(onchange.x);
            if (onchange.y) hover.y.addOnChange(onchange.y);

            return hover;
        }

        build();

        return hover;
    }

    let MouseDown = function(element, settings) {
        let mouse = new ILevel(element, settings);

        function build() {
            mouse.element.addEventListener('mousedown', function(e) { e.preventDefault(); mouse.onMouseDown(e); });
            mouse.active = false;
            document.addEventListener('mousemove', function(e) {
                mouse.moved(e);
            });
            document.addEventListener('mouseup', function(e) {
                mouse.active = false;
            });
        }

        build();
        return mouse;
    }

    level.XMouseDown = function(element, settings) {
        let mouse = new MouseDown(element, settings);

        mouse.onMouseDown = function(e) {
            mouse.active = true;
            mouse.previous = e.clientX;
        }
        mouse.moved = function(e) {
            if (mouse.active) {
                mouse.action = e.clientX;
                mouse.now += (mouse.action - mouse.previous) * mouse.step;
                if (mouse.now > mouse.to) mouse.now = mouse.to;
                if (mouse.now < mouse.from) mouse.now = mouse.from;
                mouse.previous = mouse.action;
                mouse.change();
            }
        }

        return mouse;
    }
    level.YMouseDown = function(element, settings) {
        let mouse = new MouseDown(element, settings);

        mouse.onMouseDown = function(e) {
            mouse.active = true;
            mouse.previous = e.clientY;
        }
        mouse.moved = function(e) {
            if (mouse.active) {
                mouse.action = e.clientY;
                mouse.now += (mouse.action - mouse.previous) * mouse.step;
                if (mouse.now > mouse.to) mouse.now = mouse.to;
                if (mouse.now < mouse.from) mouse.now = mouse.from;
                mouse.previous = mouse.action;
                mouse.change();
            }
        }

        return mouse;
    }
    level.DualMouseDown = function(element, settings) {
        let mouse = {};

        function build() {
            mouse.x = new level.XMouseDown(element, settings.x);
            mouse.y = new level.YMouseDown(element, settings.y);
        }

        mouse.change = function() {
            mouse.x.change();
            mouse.y.change();
        }

        mouse.addOnChange = function(onchange) {
            if (onchange.x) mouse.x.addOnChange(onchange.x);
            if (onchange.y) mouse.y.addOnChange(onchange.y);

            return mouse;
        }

        build();

        return mouse;
    }

    let Drag = function(element, dragE, settings) {
        let drag = new ILevel(element, settings);

        function build() {
            drag.drag = dragE;
            drag.active = false;

            drag.drag.addEventListener('mousedown', function() { drag.active = true; });
            document.addEventListener('mousemove', function(e) { if (drag.active) drag.onMove(e); });
            document.addEventListener('mouseup', function() { drag.active = false; });
        }

        build();
        return drag;
    }

    level.XDrag = function(element, dragE, settings) {
        settings = {padding:{left:0, right:0}}.merge(settings);
        settings.merge({
            from:settings.padding.left + dragE.offsetWidth/2,
            to:element.offsetWidth - dragE.offsetWidth/2 - settings.padding.right
        });
        let drag = new Drag(element, dragE, settings);

        function build() {
            drag.padding = {};
            drag.padding.left = settings.left;
            drag.padding.right = settings.right;
        }

        drag.onMove = function(e) {
            drag.now = e.clientX - drag.element.getBoundingClientRect().left;
            if (drag.now > drag.to) drag.now = drag.to;
            if (drag.now < drag.from) drag.now = drag.from;
            drag.change();
        }

        build();
        return drag;
    }

    level.YDrag = function(element, dragE, settings) {
        settings = {padding:{top:0, bottom:0}}.merge(settings);
        settings.merge({
            from:settings.padding.top + dragE.offsetHeight/2,
            to:element.offsetHeight - dragE.offsetHeight/2 - settings.padding.bottom
        });
        let drag = new Drag(element, settings);

        function build() {
            drag.padding = {};
            drag.padding.top = settings.top;
            drag.padding.bottom = settings.bottom;
        }

        drag.onMove = function(e) {
            drag.now = e.clientY - drag.element.getBoundingClientRect().top;
            if (drag.now > drag.to) drag.now = drag.to;
            if (drag.now < drag.from) drag.now = drag.from;
            drag.change();
        }

        build();
        return drag;
    }
    
    return level;
})();