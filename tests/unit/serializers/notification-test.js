import Pretender from 'pretender';
import {describe, it} from 'mocha';
import {expect} from 'chai';
import {setupTest} from 'ember-mocha';

describe('Unit: Serializer: notification', function () {
    setupTest();

    let server;

    beforeEach(function () {
        server = new Pretender();
    });

    afterEach(function () {
        server.shutdown();
    });

    it('converts location->key when deserializing', function () {
        server.get('/ghost/api/v2/admin/notifications', function () {
            let response = {
                notifications: [{
                    id: 1,
                    dismissible: false,
                    status: 'alert',
                    type: 'info',
                    location: 'test.foo',
                    message: 'This is a test'
                }]
            };

            return [200, {'Content-Type': 'application/json'}, JSON.stringify(response)];
        });

        let store = this.owner.lookup('service:store');

        return store.findAll('notification').then((notifications) => {
            expect(notifications.get('length')).to.equal(1);
            expect(notifications.get('firstObject.key')).to.equal('test.foo');
        });
    });
});
