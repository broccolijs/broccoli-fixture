'use strict'

var fixture = require('./')
var chai = require('chai'), expect = chai.expect
var chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
var Plugin = require('broccoli-plugin')

FailingPlugin.prototype = Object.create(Plugin.prototype)
FailingPlugin.prototype.constructor = FailingPlugin
function FailingPlugin() {
  Plugin.call(this, [])
}

FailingPlugin.prototype.build = function () {
  throw new Error('nope')
}


describe('broccoli-fixture', function () {
  describe('fixture.build', function () {
    it('roundtrips with fixture.Node', function () {
      return expect(fixture.build(new fixture.Node({ 'foo.txt': 'content' })))
        .to.eventually.deep.equal({ 'foo.txt': 'content' })
    })

    it('forwards build errors', function () {
      return expect(fixture.build(new FailingPlugin))
        .to.be.eventually.rejectedWith(/nope/)
    })
  })

  describe('fixture.Builder', function() {
    it('returns fixtures', function () {
      var fixtureBuilder = new fixture.Builder(new fixture.Node({ 'foo.txt': 'content' }))

      return fixtureBuilder.build()
        .then(function (fixture) {
          expect(fixture).to.deep.equal({ 'foo.txt': 'content' })

          // Build again
          return fixtureBuilder.build()
        })
        .then(function (fixture) {
          expect(fixture).to.deep.equal({ 'foo.txt': 'content' })
        })
        .then(function () {
          return fixtureBuilder.cleanup()
        })
    })

    it('forwards build errors', function () {
      var fixtureBuilder = new fixture.Builder(new FailingPlugin)
      return expect(fixtureBuilder.build())
        .to.be.eventually.rejectedWith(/nope/)
        .then(function () {
          return fixtureBuilder.cleanup()
        })
    })
  })
})
