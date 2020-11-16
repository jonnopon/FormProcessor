// configure a multi-form processor
const mainFormProcessor = new FormProcessor(
	'#main-form',
	{
		all: {
			'form-name': {
				type: 'regex',
				regex: Regexes.exists
			},
			'form-email': {
				type: 'regex',
				// Must be an email address
				regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/,
			},
			'form-telephone': {
				type: 'regex',
				// Must be a telephone number
				regex: /(\+)?[0-9\s]{7,}/,
			}
		},
		enquiry: {
			'form-message': {
				type: 'regex',
				// Must be more than ten characters
				regex: /.{10,}/,
			}
		},
		quote: {
			'form-competitor': {
				type: 'regex',
				regex: Regexes.exists,
			},
			website: {
				type: 'radio',
			},
			branding: {
				type: 'radio',
			},
			launch: {
				type: 'radio',
			},
			'form-summary': {
				type: 'regex',
				// Must be more than ten characters
				regex: /.{10,}/,
			}
		}
	},
	{
		submit: function(e) {
			e.preventDefault();

			// if need form, can use this.form

			const activeForm = document.querySelector('[name="contact-type"]:checked').value;

			this.validate(activeForm);
		}
	}
);

// configure a single-form processor
const singleFormProcessor = new FormProcessor(
	'#single-form',
	{
		all: {
			'other-name': {
				type: 'regex',
				regex: Regexes.exists
			},
		}
	},
	{
		submit: function(e) {
			e.preventDefault();

			this.validate();
		}
	}
);