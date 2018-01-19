const uuidv4 = require('uuid').v4;
const sha256 = require('js-sha256');


function createUser(form,pool) {
  const today = new Date();
  return pool.query(
    "INSERT INTO users VALUES($1::uuid,$2::text,$3::text,$4::timestamp) RETURNING id",
    [uuidv4(),form.login,sha256(form.password),today]
  );
}

function getUserById(id,pool){
  return pool.query(
    "SELECT * FROM users WHERE id = $1::uuid",
    [id]
  );
}

function findUser(login, password, pool){
  return pool.query(
    "SELECT id,login,pwd FROM users WHERE login = $1::text and pwd = $2::text",
    [login, sha256(password)]
  );
}

module.exports =  {
  createUser: createUser,
  getUserById: getUserById,
  findUser: findUser
};
