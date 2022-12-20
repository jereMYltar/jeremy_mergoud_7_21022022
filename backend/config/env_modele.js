const env = {
    DB_NAME: 'nom de la base de données', //remplacer par le nom de la base de donnée mySQL
    DB_USERNAME: 'nom utilisateur', //remplacer par le nom de l'utilisateur de la BdD
    DB_PASSWORD: 'mot de passe', //remplacer par le mt de passe de l'utilisateur concerné
    DB_HOST: 'localhost',
    DB_DIALECT: 'mysql',
    ADMIN_PASSWORD: '123', //ou remplacer par un mot de passe administrateur permettant à un utilisateur de devenir lui-même administrateur
};

module.exports = env;