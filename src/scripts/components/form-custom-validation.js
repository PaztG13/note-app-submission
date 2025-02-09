export const customValidationHandler = (event) => {
    event.target.setCustomValidity('');

    if (event.target.validity.valueMissing) {
        event.target.setCustomValidity('Remember to fill this part!');
        return;
    }

    if (event.target.validity.tooLong) {
        event.target.setCustomValidity('Title is too long, maximum of 100 characters');
        return;
    }
};