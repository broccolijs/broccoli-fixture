'use strict'

var fixture = require('./')
var chai = require('chai'), expect = chai.expect
var chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)


describe('broccoli-fixture', function() {
  it('fixture.Node and fixture.build', function() {
    // Simply test that we can roundtrip
    return expect(fixture.build(new fixture.Node({ 'foo.txt': 'content' })))
      .to.eventually.deep.equal({ 'foo.txt': 'content' })
  })

  it('fixture.Builder', function() {
    var fixtureBuilder = new fixture.Builder(new fixture.Node({ 'foo.txt': 'content' }))

    return fixtureBuilder.build()
      .then(function(fixture) {
        expect(fixture).to.deep.equal({ 'foo.txt': 'content' })

        // Build again
        return fixtureBuilder.build()
      })
      .then(function(fixture) {
        expect(fixture).to.deep.equal({ 'foo.txt': 'content' })
      })
      .finally(function() {
        return fixtureBuilder.cleanup()
      })
  })
})
