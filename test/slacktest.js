const assert = require('assert');
const slack = require('../app.js')
const mocha = require('mocha');

describe('Summarize with SlackBot', () => {
	//createFolder
  it('Should return a sentenceCount less than the original text', (done) => {
    var text = 'This blatant discrepancy hasn’t drawn any sustained attention even from liberal elites who otherwise tend to notice these things. That’s a testament to the notion many of us carry around in our heads, often based on our own experience, that colleges are places filled with fresh-faced young people who recently graduated from high school. But outside of elite colleges that image is less and less accurate in higher education today. The pool of graduating high school seniors is shrinking as the huge millennial generation ages. Meanwhile, more and more people who didn’t go to college, or who went but didn’t finish, are realizing that their lack of a degree is keeping them from getting ahead. Many of these adult students are veterans cycling out of the military after years of service.';
    var msg = {
      body: {
        text: text
      }
    }
    slack.getSummary(msg, function(sentences, error) {
        done(assert.equals(error, null));
    });


  });
});

