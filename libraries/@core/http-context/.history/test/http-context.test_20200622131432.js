const request = require('supertest');
const express = require('express');

const httpContext = require('../index');
const middleware = httpContext.createMiddleware()

const app = express()

app.use(express.json())
httpContext.init(app)
// defino un endpoint dummy 
app.post(
    '/cablevision/31999073/pay',
    middleware,
    (req, res) => {
        let context = require('../index');
        console.log("params: ", context.get('params'));
        
        res.send({
            params: context.get('params'),
            trackId: context.get('trackId'),
            urlBase: context.get('urlBase'),
            url: context.get('url'),
            remoteIp: context.get('remoteIp')
        })
    }
)

const payRequest = {
    amount: 15.10,
    cardNumber: "5399010000117666",
    securityCode: "452",
    dueMonth: "12",
    dueYear: "24",
    debt: {
        totalAmount: "1585.49",
        minAmount: "1596.49",
        address: "506 /ALT/ 1776",
        contractId: "90365950",
        companyId: "43",
        subscriberId: "90365950"
    }
}

describe('http-context middleware tests', () => {

    test('http-context default configure parameters', (done) => {
        request(app)
            .post('/cablevision/31999073/pay?idType=CUIT')
            .set('Accept', 'application/json')
            .set('Authorization', 'test-success')
            .send(payRequest)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .then((resp) => {
                expect(resp.status).toBe(200)
                console.log(resp.body);
                
                expect(resp.body.trackId).toBeDefined()
                expect(resp.body.params).toStrictEqual({
                    idType: 'CUIT'
                })
                expect(resp.body.remoteIp).toBe('::ffff:127.0.0.1')
                expect(resp.body.baseUrl).toMatch(/http\:\/\/127.0.0.1\:\d+\//)
                expect(resp.body.url).toMatch(/http\:\/\/127.0.0.1\:\d+\/cablevision\/31999073\/pay\?idType=CUIT/)

                done();
            })
            .catch(done)
    })

});
