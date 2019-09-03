class Input extends Field {
	constructor(element, form) {
		super(element, form);
		let THIS = this;

		element.addEventListener('input', function(e) { THIS.change(); });

		this.min = (element.hasAttribute('min-s')) ? parseInt(element.getAttribute('min-s')) : 0;
		this.max = (element.hasAttribute('max-s')) ? parseInt(element.getAttribute('max-s')) : Infinity;
		this.required = (element.hasAttribute('required')) ? true : false;
		this.change();
		super.setValid(this.verify());
	}

	change() {
		if (this.verify())
			super.validate();
		else
			super.unvalidate();
	}

	verify() {
		let content = super.getElement().value;
		if (this.required && content === "") {
			super.sendError("Ce champs doit être rempli");
			return false;
		}
		if (content.length < this.min) {
			super.sendError("Doit contenir plus de "+this.min+" caractères");
			return false;
		}
		if (content.length > this.max) {
			super.sendError("Doit contenir moins de "+this.max+" caractères");
			return false;
		}
		super.removeError();
		return true;
	}
}

export {Input};