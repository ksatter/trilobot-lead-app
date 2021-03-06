const router = require('express').Router();
const {slack} = require('../lib/keys')
const request = require('request')

router.route("/")
    .get((req, res) => {
        // When a user authorizes an app, a code query parameter is passed on the oAuth endpoint. If that code is not there, we respond with an error message
        if (!req.query.code) {
            res.status(500);
            res.send({ "Error": "Looks like we're not getting code." });
            console.log("Looks like we're not getting code.");
        } else {
            // If it's there...

            // We'll do a GET call to Slack's `oauth.access` endpoint, passing our app's client ID, client secret, and the code we just got as query parameters.
            request({
                url: 'https://slack.com/api/oauth.v2.access', //URL to hit
                qs: { code: req.query.code, client_id: slack.clientID, client_secret: slack.clientSecret, redirect_uri: "https://trilobot-lead.herokuapp.com/oauth/" }, //Query string data
                method: 'GET', //Specify the method

            }, function (error, response, body) {
                if (error) {
                    console.log(error);
                } else {
                    console.log(body)
                    res.json(body);

                }
            })
        }
    })

module.exports = router

