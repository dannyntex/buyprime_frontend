/* eslint-disable */
let router = require('express').Router();
const fetch = require('node-fetch');

router.post('/register', async (req, res, next) => {
    try {
        fetch('http://magento23pwa.test/index.php/rest/V1/customers', {
            method: 'POST',
            body: JSON.stringify(req.body),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((res) => res.json())
        .then((response) => {
            if(response.message){
                res.status(200).json({error: response.message})
            }else {
                let user= response;
                fetch('http://magento23pwa.test/index.php/rest/V1/integration/customer/token', {
                    method: 'POST',
                    body: JSON.stringify({'username': req.body.customer.email, 'password': req.body.password}),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }).then((res) => res.json())
                .then((response) => {
                    if(response.message){
                        res.status(200).json({error: response.message})
                    }else {
                        res.status(200).json({success: {user: user, token: response}})
                    }
                }).catch((error) => res.status(400).json({error: error}));
            }
        }).catch((error) => res.status(400).json({error: error}));
    } catch (error) {
        res.status(400).json({error: error});
    }
});

module.exports = router;