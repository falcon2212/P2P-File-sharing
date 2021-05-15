var expect  = require("chai").expect;
var request = require("request");

describe("users api", function(){

    describe("home page", function(){

        var url = "https://backend-service-falcon2212.cloud.okteto.net/";

        it("returns status 200", function(){
            request(url, function(error, response, body){
                //console.log(body)
                expect(response.statusCode).to.equal(200);
                //done();
            })
        })
    })

    describe("delete user",function(){
        var url = "https://backend-service-falcon2212.cloud.okteto.net/users/609fb58d3abf800041dc61f3";

        it("returns status 200", function(){
            request({
                url: url,
                method: "DELETE",
            }, function(error, response, body){
                console.log(body)
                console.log(error)
            })
        })
    })
    
    /*describe("sign up", function(){
        var url = "https://backend-service-falcon2212.cloud.okteto.net/users/add";

        it("returns status 200", function(){
            //request.post(url).send({username:"Test", password:"Test", email:"Test@gmail.com", name: "Test"}).expect(200);
            request({
                url: url, 
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body:{username:"Test", password:"Test", email:"Test@gmail.com", name: "Test"},
                json:true,
            },function(error, response, body){
                console.log(body);
                expect(response.statusCode).to.equal(200);
            })
            //done();
        })
    })*/

})