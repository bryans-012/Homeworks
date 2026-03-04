// regular function
function verificarNumero(num) {

    if (num % 2 === 0) {
        console.log(`${num} es par`);
    } else {
        console.log(`${num} es impar`);
    }
}

// arrow function 
const verificarNumeroArrow = (num) => {
    console.log(`${num} es ${num % 2 === 0 ? 'par' : 'impar'}`);
};

// export functions
module.exports = { verificarNumero, verificarNumeroArrow };