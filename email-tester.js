// SpellBloc Email Testing - Test all email functionality
class EmailTester {
    constructor() {
        this.emailService = null;
        this.testResults = [];
    }

    async init() {
        // Wait for email service to be available
        await this.waitForEmailService();
        console.log('📧 Email Tester ready');
    }

    async waitForEmailService() {
        return new Promise((resolve) => {
            const checkService = () => {
                if (window.emailService) {
                    this.emailService = window.emailService;
                    resolve();
                } else {
                    setTimeout(checkService, 100);
                }
            };
            checkService();
        });
    }

    // TEST ALL EMAIL TYPES
    async runAllTests(testEmail = 'test@example.com') {
        console.log('🧪 Starting email tests...');
        this.testResults = [];

        await this.testWelcomeEmail(testEmail);
        await this.testAchievementEmail(testEmail);
        await this.testProgressReport(testEmail);
        await this.testMilestoneEmail(testEmail);
        await this.testWeeklySummary(testEmail);

        this.displayResults();
        return this.testResults;
    }

    async testWelcomeEmail(email) {
        console.log('📧 Testing welcome email...');
        try {
            const result = await this.emailService.sendWelcomeEmail(email, 'Test Child');
            this.testResults.push({
                type: 'Welcome Email',
                success: result.success,
                message: result.success ? 'Sent successfully' : result.error
            });
        } catch (error) {
            this.testResults.push({
                type: 'Welcome Email',
                success: false,
                message: error.message
            });
        }
    }

    async testAchievementEmail(email) {
        console.log('🏆 Testing achievement email...');
        try {
            const testAchievement = {
                name: 'First Word Master',
                emoji: '🌟',
                description: 'Spelled your first word perfectly!'
            };
            
            const result = await this.emailService.sendAchievementEmail(email, 'Test Child', testAchievement);
            this.testResults.push({
                type: 'Achievement Email',
                success: result.success,
                message: result.success ? 'Sent successfully' : result.error
            });
        } catch (error) {
            this.testResults.push({
                type: 'Achievement Email',
                success: false,
                message: error.message
            });
        }
    }

    async testProgressReport(email) {
        console.log('📊 Testing progress report...');
        try {
            const testProgress = {
                accuracy: 85,
                wordsLearned: 25,
                timeSpent: 1800, // 30 minutes
                strongAreas: ['animals', 'colors'],
                improvementAreas: ['vowels'],
                achievements: [
                    { name: 'Animal Expert', emoji: '🐾' },
                    { name: 'Color Master', emoji: '🌈' }
                ]
            };
            
            const result = await this.emailService.sendProgressReport(email, 'Test Child', testProgress);
            this.testResults.push({
                type: 'Progress Report',
                success: result.success,
                message: result.success ? 'Sent successfully' : result.error
            });
        } catch (error) {
            this.testResults.push({
                type: 'Progress Report',
                success: false,
                message: error.message
            });
        }
    }

    async testMilestoneEmail(email) {
        console.log('🌟 Testing milestone email...');
        try {
            const testMilestone = {
                emoji: '🎉',
                title: 'Level 5 Achieved!',
                description: 'Test Child has reached Level 5 through excellent spelling practice!'
            };
            
            const result = await this.emailService.sendMilestoneEmail(email, 'Test Child', testMilestone);
            this.testResults.push({
                type: 'Milestone Email',
                success: result.success,
                message: result.success ? 'Sent successfully' : result.error
            });
        } catch (error) {
            this.testResults.push({
                type: 'Milestone Email',
                success: false,
                message: error.message
            });
        }
    }

    async testWeeklySummary(email) {
        console.log('📈 Testing weekly summary...');
        try {
            const testWeekly = {
                sessionsPlayed: 12,
                wordsAttempted: 150,
                accuracy: 88,
                badgesEarned: 3,
                highlights: [
                    '🎯 Achieved 88% accuracy - Great work!',
                    '⭐ Collected 45 stars this week',
                    '📚 Practiced 150 words consistently'
                ]
            };
            
            const result = await this.emailService.sendWeeklySummary(email, 'Test Child', testWeekly);
            this.testResults.push({
                type: 'Weekly Summary',
                success: result.success,
                message: result.success ? 'Sent successfully' : result.error
            });
        } catch (error) {
            this.testResults.push({
                type: 'Weekly Summary',
                success: false,
                message: error.message
            });
        }
    }

    displayResults() {
        console.log('\n📊 EMAIL TEST RESULTS:');
        console.log('========================');
        
        this.testResults.forEach(result => {
            const status = result.success ? '✅' : '❌';
            console.log(`${status} ${result.type}: ${result.message}`);
        });
        
        const successCount = this.testResults.filter(r => r.success).length;
        const totalCount = this.testResults.length;
        
        console.log(`\n📈 Overall: ${successCount}/${totalCount} tests passed`);
        
        if (successCount === totalCount) {
            console.log('🎉 All email tests passed! Email system is working perfectly.');
        } else {
            console.log('⚠️ Some email tests failed. Check the errors above.');
        }
    }

    // QUICK TEST FUNCTIONS
    async quickTest(email) {
        console.log(`🚀 Running quick email test to ${email}...`);
        
        try {
            const result = await this.emailService.sendTestEmail(email);
            if (result.success) {
                console.log('✅ Quick test passed! Check your email.');
                return true;
            } else {
                console.log('❌ Quick test failed:', result.error);
                return false;
            }
        } catch (error) {
            console.log('❌ Quick test error:', error.message);
            return false;
        }
    }

    // INTEGRATION TESTS
    async testEmailIntegration() {
        console.log('🔗 Testing email integration...');
        
        if (!window.emailIntegration) {
            console.log('❌ Email integration not found');
            return false;
        }
        
        // Test setup
        const testEmail = 'integration-test@example.com';
        const testChild = 'Integration Test Child';
        
        try {
            // Setup email preferences
            const setupSuccess = window.setupSpellBlocEmails(testEmail, testChild, {
                welcome: true,
                achievements: true,
                progress: true,
                milestones: true,
                weekly: true
            });
            
            if (setupSuccess) {
                console.log('✅ Email integration setup successful');
                
                // Test manual triggers
                await window.emailIntegration.triggerWelcomeEmail();
                console.log('✅ Welcome email trigger works');
                
                return true;
            } else {
                console.log('❌ Email integration setup failed');
                return false;
            }
        } catch (error) {
            console.log('❌ Email integration test failed:', error.message);
            return false;
        }
    }

    // PERFORMANCE TEST
    async performanceTest(email, count = 5) {
        console.log(`⚡ Running performance test (${count} emails)...`);
        
        const startTime = Date.now();
        const promises = [];
        
        for (let i = 0; i < count; i++) {
            promises.push(this.emailService.sendTestEmail(email));
        }
        
        try {
            const results = await Promise.all(promises);
            const endTime = Date.now();
            const duration = endTime - startTime;
            
            const successCount = results.filter(r => r.success).length;
            
            console.log(`📊 Performance Results:`);
            console.log(`   • ${successCount}/${count} emails sent successfully`);
            console.log(`   • Total time: ${duration}ms`);
            console.log(`   • Average time per email: ${Math.round(duration / count)}ms`);
            
            return {
                successCount,
                totalCount: count,
                totalTime: duration,
                averageTime: Math.round(duration / count)
            };
        } catch (error) {
            console.log('❌ Performance test failed:', error.message);
            return null;
        }
    }
}

// Initialize Email Tester
let emailTester = null;

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(async () => {
        emailTester = new EmailTester();
        await emailTester.init();
        window.emailTester = emailTester;
        
        console.log('🧪 Email Tester ready! Use these commands:');
        console.log('   • emailTester.quickTest("your@email.com")');
        console.log('   • emailTester.runAllTests("your@email.com")');
        console.log('   • emailTester.testEmailIntegration()');
        console.log('   • emailTester.performanceTest("your@email.com", 3)');
    }, 4000);
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EmailTester;
}

console.log('🧪 Email Tester loaded');