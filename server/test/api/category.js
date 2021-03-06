'use strict';

var superagent = require('superagent');
var assert = require('chai').assert;
var tools = require('../test-tools');
var config = tools.config;
var dataLoader = require('../../test-data/data-loader');

var Category = tools.Category;
var User = tools.User;
var categoriesData = dataLoader.categoriesData;
var handleResponse = tools.handleResponse;
var loadCategories = dataLoader.loadCategories;

describe('Category API', function () {

	it('can get all categories', function (done) {
		// load local categories test data to server database 
		loadCategories(Category, categoriesData, function (err, categories) {
			
			assert.equal(categories.length, categoriesData.length);

			var url = config.TEST.SERVER + 'api/blu-store/categories';

			// send get request to get all categories
			superagent.get(url).end(handleResponse(categories, null, done));

		});

	});

	it('can add new category', function (done) {

		dataLoader.loginAdmin(User, function (err, user) {

			assert.isNotOk(err);
			assert.isOk(user.token);

			var url = config.TEST.SERVER + 'api/blu-store/categories';

			var catObj = {
				name: "just another category 0909"
			};

			// add category without parent
			superagent
				.post(url)
				.set('x-access-token', user.token)
				.send(catObj)
				.end(handleResponse(catObj, ['name'], function (err, res) {
					// add category with parent 
					var catObj2 = { name: 'cate object two', parent: catObj._id };
					superagent
						.post(url)
						.set('x-access-token', user.token)
						.send(catObj2)
						.end(handleResponse(catObj2, ['parent'], done));
				}));
		});

	});


});
