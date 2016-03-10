var postToApi = require('../../src/js/post-api-data')
var getFromApi = require('../../src/js/get-api-data')
var sinon = require('sinon')
var Model = require('../../src/js/models/GiveItemModel')
var endpoints = require('../../src/js/api')
var getUrlParams = require('../../src/js/get-url-parameter')
var browser = require('../../src/js/browser')
var needData = require('./needData')

describe('Give Item Model', function () {
  var model
  var getFromApiStub
  var urlParamStub
  var needId = needData.data.needId
  var providerId = needData.data.serviceProviderId

  describe('Happy Path', function() {
    beforeEach(function () {
      urlParamStub = sinon.stub(getUrlParams, 'parameter')
      urlParamStub.withArgs('needId')
        .returns(needId)
      urlParamStub.withArgs('providerId')
        .returns(providerId)

      getFromApiStub = sinon.stub(getFromApi, 'data')
        .withArgs(endpoints.allServiceProviders + providerId + '/needs/' + needId)
        .returns({
          then: function(success, error) {
              success({
                'status': 'ok',
                'data': needData.data
              })
            }
          })

      model = new Model()
    })

    afterEach(function () {
      getFromApi.data.restore()
      getUrlParams.parameter.restore()
    })

    it('should get need data', function () {
      expect(getFromApiStub.calledOnce).toBeTruthy()
    })

    it('should set needDescription', function () {
      expect(model.needDescription()).toEqual('need description')
    })
  })

  describe('Submit', function () {
    var postToApiStub

    beforeEach(function () {
      postToApiStub = sinon.stub(postToApi, 'post')

      model.formModel().email('test@test.com')
      model.formModel().message('message')
      model.formModel().isOptedIn(true)

      model.submit()
    })

    afterEach(function () {
      postToApi.post.restore()
    })

    it('should post form to api', function () {
      expect(postToApiStub
        .withArgs(endpoints.needs + needId + '/offers-to-help',
        {
          'Email': 'test@test.com',
          'Message': 'message',
          'IsOptedIn': true
        }).calledOnce).toBeTruthy()
    })
  })
})
