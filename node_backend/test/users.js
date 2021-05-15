var expect  = require("chai").expect;
var request = require("request");

describe("users api", function(){

    global.id="";

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

        it("new user", function(done){
            //request.post(url).send({username:"Test", password:"Test", email:"Test@gmail.com", name: "Test"}).expect(200);
            request({
                url: url, 
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body:{username:"test3", password:"test3", email:"test3@gmail.com", name: "test3"},
                json:true,
            },function(error, response, body){
                //console.log(body);
                console.log(body);
                id = body["_id"];
                id = String(id)
                console.log(typeof(id));
                console.log(id);
                expect(response.statusCode).to.equal(200);
            })
            done();
        })
    })

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
                //console.log(body);
                expect(response.statusCode).to.equal(200);
                done();
            })
        })
    })

    describe("find user", function(){
        
        it("Invalid id", function(done){
            var url = "https://backend-service-falcon2212.cloud.okteto.net/users/609d427cab02bc002ba1e725";
            request({
                url: url,
                method: "GET",

            }, function(error, response, body){
                //console.log(body);
                //console.log(response.statusCode);
                expect(response.statusCode).to.equal(200);
                done();
            })
        })

        
        it("returns status 200", function(done){
            var url = "https://backend-service-falcon2212.cloud.okteto.net/users/609fbeb03abf800041dc61fe";
            //console.log(url)
            request({
                url: url,
                method: "GET",

            }, function(error, response, body){
                console.log(body);
                expect(response.statusCode).to.equal(200);
                done();
            })
        })

    })

    describe("update users", function(){

        var url = "https://backend-service-falcon2212.cloud.okteto.net/users/update/609fbeb03abf800041dc61fe";

        it("returns status 200", function(done){

            request({
                url : url,
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body:{username:"Test1", password:"Test", email:"Test1@gmail.com", name: "Test1", devices: ["Test", "Test1"]},
                json:true,
            },function(error, response, body){
                //console.log(body);
                expect(response.statusCode).to.equal(200);
            })
            done();
        })
    })

    describe("update devices", function(){

        var url = "https://backend-service-falcon2212.cloud.okteto.net/users/update_devices/609fbeb03abf800041dc61fe"

        it("returns status 200", function(done){

            request({
                url: url, 
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body:{devices: "Test"},
                json:true,
            },function(error, response, body){
                //console.log(body);
                //console.log(error)
                expect(response.statusCode).to.equal(200);
            })
            done();

        })

    })

    describe("delete user",function(){
        //var url = "https://backend-service-falcon2212.cloud.okteto.net/users/609fe6363abf800041dc6244" ;
        //url = url + id;
        //console.log(url);
        it("returns status 200", function(done){
            var url = "https://backend-service-falcon2212.cloud.okteto.net/users/".concat(id);
            request({
                //url: (url+ id ),
                url:url,
                method: "DELETE",
            }, function(error, response, body){
                //console.log(body)
                //console.log(error)
                console.log(id)
                //console.log(typeof(id));
                console.log(url)
                expect(response.statusCode).to.equal(200);
                done();
            })
        })
    })
})