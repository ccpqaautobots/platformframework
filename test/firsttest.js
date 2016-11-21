var should = require('chai').should(),
	expect = require('chai').expect,
	supertest = require('supertest'),
	product = supertest("http://product-platform-release.qa.aop.cambridge.org:8183/aop-product");

describe("Content Refresh Testing", function() {
	this.slow(5000);

	it("GET contentRefresh", function(done) {
		this.slow(2000);

		product.get('/products/contentRefresh')
			.expect(200)
			.end(function(err, res) {
			expect(res.body).to.have.property('articles');
			expect(res.body).to.have.property('issue');
			expect(res.body).to.have.property('volume');
			expect(res.body).to.have.property('first-view-incremental');
			expect(res.body).to.have.property('accepted-manuscript-incremental');
			expect(res.body).to.have.property('final-incremental');
			expect(res.body).to.have.property('any-aop-migration');
			expect(res.body).to.have.property('final-issue-based');
			done();
		});
	});

	it("POST contentRefresh", function(done) {
		this.slow(2000);

		var article = {
			"article": {
				"lastRunDate": "2016-10-23T00:12:23.231Z",
				"running": false
			}
		};

		product.post('/products/contentRefresh')
			.set('Content-Type', 'application/json')
			.send(article)
			.expect(200)
			.end(function(err, res) {
			expect(res.body.article.lastRunDate).to.equal('2016-10-23T00:12:23.231Z');
			expect(res.body.article.running).to.be.a('boolean');
			expect(res.body.article.running).to.equal(false);
			done();
		});
	});
});