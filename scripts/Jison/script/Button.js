class Button {
	constructor(element) {
		console.log(element);
		this.element = element;
		this.active = true;
	}
	disable() {
		this.active = false;
		this.element.setAttribute('disabled', '');
	}
	enable() {
		this.active = true;
		this.element.removeAttribute('disabled');
	}
}

export {Button};