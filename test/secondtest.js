var should = require('chai').should(),
	expect = require('chai').expect,
	supertest = require('supertest'),
	product = supertest("http://product-platform-release.qa.aop.cambridge.org:8183/aop-product"),
	idm = supertest("http://idm-release.qa.aop.cambridge.org:8080/aop-idm");

describe("Create Get Update Delete Identity", function() {
	this.slow(5000);

	var identity = {
		identifier: "sdfszzd123123123123fqwewezzdqqqfaaaaqqqqqgqqqdfqwedfgfdqqgqwe",
		origin: "cambridge",
		type: "USER",
		attributes:{
			global: {
				displayMessage:"test display message"
			}
		}
	};
	
	var identityId = '';

	it("Create Identity", function(done) {
		this.slow(2000);

		idm.post('/identity')
			.set('Content-Type', 'application/json')
			.set('x-oauth2-bypass-token', 'oauth2-bypass123')
			.send(identity)
			.expect(200)
			.end(function(err, res) {
			if (err) console.log(err);
			
			expect(res.body.identifier).to.equal(identity.identifier);
			expect(res.body.origin).to.equal(identity.origin);
			expect(res.body.type).to.equal(identity.type);
			expect(res.body.attributes.global.displayMessage).to.equal(identity.attributes.global.displayMessage);
			
			identityId = res.body.id;
			
			done();
		});
	});

	it("Get Identity", function(done) {
		this.slow(1500);
		
		idm.get(`/identity/${identityId}`)
		.set('x-oauth2-bypass-token', 'oauth2-bypass123')
		.expect(201)
		.end(function(err, res) {
			if (err) console.log(err);
			
			expect(res.body.id).to.equal(identityId);
			expect(res.body.identifier).to.equal(identity.identifier);
			expect(res.body.origin).to.equal(identity.origin);
			expect(res.body.type).to.equal(identity.type);
			expect(res.body.attributes.global.displayMessage).to.equal(identity.attributes.global.displayMessage);
			done();
		});
	});

	it("Update Identity", function(done) {
		this.slow(2000);
		
		var updatedIdentity = identity;
		updatedIdentity.attributes.global.displayMessage = 'yes this is a new message';
		
		idm.put(`/identity/${identityId}`)
		.set('x-oauth2-bypass-token', 'oauth2-bypass123')
		.expect(200)
		.send(updatedIdentity)
		.end(function(err, res) {
			if (err) console.log(err);
			
			expect(res.body.id).to.equal(identityId);
			expect(res.body.identifier).to.equal(updatedIdentity.identifier);
			expect(res.body.origin).to.equal(updatedIdentity.origin);
			expect(res.body.type).to.equal(updatedIdentity.type);
			expect(res.body.attributes.global.displayMessage).to.equal(updatedIdentity.attributes.global.displayMessage);
			
			done();
		});
	});
	
	it("Delete Identity", function(done) {
		this.slow(1500);
		
		idm.delete(`/identity/${identityId}`)
		.set('x-oauth2-bypass-token', 'oauth2-bypass123')
		.expect(204)
		.end(function(err, res) {			
			done();
		});
	});
	
	it("Get Deleted Identity", function(done) {
		this.slow(1500);
		
		idm.get(`/identity/${identityId}`)
		.set('x-oauth2-bypass-token', 'oauth2-bypass123')
		.expect(404)
		.end(function(err, res) {
			if (err) console.log(err);
			
			done();
		});
	});
});

