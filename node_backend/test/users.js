var expect  = require("chai").expect;
var request = require("request");

describe("users api", function(){

    describe("home page", function(){

        var url = "https://backend-service-falcon2212.cloud.okteto.net/";

        it("returns status 200", function(done){
            request(url, function(error, response, body){
                //console.log(body)
                expect(response.statusCode).to.equal(200);
                done();
            })
        })
    })

    describe("sign up", function(){
        var url = "https://backend-service-falcon2212.cloud.okteto.net/users/add";

        it("returns status 400", function(done){
            //request.post(url).send({username:"Test", password:"Test", email:"Test@gmail.com", name: "Test"}).expect(200);
            request({
                url: url, 
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body:{username:"Test", password:"Test", email:"Test@gmail.com", name: "Test"},
                json:true,
            },function(error, response, body){
                //console.log(body);
                expect(response.statusCode).to.equal(400);
            })
            done();
        })

        /*it("returns status 200", function(done){
            //request.post(url).send({username:"Test", password:"Test", email:"Test@gmail.com", name: "Test"}).expect(200);
            request({
                url: url, 
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body:{username:"sush", password:"sush", email:"sush@gmail.com", name: "sush"},
                json:true,
            },function(error, response, body){
                //console.log(body);
                expect(response.statusCode).to.equal(200);
            })
            done();
        })*/
    })

    /*describe("delete user",function(){
        var url = "https://backend-service-falcon2212.cloud.okteto.net/users/609d427cab02bc002ba1e725";

        it("returns status 200", function(done){
            request({
                url: url,
                method: "DELETE",
            }, function(error, response, body){
                //console.log(body)
                //console.log(error)
                expect(response.statusCode).to.equal(200);
                done();
            })
        })
    })*/

    describe("login", function(){
        var url = "https://backend-service-falcon2212.cloud.okteto.net/users/find/";

        it("returns status 200", function(done){
            request({
                url: url,
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: {username: "sush", password: "sush"},
                json: true
            }, function(error, response, body){
                console.log(body);
                expect(response.statusCode).to.equal(200);
                done();
            })
        })
    })

    describe("find user", function(){
        var url = "https://backend-service-falcon2212.cloud.okteto.net/users/609d427cab02bc002ba1e725";

        it("returns status 200", function(done){
            request({
                url: url,
                method: "POST",

            }, function(error, response, body){
                //console.log(body);
                expect(response.statusCode).to.equal(200);
                done();
            })
        })

        it("returns status 404", function(done){
            request({
                url: url,
                method: "POST",

            }, function(error, response, body){
                //console.log(body);
                expect(response.statusCode).to.equal(404);
                done();
            })
        })
    })

})