import { expect } from 'chai';
import sinon from 'sinon';
import argon2 from 'argon2';
import { passwordVerification } from './confirmedPasswordHashing.js';

describe('Password Verification Function', function () {
    let consoleLogSpy;

    beforeEach(function () {
        consoleLogSpy = sinon.spy(console, "log");
    });

    afterEach(function () {
        consoleLogSpy.restore();
    });

    it('Should hash the password if the entered passwords match', async function () {
        const data = { Password: 'supersecret', Confirm_your_password: 'supersecret' };

        await passwordVerification(data);

        const call = consoleLogSpy.getCalls().find(call => call.args[0] === 'Hashed Password: ');
        expect(call, 'We are waiting for a log with a password hash').to.not.be.undefined;

        const hashedPassword = call.args[1];
        expect(hashedPassword).to.be.a('string').and.not.empty;
        expect(hashedPassword).to.not.equal(data.Password);

        const isValid = await argon2.verify(hashedPassword, data.Password);
        expect(isValid).to.be.true;
    });

    it('Should output "Password not confirmed" if the passwords do not match', async function () {
        const data = { Password: 'supersecret', Confirm_your_password: 'wrongsecret' };

        await passwordVerification(data);

        expect(consoleLogSpy.calledWith('Password not confirmed')).to.be.true;
    });
});
