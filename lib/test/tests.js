const Lab = require('lab');
const { expect } = require('code');
const lab = exports.lab = Lab.script();
const {
    describe,
    it
} = lab;

// Test user modules
const {
    registrationUser,
} = require('../routes/userServise/controller');

// Test book modules
const {
    searchBook,
    readBook,
    addComment,
    addBook
} = require('../routes/bookServise/controller');


describe('Testing a function who registers a new user', () => { 
    
});
describe('Testing a function who search book in database by name or author book', () => { });
describe('Testing a function who search book and return the user book text', () => { });
describe('Testing a function who add user comment for book', () => { });
describe('Testing a function who add book in database', () => { });



