const assert = require('assert');
const app = require('./../app.js')
const mocha = require('mocha');
let chai = require('chai');
let chaiHttp = require('chai-http');
var json2plain = require('json2plain');
let should = chai.should();
const slack = require('../app.js')


chai.use(chaiHttp);

//Test creating saving summary to db by creating note and summary 
describe('Summarize with SlackBot', () => {
  
  it('Should not error when text is entered', (done) => {
    var text = 'This blatant discrepancy hasn’t drawn any sustained attention even from liberal elites who otherwise tend to notice these things. That’s a testament to the notion many of us carry around in our heads, often based on our own experience, that colleges are places filled with fresh-faced young people who recently graduated from high school. But outside of elite colleges that image is less and less accurate in higher education today. The pool of graduating high school seniors is shrinking as the huge millennial generation ages. Meanwhile, more and more people who didn’t go to college, or who went but didn’t finish, are realizing that their lack of a degree is keeping them from getting ahead. Many of these adult students are veterans cycling out of the military after years of service.';
    slack.getSummary(text, function(sentences, error) {

        done(assert.equal(error, null));
    });
  });

  it('Should error out when the user gives no text', (done) => {
    slack.getSummary(null, function(sentences, error) {
        done(assert.notEqual(error, null));
    });
  });

  it('Text length should be less than the original text entered', (done) => {
    var text = 'The quick. Brown fox. Jumps over. The lazy. Dog is fast. My dog is fast! How fast is your dog?';
    //Math.ceil(body.text.length / 5);
    slack.getSummary(text, function(sentences, error) {
      if (sentences.length <= text.length) {
        done();
      } else {
        done(false);
      }
    });
  });
});