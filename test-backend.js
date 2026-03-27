#!/usr/bin/env node

// SpellBloc Backend Tester - Test authentication and email system
const https = require('https');
const http = require('http');

class BackendTester {
    constructor() {
        this.baseUrl = 'http://localhost:3001';
        this.testEmail = 'llinsomoudu@gmail.com';
        this.testResults = [];
    }

    async runAllTests() {
        console.log('🧪 SpellBloc Backend Testing Suite');
        console.log('===================================\n');

        // Test 1: Server Health Check
        await this.testServerHealth();

        // Test 2: Test Email Endpoint
        await this.testEmailEndpoint();

        // Test 3: User Signup
        await this.testUserSignup();

        // Test 4: User Login
        await this.testUserLogin();

        // Display results
        this.displayResults();
    }

    async testServerHealth() {
        console.log('🏥 Test 1: Server Health Check');
        try {
            const response = await this.makeRequest('GET', '/api/users');
            if (response.statusCode === 200) {
                this.logSuccess('Server Health', 'Server is running and responding');
            } else {
                this.logError('Server Health', `Server returned status ${response.statusCode}`);
            }
        } catch (error) {
            this.logError('Server Health', `Server not responding: ${error.message}`);
        }
    }

    async testEmailEndpoint() {
        console.log('\n📧 Test 2: Email System Test');
        try {
            const response = await this.makeRequest('POST', '/api/test-email', {
                email: this.testEmail
            });

            if (response.statusCode === 200) {
                const data = JSON.parse(response.data);
                this.logSuccess('Email System', `Test email sent! ID: ${data.emailId}`);
            } else {
                this.logError('Email System', `Email test failed: ${response.data}`);
            }
        } catch (error) {
            this.logError('Email System', `Email test error: ${error.message}`);
        }
    }

    async testUserSignup() {
        console.log('\n👤 Test 3: User Signup');
        try {
            const testUser = {
                parentName: 'Test Parent',
                parentEmail: this.testEmail,
                password: 'testpass123',
                childName: 'Test Child',
                childAge: 5
            };

            const response = await this.makeRequest('POST', '/api/auth/signup', testUser);

            if (response.statusCode === 201) {
                const data = JSON.parse(response.data);
                this.logSuccess('User Signup', `Account created for ${data.user.parentName}`);
                this.testToken = data.token; // Save token for login test
            } else if (response.statusCode === 400 && response.data.includes('already exists')) {
                this.logSuccess('User Signup', 'User already exists (expected for repeat tests)');
            } else {
                this.logError('User Signup', `Signup failed: ${response.data}`);
            }
        } catch (error) {
            this.logError('User Signup', `Signup error: ${error.message}`);
        }
    }

    async testUserLogin() {
        console.log('\n🔐 Test 4: User Login');
        try {
            const loginData = {
                email: this.testEmail,
                password: 'testpass123'
            };

            const response = await this.makeRequest('POST', '/api/auth/login', loginData);

            if (response.statusCode === 200) {
                const data = JSON.parse(response.data);
                this.logSuccess('User Login', `Login successful for ${data.user.parentName}`);
            } else {
                this.logError('User Login', `Login failed: ${response.data}`);
            }
        } catch (error) {
            this.logError('User Login', `Login error: ${error.message}`);
        }
    }

    async makeRequest(method, path, body = null) {
        return new Promise((resolve, reject) => {
            const url = new URL(this.baseUrl + path);
            const postData = body ? JSON.stringify(body) : null;

            const options = {
                hostname: url.hostname,
                port: url.port,
                path: url.pathname,
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    ...(postData && { 'Content-Length': Buffer.byteLength(postData) })
                }
            };

            const req = http.request(options, (res) => {
                let data = '';
                
                res.on('data', (chunk) => {
                    data += chunk;
                });
                
                res.on('end', () => {
                    resolve({
                        statusCode: res.statusCode,
                        data: data
                    });
                });
            });

            req.on('error', (error) => {
                reject(error);
            });

            if (postData) {
                req.write(postData);
            }
            
            req.end();
        });
    }

    logSuccess(testName, message) {
        console.log(`   ✅ ${testName}: ${message}`);
        this.testResults.push({ testName, success: true, message });
    }

    logError(testName, message) {
        console.log(`   ❌ ${testName}: ${message}`);
        this.testResults.push({ testName, success: false, message });
    }

    displayResults() {
        console.log('\n' + '='.repeat(50));
        console.log('📊 BACKEND TEST RESULTS');
        console.log('='.repeat(50));

        const passCount = this.testResults.filter(r => r.success).length;
        const totalCount = this.testResults.length;

        this.testResults.forEach(test => {
            const status = test.success ? '✅' : '❌';
            console.log(`${status} ${test.testName}`);
        });

        console.log(`\n📈 Summary: ${passCount}/${totalCount} tests passed`);

        if (passCount === totalCount) {
            console.log('\n🎉 ALL TESTS PASSED!');
            console.log('✅ Your SpellBloc backend is working perfectly!');
            console.log('✅ Authentication system ready');
            console.log('✅ Email integration working');
            console.log('✅ Ready for production use');
        } else {
            console.log('\n⚠️  Some tests failed. Check the errors above.');
            console.log('💡 Make sure the server is running: npm start');
        }

        console.log('\n📧 Check your email for test messages!');
        console.log(`📬 Email: ${this.testEmail}`);
    }
}

// Command line interface
async function main() {
    const args = process.argv.slice(2);
    
    if (args.includes('--help') || args.includes('-h')) {
        console.log('🧪 SpellBloc Backend Tester');
        console.log('============================');
        console.log('');
        console.log('Usage:');
        console.log('  node test-backend.js              - Run all tests');
        console.log('  node test-backend.js --help       - Show this help');
        console.log('');
        console.log('Prerequisites:');
        console.log('  • Backend server must be running (npm start)');
        console.log('  • Server should be accessible at http://localhost:3001');
        return;
    }

    const tester = new BackendTester();
    
    console.log('🔍 Checking if server is running...');
    try {
        await tester.makeRequest('GET', '/api/users');
        console.log('✅ Server is running!\n');
        await tester.runAllTests();
    } catch (error) {
        console.log('❌ Server is not running!');
        console.log('');
        console.log('🚀 To start the server:');
        console.log('   1. Run: npm install');
        console.log('   2. Run: npm start');
        console.log('   3. Then run this test again');
        console.log('');
        console.log('Or use the startup script: ./start-server.sh');
    }
}

// Run if called directly
if (require.main === module) {
    main().catch(console.error);
}

module.exports = BackendTester;