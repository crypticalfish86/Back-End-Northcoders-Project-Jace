# Hello and Welcome!

This was my first ever major web development project I undertook back in 2022 during my time as a trainee-fullstack developer at Northcoders! It's purpose is to act as a portfolio website and prototype web development project.

This website is currently still hosted at the following link: https://jaces-northcoders-news.netlify.app/   
The API is also still available (may take several minutes of idling to load): https://jaces-nc-news.onrender.com/api

As of the time of writing this I am currently working on a new and improved portfolio website updated for 2024.

Thankyou for visiting and enjoy!


# For Developers who cloned this project

Create two .env files to store the names of the PGDATABASE's.The two databases will be for the test data and dev data. The names of the databases will be in db/setup.sql You will then be able to to run the two databases locally by then running "npm install"

(it is reccomended to add your .env files to a .gitignore)

# For those who are visiting this project

The link to the hosted version is here: 
postgres://yxdmyhsz:tb59LCSIqEbQWAF9bTToOqClajbfetsc@rogue.db.elephantsql.com/yxdmyhsz

ADD SEED INSTRUCTIONS
set up a .env.production file with the correct elephantSQL url set up like so PGDATABASE_URL="elephant_sql_url"


This project essentially is the back-end for a website 
forum that hosts articles posted by approved users. Under 
each article which approved users can publish is a comments 
section where approved users can comment under each others 
work.

The minimum version of node required to run this project is: V19.2.0

The minimum version of PostgreSQL to run this project is:
PostgreSQL 14.5
