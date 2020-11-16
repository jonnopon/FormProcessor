// NOTE: depends on lodash.assign
// html requests lodash.min.js from CDN; but should retrieve lodash.assign as an individual resource by build process

// form processing unit, handling validation and event handling for forms - either single forms, or "multi forms" like the one originally provided by Luke
class FormProcessor{
	constructor(selector, validationRules, events) {
		// the form we're operating on
		this.form = document.querySelector(selector);

		// a to-be-constructed map of validation rules for all forms
		this.validators = {};

		// a list of validation errors, populated by validate()
		this.validationErrors = [];

		this.initialise(validationRules, events);
	}

	initialise(validationRules, events) {
		// register events
		for (const event of Object.keys(events)) {
			// all events bound to this instance to simplify callbacks
			// justification: form instance normally bound as this for eventListener callback still available via "this".form
			this.form.addEventListener(event, events[event].bind(this));
		}

		// register validation rules
		// make 'all' a reserved name for generic multi-form validation
		const allValidators = validationRules.all || {};
		const otherFormKeys = Object.keys(validationRules).filter((key) => key !== 'all');

		// are we a multi-form or a single-form?
		if (!!otherFormKeys.length) {
			// register real complete validators for each form under its key
			// by doing this, we remove the need for the original "genericValidation()" stage - validating a named form will now cover both generic and specific aspects
			for (const key of otherFormKeys) {
				// lodash.assign to clone-and-merge allValidators with formValidators
				this.validators[key] = _.assign({}, allValidators, validationRules[key]);
			}
		}
		else {
			// register the validators as-is for the 'all' key
			// lodash.assign to clone them for overkill reference safety
			this.validators['all'] = _.assign({}, allValidators);
		}
	}

	resetValidity() {
		// reset the validity of all forms, handles both multi and single because it traverses errors rather than the form itself
		for (const {el, hint} of this.validationErrors) {
			el.classList.remove('invalid');

			if (hint) {
				// hints are optional
				hint.style.display = 'none';
			}
		}

		// reset the validationErrors
		this.validationErrors = [];
	}

	validate(formName = 'all') {
		// before validating, remove any existing validation errors
		this.resetValidity();

		// validate the given form name
		for (const [name, validation] of Object.entries(this.validators[formName])) {
			const input = document.querySelector(`[name="${name}"]`);
			let validationResult;

			switch (validation.type) {
				case 'regex':
					validationResult = this.regexValidation(input, validation.regex, name);
					break;
				case 'radio':
					validationResult = this.radioValidation(name);
					break;
				default:
					this.handleError(
						new ProcessingError(
							'validation',
							"There's an issue trying to validate the form, please try again.",
							`Unable to find the validation type for the input: ${name}`
						)
					);

					// end processing
					return;
			}

			const {valid, el} = validationResult;

			if (!valid) {
				const hint = document.querySelector(`#hint-${name}`);

				this.validationErrors.push({ el, hint });

				el.classList.add('invalid');
				if (hint) {
					hint.style.display = 'block';	
				}
			}
		}
	}

	handleError(e) {
		// just log for now
		console.log(e);
	}

	regexValidation(input, regex, name) {
		// simple pass-through regex testing
		return {
			valid: regex.test(input.value),
			el: input
		};
	}

	radioValidation(name) {
		// Get the radio btns for the name provided and check if at least one of them is checked
		const radioBtns = Array.from(document.querySelectorAll(`[name="${name}"]`));

		return {
			valid: radioBtns.some((radio) => radio.checked),
			el: document.querySelector(`#form-box-${name}`)
		}
	}
}