DROP TABLE IF EXISTS pets;

CREATE TABLE pets (id SERIAL PRIMARY KEY, 
name TEXT NOT NULL, 
age INTEGER NOT NULL, 
kind TEXT NOT NULL
);