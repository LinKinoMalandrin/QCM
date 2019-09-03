class Field {
	constructor(element, form) {
		this.element = element;

		let e = document.createElement('div');
		e.classList.add('error-field');
		element.parentNode.insertBefore(e, element.nextSibling);

		this.error = e;
		this.form = form;
		this.valid = this.verify();
	}

	change() {
		if (this.verify()) {
			this.valid = true;
			this.element.classList.remove('error');
		} else {
			this.valid = false;
			this.element.classList.add('error');
		}
		this.form.verify();
	}

	sendError(message) {
		this.error.classList.remove('hidden');
		this.error.innerHTML = message;
	}

	verify() { return true; }
	getElement() { return this.element; }
	setValid(valid) { this.valid = valid; }
	isValid() { return this.valid; }
	removeError() { this.error.classList.add('hidden'); }
	
	validate() {
		if (!(this.valid)) {
			this.valid = true;
			this.cleanErrors();
		}
	}
}

export {Field};