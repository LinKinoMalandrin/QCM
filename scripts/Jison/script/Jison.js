function getId(id) { return document.getElementById(id); }
function getTag(e, tag) { return e.getElementsByTagName(tag); }

let Jison = (function() {
    let jison = {};

    /*
    ##################################################################################################
    private class Scroll
    ##################################################################################################
    */

    let Scroll = function(element, onscroll) {

        let scroll = {};
        
        scroll.addOnScroll = function(onscroll) {
            scroll.element.addEventListener('scroll', function(e) {
                onscroll(e, scroll);
            });
        }
        scroll.refreshScroll = function() { };
        scroll.getScroll = function() { return scroll.scroll};
        scroll.getPercentage = function() { return scroll.scroll / (scroll.total - scroll.size); }
        scroll.getElement = function() { return scroll.element; }

        scroll.element = element;
        scroll.addOnScroll(onscroll);
        scroll.scroll = 0;
        scroll.total = 0;
        scroll.size = 0;

        return scroll;
    }

    /*
    ##################################################################################################
    public class VerticalScroll
    ##################################################################################################
    */

    jison.VerticalScroll = function(element, onscroll) {

        let scroll = new Scroll(element, onscroll);

        scroll.refreshScroll = function() {
            scroll.scroll = scroll.element.scrollTop;
            scroll.total = scroll.element.scrollHeight;
            scroll.size = scroll.element.clientHeight;
        }
        return scroll;
    }

    /*
    ##################################################################################################
    public class HorizontalScroll
    ##################################################################################################
    */

    jison.HorizontalScroll = function(element, onscroll) {

        let scroll = new Scroll(element, onscroll);

        scroll.refreshScroll = function() {
            scroll.scroll = scroll.element.scrollLeft;
            scroll.total = scroll.element.scrollWidth;
            scroll.size = scroll.element.clientWidth;
        }

        return scroll;
    }

    /*
    ##################################################################################################
    public class BodyScroll
    ##################################################################################################
    */

    jison.BodyScroll = function(onscroll) {

        let scroll = new jison.VerticalScroll(document.documentElement, onscroll);

        scroll.addOnScroll = function(onscroll) {
            document.addEventListener('scroll', function(e) {
                onscroll(e, scroll);
            });
        }
        
        return scroll;
    }

    /*
    ##################################################################################################
    private class Field
    ##################################################################################################
    */

    let Field = function(element, form) {

        let field = {};
        
        field.change = function() {
            if (field.verify()) {
                field.valid = true;
                field.element.classList.remove('error');
            } else {
                field.valid = false;
                field.element.classList.add('error');
            }
            field.form.verify();
        }

        field.sendError = function(message) {
            field.error.classList.remove('hidden');
            field.error.innerHTML = message;
        }

        field.verify = function() { };
        field.isValid = function() { return field.valid; };
        field.validate = function() { 
            if (!this.valid) {
                field.valid = true;
                field.element.classList.remove('error');
                field.error.classList.add('hidden');
                field.form.verify();
            }
        }
        field.unvalidate = function() { 
            if (this.valid) {
                field.valid = false;
                field.element.classList.add('error');
                field.error.classList.remove('hidden');
                field.form.verify();
            }
        }

        field.element = element;

		let e = document.createElement('div');
		e.classList.add('error-field');
		element.parentNode.insertBefore(e, element.nextSibling);

		field.error = e;
		field.form = form;
        field.valid = field.verify();

        return field;
    }

    /*
    ##################################################################################################
    private class Input
    ##################################################################################################
    */

    let Input = function(element, form) {
        let attribute = (element.hasAttribute('verification')) ? element.getAttribute('verification') : "change";
        switch(attribute) {
            case "change" : return new ChangeInput(element, form);
            case "live" : return new LiveInput(element, form);
            case "validate" : return new ValidateInput(element, form);
            default : console.log('Unknown value for verification on input : ' + attribute);
        }
    }
    
    let AbstractInput = function(element, form) {

        let input = new Field(element, form);
        
        input.change = function() {
            if (input.verify())
                input.validate();
            else
                input.unvalidate();
        }

        input.verify = function() {
            let content = input.element.value;
            if (input.required && content === "") {
                input.sendError("Ce champ doit être rempli");
                return false;
            }
            if (content.length < input.min) {
                input.sendError("Doit contenir plus de "+input.min+" caractères");
                return false;
            }
            if (content.length > input.max) {
                input.sendError("Doit contenir moins de "+input.max+" caractères");
                return false;
            }
            return true;
        }

		input.min = (element.hasAttribute('min-s')) ? parseInt(element.getAttribute('min-s')) : 0;
		input.max = (element.hasAttribute('max-s')) ? parseInt(element.getAttribute('max-s')) : Infinity;
        input.required = (element.hasAttribute('required')) ? true : false;
        input.number = (element.hasAttribute('number')) ? true : false;
		input.change();
        input.valid = input.verify();

        return input;
    }

    let LiveInput = function(element, form) {
        let input = new AbstractInput(element, form);
        input.element.addEventListener('input', input.change);
        return input;
    }
    let ChangeInput = function(element, form) {
        let input = new AbstractInput(element, form);
        input.element.addEventListener('change', input.change);
        return input;
    }
    let ValidationInput = function(element, form) {
        return new AbstractInput(element, form);
    }

    /*
    ##################################################################################################
    private class Button
    ##################################################################################################
    */
    
    let Button = function(element) {

        let button = {};

        button.disable = function() {
            button.active = false;
            button.element.setAttribute('disabled', '');
        }
        button.enable = function() {
            button.active = true;
            button.element.removeAttribute('disabled');
        }

        button.element = element;
        button.active = true;

        return button;
    }

    /*
    ##################################################################################################
    private class Form
    ##################################################################################################
    */

    jison.Form = function(element) {
        let form = {};
        
        let construct = function() {
            form.element = element;
            form.fields = [];
            form.buttons = [];

            for (let input of getTag(form.element, 'input'))
                form.fields.push(new Input(input, form));
            for (let button of getTag(form.element, 'button'))
                form.buttons.push(new Button(button));

            form.verify();
        }

        form.verify = function() {
            let error = false;
            for (let field of form.fields)
                if(!(field.isValid()))
                    error = true;
            if (error)
                for (let button of this.buttons)
                    button.disable();
            else
                for (let button of form.buttons)
                    button.enable();
        }

        construct();
        return form;
    }

    return jison;
})();

let f = new Jison.Form(getId("FormTest"));