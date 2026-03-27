#!/usr/bin/env node

// SpellBloc Email Terminal Tester - Run email tests from command line
const https = require('https');

class TerminalEmailTester {
    constructor() {
        this.apiKey = 're_9CAB6Qtv_C6VqwTMANNQLgzQXfrMsFtb3';
        this.baseUrl = 'api.resend.com';
        this.fromEmail = 'SpellBloc <onboarding@resend.dev>'; // Using Resend's verified domain
        this.testResults = [];
    }

    // CORE EMAIL SENDING FUNCTION
    async sendEmail(emailData) {
        return new Promise((resolve, reject) => {
            const postData = JSON.stringify(emailData);
            
            const options = {
                hostname: this.baseUrl,
                port: 443,
                path: '/emails',
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(postData)
                }
            };

            const req = https.request(options, (res) => {
                let data = '';
                
                res.on('data', (chunk) => {
                    data += chunk;
                });
                
                res.on('end', () => {
                    try {
                        const result = JSON.parse(data);
                        if (res.statusCode === 200) {
                            resolve({ success: true, id: result.id, data: result });
                        } else {
                            resolve({ success: false, error: result, statusCode: res.statusCode });
                        }
                    } catch (error) {
                        resolve({ success: false, error: error.message });
                    }
                });
            });

            req.on('error', (error) => {
                reject({ success: false, error: error.message });
            });

            req.write(postData);
            req.end();
        });
    }

    // TEST EMAIL FUNCTION
    async sendTestEmail(toEmail) {
        const emailData = {
            from: this.fromEmail,
            to: [toEmail],
            subject: '🧪 SpellBloc Email Test - Terminal',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px;">
                        <h1>✅ Email Test Successful!</h1>
                        <p>This test email was sent from the terminal using Node.js</p>
                    </div>
                    <div style="background: #f8f9fa; padding: 25px; border-radius: 10px; margin-top: 20px;">
                        <h2>🎮 SpellBloc Email System</h2>
                        <p><strong>Test Details:</strong></p>
                        <ul>
                            <li>✅ Resend API connection working</li>
                            <li>✅ Email formatting correct</li>
                            <li>✅ Authentication successful</li>
                            <li>✅ Ready for production use</li>
                        </ul>
                        <p>If you received this email, your SpellBloc email integration is working perfectly!</p>
                    </div>
                    <div style="text-align: center; margin-top: 30px; color: #666;">
                        <p>🚀 SpellBloc - Making spelling fun for kids!</p>
                    </div>
                </div>
            `,
            text: `
SpellBloc Email Test - Terminal

✅ Email Test Successful!

This test email was sent from the terminal using Node.js.

Test Details:
• Resend API connection working
• Email formatting correct  
• Authentication successful
• Ready for production use

If you received this email, your SpellBloc email integration is working perfectly!

🚀 SpellBloc - Making spelling fun for kids!
            `
        };

        return await this.sendEmail(emailData);
    }

    // WELCOME EMAIL TEST
    async sendWelcomeEmail(toEmail, childName = 'Test Child') {
        const emailData = {
            from: this.fromEmail,
            to: [toEmail],
            subject: `🎉 Welcome to SpellBloc, ${childName}!`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px;">
                        <h1>🎮 Welcome to SpellBloc!</h1>
                        <p>Where learning spelling is an adventure!</p>
                    </div>
                    <div style="background: #f8f9fa; padding: 25px; border-radius: 10px; margin-top: 20px;">
                        <h2>Hello ${childName}! 👋</h2>
                        <p>We're so excited to have you join our magical spelling adventure!</p>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0;">
                            <div style="background: white; padding: 15px; border-radius: 8px; text-align: center;">
                                <div style="font-size: 2em;">🎯</div>
                                <h3>Personalized Learning</h3>
                            </div>
                            <div style="background: white; padding: 15px; border-radius: 8px; text-align: center;">
                                <div style="font-size: 2em;">🏆</div>
                                <h3>Earn Badges</h3>
                            </div>
                        </div>
                        <p style="text-align: center;">
                            <a href="https://wordbloc.vercel.app" style="display: inline-block; background: #28a745; color: white; padding: 15px 25px; text-decoration: none; border-radius: 25px; font-weight: bold;">🚀 Start Playing Now!</a>
                        </p>
                    </div>
                </div>
            `,
            text: `Welcome to SpellBloc, ${childName}!

We're so excited to have you join our magical spelling adventure!

Features:
• Personalized Learning - AI adapts to your style
• Earn Badges - Collect achievements
• Track Progress - See your growth
• Multi-Language - Learn in 5 languages

Start playing: https://wordbloc.vercel.app`
        };

        return await this.sendEmail(emailData);
    }

    // ACHIEVEMENT EMAIL TEST
    async sendAchievementEmail(toEmail, childName = 'Test Child') {
        const emailData = {
            from: this.fromEmail,
            to: [toEmail],
            subject: `🏆 ${childName} Earned a New Badge!`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%); color: #333; padding: 40px; text-align: center; border-radius: 10px;">
                        <h1>🎉 Achievement Unlocked!</h1>
                        <div style="font-size: 4em; margin: 20px 0;">🌟</div>
                        <h2>First Word Master</h2>
                    </div>
                    <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin-top: 20px; text-align: center;">
                        <div style="font-size: 1.5em; margin: 20px 0;">🌟 Congratulations ${childName}! 🌟</div>
                        <p><strong>You've earned the "First Word Master" badge!</strong></p>
                        <p>Spelled your first word perfectly!</p>
                        <p>Keep up the amazing work! Every word you learn makes you a better speller.</p>
                    </div>
                </div>
            `,
            text: `🎉 Achievement Unlocked!

Congratulations ${childName}!

You've earned the "First Word Master" badge!
🌟 Spelled your first word perfectly!

Keep up the amazing work!`
        };

        return await this.sendEmail(emailData);
    }

    // RUN ALL TESTS
    async runAllTests(testEmail) {
        console.log('🧪 Starting SpellBloc Email Tests...\n');
        this.testResults = [];

        // Test 1: Basic connectivity
        console.log('📧 Test 1: Basic Email Test');
        try {
            const result1 = await this.sendTestEmail(testEmail);
            this.logResult('Basic Email', result1);
        } catch (error) {
            this.logResult('Basic Email', { success: false, error: error.message });
        }

        // Test 2: Welcome Email
        console.log('\n📧 Test 2: Welcome Email');
        try {
            const result2 = await this.sendWelcomeEmail(testEmail, 'Terminal Test Child');
            this.logResult('Welcome Email', result2);
        } catch (error) {
            this.logResult('Welcome Email', { success: false, error: error.message });
        }

        // Test 3: Achievement Email
        console.log('\n📧 Test 3: Achievement Email');
        try {
            const result3 = await this.sendAchievementEmail(testEmail, 'Terminal Test Child');
            this.logResult('Achievement Email', result3);
        } catch (error) {
            this.logResult('Achievement Email', { success: false, error: error.message });
        }

        // Display final results
        this.displayFinalResults();
    }

    logResult(testName, result) {
        const success = result.success;
        const status = success ? '✅ PASS' : '❌ FAIL';
        
        console.log(`   ${status} - ${testName}`);
        
        if (success) {
            console.log(`   📧 Email ID: ${result.id || 'N/A'}`);
        } else {
            console.log(`   ❌ Error: ${JSON.stringify(result.error)}`);
            if (result.statusCode) {
                console.log(`   📊 Status Code: ${result.statusCode}`);
            }
        }
        
        this.testResults.push({ testName, success, result });
    }

    displayFinalResults() {
        console.log('\n' + '='.repeat(50));
        console.log('📊 FINAL TEST RESULTS');
        console.log('='.repeat(50));
        
        const passCount = this.testResults.filter(r => r.success).length;
        const totalCount = this.testResults.length;
        
        this.testResults.forEach(test => {
            const status = test.success ? '✅' : '❌';
            console.log(`${status} ${test.testName}`);
        });
        
        console.log('\n📈 Summary:');
        console.log(`   • Tests Passed: ${passCount}/${totalCount}`);
        console.log(`   • Success Rate: ${Math.round((passCount/totalCount) * 100)}%`);
        
        if (passCount === totalCount) {
            console.log('\n🎉 ALL TESTS PASSED! Your email system is working perfectly!');
            console.log('✅ Ready to integrate with your SpellBloc game.');
        } else {
            console.log('\n⚠️  Some tests failed. Check your:');
            console.log('   • API key is correct');
            console.log('   • From email domain is verified in Resend');
            console.log('   • Internet connection is stable');
        }
        
        console.log('\n📧 Check your email inbox for the test messages!');
    }

    // QUICK TEST
    async quickTest(testEmail) {
        console.log(`🚀 Running quick email test to: ${testEmail}\n`);
        
        try {
            const result = await this.sendTestEmail(testEmail);
            
            if (result.success) {
                console.log('✅ SUCCESS! Email sent successfully');
                console.log(`📧 Email ID: ${result.id}`);
                console.log('📬 Check your inbox for the test email');
                return true;
            } else {
                console.log('❌ FAILED! Email could not be sent');
                console.log(`Error: ${JSON.stringify(result.error)}`);
                return false;
            }
        } catch (error) {
            console.log('❌ ERROR! Test failed');
            console.log(`Error: ${error.message}`);
            return false;
        }
    }
}

// COMMAND LINE INTERFACE
async function main() {
    const args = process.argv.slice(2);
    const tester = new TerminalEmailTester();
    
    if (args.length === 0) {
        console.log('📧 SpellBloc Email Terminal Tester');
        console.log('================================\n');
        console.log('Usage:');
        console.log('  node email-terminal-tester.js <email> [test-type]');
        console.log('');
        console.log('Examples:');
        console.log('  node email-terminal-tester.js your@email.com quick');
        console.log('  node email-terminal-tester.js your@email.com all');
        console.log('  node email-terminal-tester.js your@email.com welcome');
        console.log('  node email-terminal-tester.js your@email.com achievement');
        console.log('');
        console.log('Test Types:');
        console.log('  quick       - Send a simple test email');
        console.log('  all         - Run all email tests');
        console.log('  welcome     - Test welcome email');
        console.log('  achievement - Test achievement email');
        return;
    }
    
    const email = args[0];
    const testType = args[1] || 'quick';
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        console.log('❌ Invalid email format. Please provide a valid email address.');
        return;
    }
    
    console.log(`📧 SpellBloc Email Tester`);
    console.log(`📬 Target Email: ${email}`);
    console.log(`🧪 Test Type: ${testType}\n`);
    
    switch (testType.toLowerCase()) {
        case 'quick':
            await tester.quickTest(email);
            break;
        case 'all':
            await tester.runAllTests(email);
            break;
        case 'welcome':
            console.log('📧 Testing Welcome Email...');
            const welcomeResult = await tester.sendWelcomeEmail(email);
            tester.logResult('Welcome Email', welcomeResult);
            break;
        case 'achievement':
            console.log('📧 Testing Achievement Email...');
            const achievementResult = await tester.sendAchievementEmail(email);
            tester.logResult('Achievement Email', achievementResult);
            break;
        default:
            console.log(`❌ Unknown test type: ${testType}`);
            console.log('Available types: quick, all, welcome, achievement');
    }
}

// Run if called directly
if (require.main === module) {
    main().catch(console.error);
}

module.exports = TerminalEmailTester;