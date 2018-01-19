**** PAGES ****

[x] /
[x] /create-profile
[x] /profile/id
[x] /login
[ ] /logout
[ ] /fb-login
[ ] /fb-logout


**** FUNCTIONS ****

[x] createUser
[x] getUserById
[x] authenticateUser with passport local strategy
[x] authenticateUser with passport FB strategy


**** ENV ****

Pool

**** DATABASE ****

USERS
[x] id
[x] login
[x] pwd
[x] creation-date

CREATE DATABASE connect;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE users (
    id uuid DEFAULT uuid_generate_v4 (),
    login character varying(255),
    pwd character varying(255),
    creation_date timestamp
);

**** FILES ****

[x] app.js
[x] db.js


**** PACKAGES ****

[x] express
[x] passport
[x] pg
[x] nunjucks
[ ] etc.
