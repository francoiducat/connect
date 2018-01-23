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
  )
  .then( res => res.rows[0])
  .catch(e => console.log(e));
}

function findUser(login, password, pool){
  return pool.query(
    "SELECT id,login,pwd FROM users WHERE login = $1::text and pwd = $2::text",
    [login, sha256(password)]
  );
}

function createUserFromFb(user, pool){
  const today = new Date();
  return pool.query(
    "INSERT INTO users(id, login, pwd, creation_date, facebook_id) VALUES($1::uuid, $2::text, $3::text, $4::timestamp, $5::text) RETURNING id, login",
    [uuidv4(), user.displayName, " ", today, user.id]);
}

function findOrCreateFbUser(user, pool) {
  return pool.query(
    "SELECT * FROM users WHERE facebook_id = $1::text",
    [user.id]
  )
    .then(res => {
      if (res.rowCount > 0) {
        return res.rows[0];
      } else {
        return createUserFromFb(user, pool)
          .then(resultQuery => {
            const userObject = {id: resultQuery.rows[0].id, login: resultQuery.rows[0].login};
            //console.log(userObject);
            return userObject;
          })
          .catch(e => console.log(e));
      }
    })
    .catch(error => console.log(error));
}

module.exports =  {
  createUser: createUser,
  getUserById: getUserById,
  findUser: findUser,
  findOrCreateFbUser: findOrCreateFbUser,
  createUserFromFb:createUserFromFb
};
