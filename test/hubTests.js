﻿'use strict';
var path = require('path');
const sinon = require(`sinon`);
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');
var crypto = require('crypto');
var promise;
var spawnStub;

describe('generator-team-services-extension-hub', function () {

      var testPath = path.join(__dirname, '../TestsResults/' + crypto.randomBytes(20).toString('hex'));
      console.log(testPath);
      before(function () {
            return helpers.run(path.join(__dirname, '../generators/hub'))
                  .inDir(testPath)
                  .withPrompts({
                        extName: "Test1",
                        extId: "TestId1",
                        extDescription: "Description of the extension",
                        publisherId: "fabrikam",
                        extensionType: "ms.vss-web.hub",
                        hubPoint: "ms.vss-code-web.code-hub-group",
                        useAITelemetry: true,
                        useVS: true
                  })
                  .on(`error`, e => {
                        assert.fail(e);
                  })
                  .on(`ready`, function (generator) {
                        // This is called right before `generator.run()` is called
                        // Stub the calls to spawnCommandSync
                        spawnStub = sinon.stub(generator, `spawnCommandSync`);
                  });
      });

      it('generator-team-services-extension-hub:Extension directory should be created', function () {
            assert.file(testPath + '/TestId1/');
      });


      it('generator-team-services-extension-hub:creates files', () => {
            var root = testPath + '\\TestId1\\TestId1\\';
            assert.file([
                  root + 'TestId1.csproj',
                  root + 'typings.json',
                  root + 'package.json',
                  root + 'vss-extension.json',
                  root + 'test/TestSpec.js',
                  root + '.vscode/tasks.json',
                  root + 'src/app.ts',
                  root + 'src/telemetryClientSettings.ts',
                  root + 'static/index.html',
                  root + 'static/images/logo.png',
                  root + 'static/images/screen1.png',
                  root + 'static/css/app.css',
                  root + 'license.md',
                  root + 'overview.md',
                  root + 'webpack.config.js',
                  root + 'tslint.json',
                  root + 'ThirdPartyNotices.txt',
            ]);
            assert.fileContent(root + 'vss-extension.json', /"id": "TestId1"/);
            assert.fileContent(root + 'vss-extension.json', /"name": "Test1"/)
            assert.fileContent(root + 'vss-extension.json', /"type": "ms.vss-web.hub"/)

      })

      it(`generator-team-services-extension-hub:npm install should be called`, () => {
            assert.equal(1, spawnStub.withArgs(`npm`, [`install`], { stdio: ['pipe', 'pipe', process.stderr] }).callCount, `npm install was not be called`);
      });

      it(`generator-team-services-extension-hub:npm run build should be called`, () => {
            assert.equal(1, spawnStub.withArgs(`npm`, [`run`, 'build'], { stdio: ['pipe', 'pipe', process.stderr] }).callCount, `npm run build was not be called`);
      });

});