---
date: 2013-04-14 19:36:37+00:00
excerpt: None
slug: test-driven-development
template: single.html
title: Test Driven Development
---

I've been hacking away at my side project [Macaque](/2013/04/07/macaque-a-new-project/) today. It's quickly becoming the world's most over-engineered to-do app. At the moment it's categorising primates:

![macaque-index](/images/blog/2013/macaque-index.png)

Isn't it beautiful?

As you can see, my big ideas for Macaque focus on design but I am building it end-to-end. For the supporting back-end I've spent the weekend writing and testing an API. I could have thrown together a diabolical concoction of PHP and MySQL and been done with it. However, since I genuinely plan to use this app, I've opted for an ultra-trendy Node solution.

## Testing an API

My app has a very simple RESTful API that interfaces with a [Mongo](http://www.mongodb.org/) database. My API can retrieve, edit, and add items to one or more lists. That's innovation right there. You can follow my [code progress on GitHub](https://github.com/dbushell/Macaque).

In fairness, It's probably the least impressive API one could possibly development but that doesn't make it any easier to test. Even if the front-end wasn't lacking in functionality at this stage it would be a tedious way to find bugs. Inspired by my old office mates at [UVd](http://www.uvd.co.uk/blog/a-night-of-tdd-and-full-stack-bdd-review/) and [Browser](http://www.browserlondon.com/blog/2013/03/tdd-and-bdd/), I've spent some time implementing **test driven development** into my workflow.

For this I've used [Mocha](http://visionmedia.github.io/mocha/) to write a series of tests for my API. Each test calls the API and then checks the returning data. For example, to make sure `/api/lists` is returning an array:

````javascript
describe('Lists', function() {
    it('should return an array of lists', function(done) {
        macaqueAPI('/api/lists', function(data) {
            var json = JSON.parse(data);
            assert.equal(true, Array.isArray(json.lists));
            assert.equal(false, isNaN(json.lists.length));
            done();
        });
   });
});
````

When I run all tests from the command line:

![Mocha tests](/images/blog/2013/macaque-mocha-tests.png)

Pretty cool, right?

This effort has already paid dividends when I came to refactor my API to make use of [Mongoose](http://mongoosejs.com/) — a library that provides schema, data validation, and generally easier coding. I had to rewrite much of my code but running the tests again gave me instant confidence it was correct.

## Onwards

I've already got [Ember](http://emberjs.com/) working with the API to output list and task templates. It's now time to focus on design of the front-end user interface.

Following my experience with Mocha I'm hooked on automated testing and I look forward to bringing it into the browser with other frameworks.

Stay tuned for prettier pictures.

**Update: Part 3 —** [Prototyping](/2013/04/18/prototyping/)
**Update: Part 4 —** [Ember Data and MongoDB](/2013/04/25/ember-data-and-mongodb/)
