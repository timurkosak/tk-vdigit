/*
 * By @timurkosak - https://github.com/timurkosak/
 */

class vDigitInput {
    constructor(selector) {
        this.inputElement = document.querySelector(selector);

        // Check if maxlength and name attributes exist
        if (!this.inputElement.hasAttribute('maxlength')) {
            console.error('vDigitInput Error: The input element is missing the "maxlength" attribute.');
            return;
        }
        if (!this.inputElement.hasAttribute('name')) {
            console.error('vDigitInput Error: The input element is missing the "name" attribute.');
            return;
        }

        this.maxLength = this.inputElement.getAttribute('maxlength');
        this.name = this.inputElement.getAttribute('name');

        this.createInputs();
        this.addEventListeners();
        this.focusFirstInput();
    }

    createInputs() {
        // Hide the original input
        this.inputElement.style.display = 'none';

        // Create new inputs
        let extraInputs = '<div class="tk-vdigit">';
        for (let i = 0; i < this.maxLength; i++) {
            extraInputs += '<input type="text" inputmode="numeric" pattern="[0-9]*" class="tk-vinput" maxlength="1" name="' + this.name + '-' + i + '" autocomplete="off" required />';
        }
        extraInputs += '</div>';

        // Add new inputs to the DOM
        this.inputElement.insertAdjacentHTML('afterend', extraInputs);
        this.inputs = document.querySelectorAll('.tk-vinput');
    }

    addEventListeners() {
        this.inputs.forEach((input, index) => {
            input.addEventListener('input', (e) => this.handleInput(e, index));
            input.addEventListener('keydown', (e) => this.handleKeyDown(e, index));
            input.addEventListener('focusout', () => this.handleFocusOut(input));
            input.addEventListener('paste', (e) => this.handlePaste(e, index));
        });
    }

    handleInput(e, index) {
        const input = e.target;
        const value = input.value;

        // Allow only digits
        if (!/^\d$/.test(value)) {
            input.value = '';
            return;
        }

        // Move to the next input
        if (value && index < this.inputs.length - 1) {
            this.inputs[index + 1].focus();
        }

        this.updateMainInput();
    }

    handleKeyDown(e, index) {
        const input = e.target;

        if (e.key === 'Backspace') {
            e.preventDefault();

            // Move back to the previous input
            if (input.value === '' && index > 0) {
                this.inputs[index - 1].focus();
                this.inputs[index - 1].value = '';
            } else {
                input.value = '';
            }

            // If the backspace key is held down, clear all inputs
            if (e.repeat) {
                this.clearAll();
            }

            this.updateMainInput();
        } else if (/^\d$/.test(e.key)) {
            // Clear the current input if it's already filled before entering a new value
            if (input.value !== '') {
                input.value = '';
            }
        }
    }

    handleFocusOut(input) {
        // If the input is empty, set the border color to red; otherwise, reset the border color
        if (input.value === '') {
            input.style.borderColor = 'red';
        } else {
            input.style.borderColor = '';
        }
    }

    handlePaste(e, index) {
        e.preventDefault();

        const pasteData = e.clipboardData.getData('text');
        const digits = pasteData.replace(/\D/g, ''); // Allow only digits

        // Distribute pasted data across the inputs
        for (let i = 0; i < digits.length; i++) {
            if (index + i < this.inputs.length) {
                this.inputs[index + i].value = digits[i];
                this.inputs[index + i].style.borderColor = '';
            }
        }

        this.updateMainInput();
    }

    updateMainInput() {
        // Combine all tk-vinput values and set them as the value of the main input
        const combinedValue = Array.from(this.inputs).map(input => input.value).join('');
        this.inputElement.value = combinedValue;
    }

    clearAll() {
        this.inputs.forEach(input => input.value = '');
        this.inputs.forEach(input => input.style.borderColor = '');
        this.inputs[0].focus();
        this.updateMainInput();
    }

    focusFirstInput() {
        document.addEventListener('DOMContentLoaded', () => {
            this.inputs[0].focus(); // Focus on the first input when the document is ready
        });
    }
}
