var expect  = require("chai").expect;
var request = require("request");

describe("users api", function(){

    describe("home page", function(){

        var url = "https://backend-service-falcon2212.cloud.okteto.net/";

        it("test1", function(){
            request(url, function(error, response, body){
                //console.log(response)
                expect(response.statusCode).to.equal(200);
            })
        })

    })

})