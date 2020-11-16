// without TypeScript interfaces, a class is a good way to encapsulate the requirements for error reporting
class ProcessingError {
	constructor(errorType, message, technicalMessage) {
		this.errorType = errorType;
		this.message = message;
		this.technicalMessage = technicalMessage;
	}
}