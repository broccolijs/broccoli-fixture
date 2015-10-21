# Broccoli Fixture Helpers

This package is useful for testing Broccoli plugins without interacting with
the file system. It lets you turn
[fixturify](https://github.com/joliss/node-fixturify) objects into Broccoli
nodes, and build Broccoli nodes back into fixturify objects.

## Usage

### `Node`: Fixture object to Broccoli node

Create a Broccoli source node whose contents are created by
[fixturify](https://github.com/joliss/node-fixturify) rather than coming from
the file system:

```js
var fixture = require('broccoli-fixture');

var inputFixture = {
  'foo.txt': 'foo.txt contents',
  'subdir': {
    'bar.txt': 'bar.txt contents'
  }
};

var node = new fixture.Node(inputFixture);
```

### `build`: Broccoli node to fixture object

```js
fixture.build(node)
  .then(function(outputFixture) {
    // outputFixture deep-equals
    // {
    //   'foo.txt': 'foo.txt contents',
    //   'subdir': {
    //     'bar.txt': 'bar.txt contents'
    //   }
    // }
  });
```

`build` creates a builder behind the scenes, and cleans up automatically. Do
not call it more than once on the same node.

#### Chai example

If you use the [Chai](http://chaijs.com/) assertion library, your test code
might look like this:

```js
return fixture.build(node)
  .then(function(fixture) {
    expect(fixture).to.deep.equal({
      'foo.txt': 'foo.txt contents',
      'subdir': {
        'bar.txt': 'bar.txt contents'
      }
    })
  });
```

With [chai-as-promised](https://github.com/domenic/chai-as-promised)
(`eventually`), it's even more concise:

```js
return expect(fixture.build(node)).to.eventually.deep.equal({
  'foo.txt': 'foo.txt contents',
  'subdir': {
    'bar.txt': 'bar.txt contents'
  }
});
```

### `FixtureBuilder`: Building repeatedly

The `build` function builds only once. If you need to build repeatedly, for
example to test caching logic, use the `fixture.Builder` class. It's used just
like a regular Broccoli `Builder`, but the `build` method returns a promise to
a fixturify object.

```js
var fixtureBuilder = new fixture.Builder(node);

fixtureBuilder.build()
  .then(function(fixture) {
    // fixture is { 'foo.txt': ... }

    // Build again
    return fixtureBuilder.build();
  })
  .then(function(fixture) {
    // fixture is { 'foo.txt': ... }
  })
  .finally(function() {
    return fixtureBuilder.cleanup();
  });
```

## See also

This package brings in Broccoli core as a dependency, so it's perhaps too
heavy to use in "production" build code. If you only need `fixture.Node`, you
can use the lightweight
[broccoli-fixturify](https://github.com/rwjblue/broccoli-fixturify).
`fixture.Node` is simply an alias for broccoli-fixturify's  `Fixturify` class.
