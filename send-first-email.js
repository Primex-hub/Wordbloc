// First Email Test - Send your first email with Resend
const https = require('https');

async function sendFirstEmail() {
    const emailData = {
        from: 'onboarding@resend.dev',
        to: 'llinsomoudu@gmail.com',
        subject: 'Hello World - SpellBloc First Email!',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px;">
                    <h1>🎉 Congratulations!</h1>
                    <p>You've successfully sent your <strong>first email</strong> with Resend!</p>
                </div>
                <div style="background: #f8f9fa; padding: 25px; border-radius: 10px; margin-top: 20px;">
                    <h2>🎮 SpellBloc Email System Ready!</h2>
                    <p>This email confirms that your Resend integration is working perfectly for SpellBloc.</p>
                    <ul style="text-align: left;">
                        <li>✅ API Key authenticated successfully</li>
                        <li>✅ Email delivery working</li>
                        <li>✅ HTML formatting supported</li>
                        <li>✅ Ready for SpellBloc integration</li>
                    </ul>
                    <p style="text-align: center; margin-top: 30px;">
                        <a href="https://wordbloc.vercel.app" style="display: inline-block; background: #28a745; color: white; padding: 15px 25px; text-decoration: none; border-radius: 25px; font-weight: bold;">🚀 Visit SpellBloc</a>
                    </p>
                </div>
                <div style="text-align: center; margin-top: 30px; color: #666;">
                    <p>🎮 SpellBloc - Making spelling fun for kids!</p>
                    <p><small>This email was sent using Resend API</small></p>
                </div>
            </div>
        `,
        text: `
🎉 Congratulations!

You've successfully sent your first email with Resend!

SpellBloc Email System Ready!

This email confirms that your Resend integration is working perfectly for SpellBloc.

✅ API Key authenticated successfully
✅ Email delivery working  
✅ HTML formatting supported
✅ Ready for SpellBloc integration

Visit SpellBloc: https://wordbloc.vercel.app

🎮 SpellBloc - Making spelling fun for kids!
        `
    };

    return new Promise((resolve, reject) => {
        const postData = JSON.stringify(emailData);
        
        const options = {
            hostname: 'api.resend.com',
            port: 443,
            path: '/emails',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        console.log('📧 Sending your first SpellBloc email...');
        console.log(`📬 To: ${emailData.to}`);
        console.log(`📝 Subject: ${emailData.subject}`);

        const req = https.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const result = JSON.parse(data);
                    if (res.statusCode === 200) {
                        console.log('\n✅ SUCCESS! Email sent successfully!');
                        console.log(`📧 Email ID: ${result.id}`);
                        console.log('📬 Check your inbox at llinsomoudu@gmail.com');
                        console.log('\n🎉 Your SpellBloc email system is now ready!');
                        resolve({ success: true, id: result.id, data: result });
                    } else {
                        console.log('\n❌ FAILED! Email could not be sent');
                        console.log(`Status: ${res.statusCode}`);
                        console.log(`Error: ${JSON.stringify(result, null, 2)}`);
                        resolve({ success: false, error: result, statusCode: res.statusCode });
                    }
                } catch (error) {
                    console.log('\n❌ ERROR! Failed to parse response');
                    console.log(`Error: ${error.message}`);
                    resolve({ success: false, error: error.message });
                }
            });
        });

        req.on('error', (error) => {
            console.log('\n❌ REQUEST ERROR!');
            console.log(`Error: ${error.message}`);
            reject({ success: false, error: error.message });
        });

        req.write(postData);
        req.end();
    });
}

// Run the first email test
sendFirstEmail()
    .then(result => {
        if (result.success) {
            console.log('\n🚀 Next Steps:');
            console.log('1. Check your email inbox');
            console.log('2. Run: node email-terminal-tester.js llinsomoudu@gmail.com quick');
            console.log('3. Test your SpellBloc game email features');
            console.log('4. Setup a verified domain in Resend for production');
        } else {
            console.log('\n🔧 Troubleshooting:');
            console.log('1. Check your internet connection');
            console.log('2. Verify the API key is correct');
            console.log('3. Make sure Resend account is active');
        }
    })
    .catch(error => {
        console.error('Fatal error:', error);
    });

module.exports = { sendFirstEmail };