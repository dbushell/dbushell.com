---
date: 2013-04-25 18:00:28+00:00
excerpt: None
slug: ember-data-and-mongodb
template: single.html
title: Ember Data and MongoDB
---

Macaque lives! If you've been following my recent blog posts —

* **Part 1:**[ Macaque: A New Project](/2013/04/07/macaque-a-new-project/)
* **Part 2:** [Test Driven Development](/2013/04/14/test-driven-development/)
* **Part 3:** [Prototyping](/2013/04/18/prototyping/)


— you'll know I'm building a to-do app with [Node](http://nodejs.org/) and [Ember](http://emberjs.com/). Macaque's development has reached the point where I can use the app _itself_ for issue and feature tracking. If you want to see my plans going forward you'll have to [clone the repository](https://github.com/dbushell/Macaque) and run the app.

I've forked Macaque to use as my personal list app over the next few weeks while I focus on client work. It has a couple of known bugs but nothing that can't be fixed with a good ol' refresh. Hopefully when I jump back into development [Ember Data](https://github.com/emberjs/data) will be more mature.

## Ember Data and MongoDB

Using Ember has been a great learning exercise. After plenty of head scratching and many hours digging around in the source I'm now feeling comfortable with the core concepts.

If you're using MongoDB behind your API here's a few things I've learnt:

## Primary IDs

MongoDB's default primary key is an [ObjectId](http://docs.mongodb.org/manual/reference/object-id/) in the `_id` field. Ember Data doesn't like the underscore. Initially I was using [Mongoose](http://mongoosejs.com/docs/guide.html#virtuals) to add virtual `id` properties. It's actually a lot easier to manage this client-side by extending the `RESTAdapter`:

````javascript
Macaque.RESTAdapter = DS.RESTAdapter.extend({
    url: 'http://localhost:3000',
    namespace: 'api',

    serializer: DS.RESTSerializer.extend({
        primaryKey: function(type) {
            return '_id';
        }
    })
});

Macaque.Store = DS.Store.extend({
    revision: 12,
    adapter: Macaque.RESTAdapter
});
````

In here you can also specify the URL and namespace for the API.

## Serializing the Primary ID

When the API is called to load a record its ID is serialized in the URL. For example, when a list in Macaque is viewed the `RESTAdapter` loads data from this endpoint:

````
http://localhost:3000/api/lists/5175a9dc67a7a40000000003
````

On rare occasions this will fail and you'll see the ID has been serialized in this format: `5.1755256517945e` — note the numerical notation. What's going on?

The answer lies within the [Serializer](https://github.com/emberjs/data/blob/master/packages/ember-data/lib/system/serializer.js):

````javascript
/**
    A hook you can use to normalize IDs before adding them to the
    serialized representation.

    Because the store coerces all IDs to strings for consistency,
    this is the opportunity for the serializer to, for example,
    convert numerical IDs back into number form.

    @param {String} id the id from the record
    @returns {any} the serialized representation of the id
  */
  serializeId: function(id) {
    if (isNaN(id)) { return id; }
    return +id;
  },
````

If the ID can be converted to a number in JavaScript it will be. ObjectId's in MongoDB are a [12-byte construct](http://docs.mongodb.org/manual/reference/object-id/). Usually alpha-numeric and thus "is not a number" — but not always. To fix this problem we can extend the `RESTSerializer` further:

````javascript
Macaque.RESTAdapter = DS.RESTAdapter.extend({
    /* ... */
    serializer: DS.RESTSerializer.extend({
        /* ... */
        serializeId: function(id) {
            return id.toString();
        }
    })
});
````

💤 (I've removed the previous code for brevity.)

Now our ObjectId values are never inadvertently converted to numbers. With these two changes Ember Data will play nicely with your MongoDB records.

## Many More Things…

This is something I've been experimenting with so I'm not convinced it's actually the correct approach. I thought it was worth sharing nonetheless because I'd imagine it's a common issue. Anyway, if you have **many-to-many** relationships like I do in Macaque:

````javascript
Macaque.List = DS.Model.extend({
    /* ... */
    tasks: DS.hasMany('Macaque.Task')
});

Macaque.Task = DS.Model.extend({
    /* ... */
    lists: DS.hasMany('Macaque.List')
});
````

The API convention is to provide an `*_ids` array like this `GET` response for a list record:

````javascript
{
    "list": {
        "_id": "5175786e3351480000000006",
        "task_ids": [
            "517579ab3351480000000008",
            "51757a0b3351480000000009",
            "51757adc335148000000000a"
        ],
        "is_hidden": false,
        "modified": "2013-04-22T18:01:00.959Z",
        "created": "2013-04-22T17:50:38.000Z",
        "name": "Macaque Testing"
    }
    "tasks": {
        /* task data here... */
    }
}
````

In this example I can side-load the three task records by including their data in a `tasks` object in the JSON root. That's cool, but problems arise when I edit and save a record in Ember. When I commit the data a `PUT` request is sent to the API like this:

````javascript
{
    "list": {
        "_id": "5175786e3351480000000006",
        "is_hidden": false,
        "modified": "2013-04-22T18:01:00.959Z",
        "created": "2013-04-22T17:50:38.000Z",
        "name": "Macaque Testing"
    }
}
````

Note the child task IDs are never sent back to the server.

From what I understand the `hasMany` relationships are only serialised in the JSON if you're specifically embedding all data in every request. You can tell Ember Data to do this…

````javascript
Macaque.RESTAdapter.map('Macaque.Lists', {
    'tasks': { embedded: 'always' }
});
Macaque.RESTAdapter.map('Macaque.Tasks', {
    'lists': { embedded: 'always' }
});
````

…but it's not very practical; that's a lot of data where an array of IDs would suffice. I've found a workaround is to extend the `RESTSerializer` — once again — to include the ID array:

````javascript
Macaque.RESTAdapter = DS.RESTAdapter.extend({
    /* ... */
    serializer: DS.RESTSerializer.extend({
        /* ... */
        addHasMany: function(hash, record, key, relationship)
        {
            if (/_ids$/.test(key)) {
                hash[key] = [];
                record.get(this.pluralize(key.replace(/_ids$/, ''))).forEach(function(item) {
                    hash[key].push(item.get('id'));
                });
            }
            return hash;
        }
    })
});
````

This will now include the `hasMany` relationships in data sent back to the API.

When I send a new task to the server — including `list_ids` — I can then update the corresponding list(s) relationships in the database. The server returns the new task with its `_id` which Ember can confirm. Once the ID arrives I can reload the relevant lists to ensure their `task_ids` are up-to-date and finally make the task visible.

I'm not entirely convinced this technique is the best way to maintain many-to-many relationships. I haven't tested the `{ embedded: 'always' }` technique so I can't confirm Ember Data actually handles this correctly. Either way it feels overkill.

Am I doing something wrong, or do you know a better way? [Give me a shout on Twitter](https://twitter.com/dbushell) or comment on [Hacker News](https://news.ycombinator.com/item?id=5608851).
