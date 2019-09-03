let e = getId('container');
let dot = new Graphics.Dot({
    thickness:20,
    color:'red'
});

let drag = new Level.XDrag(e, dot.element, {
    padding:{left:10, right:10}
});
drag.addOnChange(function() {
    dot.move({x:drag.value()});
});
