import argon2 from 'argon2';
import prompt from 'prompt';

prompt.start();

prompt.get(['Password', 'Confirm_your_password'], async function (err, result) {
    if (err) {
        console.error(err);
        return;
    }

    console.log('   Result:');
    console.log('Password: ' + result.Password);
    console.log('Confirmed password: ' + result.Confirm_your_password);

    passwordVerification(result);
});

async function passwordVerification(result) {
    if (result.Password === result.Confirm_your_password) {
        const hashedPassword = await argon2.hash(result.Password);

        console.log('Hashed Password: ', hashedPassword);
    } else {
        console.log('Password not confirmed');
    }
}

export { passwordVerification };
