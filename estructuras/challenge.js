// regular function that checks if a number is odd or even and logs it
function checkParity(num) {
    if (typeof num !== 'number' || isNaN(num)) {
        console.log('Please provide a valid number');
        return;
    }

    if (num % 2 === 0) {
        console.log(`${num} is even`);
    } else {
        console.log(`${num} is odd`);
    }
}

// arrow function version with the same behavior
const checkParityArrow = (num) => {
    if (typeof num !== 'number' || isNaN(num)) {
        console.log('Please provide a valid number');
        return;
    }

    console.log(`${num} is ${num % 2 === 0 ? 'even' : 'odd'}`);
};

// export functions if needed
module.exports = { checkParity, checkParityArrow };
