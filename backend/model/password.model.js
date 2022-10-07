const passwordvalidator = require('password-validator');

const schema = new passwordvalidator();

//définition du schéma :
// - entre 8 et 16 caractères
// - avec au moinune lettre minuscule et une majuscule, un symbole et 3 chiffres
// - ne peut pas contenir d'espaces
schema
    .is().min(8)
    .is().max(16)
    .has().uppercase()
    .has().lowercase()
    .has().digits(3)
    .has().not().spaces()
    .has().symbols(1);

module.exports = schema;
