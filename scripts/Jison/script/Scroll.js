class Scroll {
	constructor(element, onscroll) {
		let THIS = this;

		this.element = element;
		this.addOnScroll(function(e) {
			THIS.refreshScroll();
		});

		this.addOnScroll(onscroll);

		this.scroll = 0;
		this.total = 0;
		this.size = 0;
	}

	addOnScroll(onscroll) {
		let THIS = this;
		this.element.addEventListener('scroll', function(e) {
			onscroll(e, THIS);
		});
	}

	refreshScroll() {  }

	getScroll() {
		console.log("in scroll");
		return this.scroll;
	}
	getPercentage() {
		console.log("scroll : "+this.scroll);
		console.log("total : "+this.total);
		console.log("size : "+this.size);
		return this.scroll / (this.total - this.size);
	}
	getElement() {
		return this.element;
	}
	setScroll(scroll) {
		this.scroll = scroll;
	}
	setTotal(total) {
		this.total = total;
	}
	setSize(size) {
		this.size = size;
	}
}

class VerticalScroll extends Scroll {
	constructor(element, onscroll) {
		super(element, onscroll);
	}
	refreshScroll() {
		super.setScroll(super.getElement().scrollTop);
		super.setTotal(super.getElement().scrollHeight);
		super.setSize(super.getElement().clientHeight);
	}
}

class HorizontalScroll extends Scroll{
	constructor(element, onscroll) {
		super(element, onscroll);
	}
	refreshScroll() {
		super.setScroll(super.getElement().scrollLeft);
		super.setTotal(super.getElement().scrollWidth);
		super.setSize(super.getElement().clientWidth);
	}
}

class BodyScroll extends VerticalScroll {
	constructor(onscroll) {
		super(document.documentElement, onscroll);
	}
	addOnScroll(onscroll) {
		let THIS = this;
		document.addEventListener('scroll', function(e) {
			onscroll(e, THIS);
		});
	}
}

export {Scroll, BodyScroll, VerticalScroll, HorizontalScroll} ;