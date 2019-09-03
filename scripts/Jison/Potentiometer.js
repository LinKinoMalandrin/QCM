const ScrollPotentiometer = function(element, settings) {
    let it = {};

    let MouseWheelHandler = function(e) {
        e = window.event || e;
        let delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
        let move = delta * it.step;
        it.now += move;
        if (it.now < it.from || it.now > it.to)
            it.now -= move;
        it.change();
    }

    it.change = function() {
        for (let callback of it.onchange)
            callback();
    }

    function build() {
        it.element = element;
        it.from = (settings.from) ? settings.from : 0;
        it.to = (settings.to) ? settings.to : 100;
        it.now = (settings.start) ? settings.start : 0;
        it.step = (settings.step) ? settings.step : 1;
        it.onchange = [];

	    it.element.addEventListener("mousewheel", MouseWheelHandler, false);
	    it.element.addEventListener("DOMMouseScroll", MouseWheelHandler, false);
    }

    it.percentage = function() {
        return it.now / (it.to - it.from);
    }

    it.addOnChange = function(callback) {
        it.onchange.push(callback);
        return it;
    }

    build();
    return it;
}

const ScrollControlPotentiometer = function(element, settings) {
    let it = {};

    let MouseWheelHandler = function(e) {
        e = window.event || e;
        e.preventDefault();
        if (e.ctrlKey) wheelOn(it.control, e);
        else wheelOn(it.normal, e);
    }

    function wheelOn(obj, e) {
        let delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
        let move = delta * obj.step;
        obj.now += move;
        if (obj.now < obj.from || obj.now > obj.to)
            obj.now -= move;

        for (let callback of obj.onchange)
            callback();
    }

    it.change = function() {
        for (let callback of it.normal.onchange)
            callback();
        for (let callback of it.control.onchange)
            callback();
    }

    function build() {
        it.element = element;
        it.normal = {};
        it.control = {};

        initialize(it.normal, settings.normal);
        initialize(it.control, settings.control);

	    it.element.addEventListener("mousewheel", MouseWheelHandler, false);
	    it.element.addEventListener("DOMMouseScroll", MouseWheelHandler, false);
    }

    function initialize(obj, settings) {
        obj.from = (settings.from) ? settings.from : 0;
        obj.to = (settings.to) ? settings.to : 100;
        obj.now = (settings.start) ? settings.start : 0;
        obj.step = (settings.step) ? settings.step : 1;
        obj.onchange = [];
    }

    it.controlPercentage = function() {
        return it.control.now / (it.control.to - it.control.from);
    }
    it.controlPercentage = function() {
        return it.control.now / (it.control.to - it.control.from);
    }

    it.normalIPercentage = function() {
        return 1 - (it.normal.now / (it.normal.to - it.normal.from));
    }
    it.controlIPercentage = function() {
        return 1 - (it.control.now / (it.control.to - it.control.from));
    }

    it.addOnChange = function(callback) {

        if (callback.normal) it.normal.onchange.push(callback.normal);
        if (callback.control) it.control.onchange.push(callback.control);

        return it;
    }

    build();
    return it;
}