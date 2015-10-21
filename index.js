'use strict'

var Fixturify = require('broccoli-fixturify')
var Builder = require('broccoli').Builder
var fixturify = require('fixturify')

exports.Node = Fixturify

exports.Builder = FixtureBuilder
FixtureBuilder.prototype = Object.create(Builder.prototype)
FixtureBuilder.prototype.constructor = FixtureBuilder
function FixtureBuilder(node, options) {
  Builder.call(this, node, options)
}

FixtureBuilder.prototype.build = function() {
  return Builder.prototype.build.call(this)
    .then(function(hash) {
      return fixturify.readSync(hash.directory)
    })
}

exports.build = build
function build(node, options) {
  var fixtureBuilder = new FixtureBuilder(node, options)
  return fixtureBuilder.build()
    .finally(function() {
      return fixtureBuilder.cleanup()
    })
}
