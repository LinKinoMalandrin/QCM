const Creator = (function() {
    let creator = {};

    creator.createElement = function(param) {
        let e;

        param.tag = (param.tag) ? param.tag : 'div';
        e = document.createElement(param.tag);

        if (param.before)
            param.before.parentNode.insertBefore(e, param.before);

        else if (!param.parentNode) param.parentNode = document.body;
    
        else param.parentNode.appendChild(e);

        if (param.id) e.id = param.id;
        if (param.classList) for (let _class of param.classList) e.classList.add(_class);
        if (param.click) e.addEventListener('click', param.click);
        if (param.mousedown) e.addEventListener('mousedown', param.onclick);
        if (param.mouseup) e.addEventListener('mouseup', param.onclick);
        if (param.content) e.innerHTML = param.content;

        if (param.contains) {
            param.contains.parentNode = e;
            creator.createElement(param.contains);
        }
        if (param.containsMultiple) 
            for (let contained of param.containsMultiple) {
                contained.parentNode = e;
                creator.createElement(contained);
                e.appendChild(contained);
            }

        if (param.containsObject) e.appendChild(param.containsObject);
        if(param.containsMultipleObjects) for (let contained of param.containsMultipleObjects) e.appendChild(contained);

        if (param.src) e.src = param.src;
        if (param.type) e.type = param.type;

        return e;
    }

    creator.update = function(element, param) {
        param.parentNode = element.parentNode;
        param.before = element.nextSibling;
        element.remove();
        creator.createElement(param);
    }

    return creator;
})();