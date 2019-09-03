class Form {
	constructor(element) {
		this.element = element;
		this.fields = [];
		this.buttons = [];

		for (let input of this.element.getElementsByTagName('input'))
			this.fields.push(new Input(input, this));

		for (let button of this.element.getElementsByTagName('button'))
			this.buttons.push(new Button(button));

		this.verify();
	}
	verify() {
		let error = false;
		for (let field of this.fields) 
			if (!(field.isValid()))
				error = true;
		if (error)
			for (let button of this.buttons)
				button.disable();
		else
			for (let button of this.buttons)
				button.enable();
	}
}

export {Form};