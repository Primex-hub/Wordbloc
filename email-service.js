// SpellBloc Email Service using Resend API
class EmailService {
    constructor() {
        this.apiKey = 're_9CAB6Qtv_C6VqwTMANNQLgzQXfrMsFtb3';
        this.baseUrl = 'https://api.resend.com';
        this.fromEmail = 'SpellBloc <onboarding@resend.dev>'; // Using Resend's verified domain
        this.isEnabled = true;
    }

    // SEND WELCOME EMAIL
    async sendWelcomeEmail(parentEmail, childName) {
        const emailData = {
            from: this.fromEmail,
            to: [parentEmail],
            subject: `🎉 Welcome to SpellBloc, ${childName}!`,
            html: this.generateWelcomeEmailHTML(childName),
            text: this.generateWelcomeEmailText(childName)
        };

        return await this.sendEmail(emailData);
    }

    // SEND PROGRESS REPORT
    async sendProgressReport(parentEmail, childName, progressData) {
        const emailData = {
            from: this.fromEmail,
            to: [parentEmail],
            subject: `📊 ${childName}'s Weekly Progress Report`,
            html: this.generateProgressReportHTML(childName, progressData),
            text: this.generateProgressReportText(childName, progressData)
        };

        return await this.sendEmail(emailData);
    }

    // SEND ACHIEVEMENT NOTIFICATION
    async sendAchievementEmail(parentEmail, childName, achievement) {
        const emailData = {
            from: this.fromEmail,
            to: [parentEmail],
            subject: `🏆 ${childName} Earned a New Badge!`,
            html: this.generateAchievementEmailHTML(childName, achievement),
            text: this.generateAchievementEmailText(childName, achievement)
        };

        return await this.sendEmail(emailData);
    }

    // SEND MILESTONE CELEBRATION
    async sendMilestoneEmail(parentEmail, childName, milestone) {
        const emailData = {
            from: this.fromEmail,
            to: [parentEmail],
            subject: `🌟 ${childName} Reached a New Milestone!`,
            html: this.generateMilestoneEmailHTML(childName, milestone),
            text: this.generateMilestoneEmailText(childName, milestone)
        };

        return await this.sendEmail(emailData);
    }

    // SEND WEEKLY SUMMARY
    async sendWeeklySummary(parentEmail, childName, weeklyData) {
        const emailData = {
            from: this.fromEmail,
            to: [parentEmail],
            subject: `📈 ${childName}'s Learning Journey This Week`,
            html: this.generateWeeklySummaryHTML(childName, weeklyData),
            text: this.generateWeeklySummaryText(childName, weeklyData)
        };

        return await this.sendEmail(emailData);
    }

    // CORE EMAIL SENDING FUNCTION
    async sendEmail(emailData) {
        if (!this.isEnabled) {
            console.log('Email service disabled');
            return { success: false, message: 'Email service disabled' };
        }

        try {
            const response = await fetch(`${this.baseUrl}/emails`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(emailData)
            });

            const result = await response.json();

            if (response.ok) {
                console.log('✅ Email sent successfully:', result.id);
                return { success: true, id: result.id };
            } else {
                console.error('❌ Email failed:', result);
                return { success: false, error: result };
            }
        } catch (error) {
            console.error('❌ Email service error:', error);
            return { success: false, error: error.message };
        }
    }

    // EMAIL TEMPLATES - HTML VERSIONS
    generateWelcomeEmailHTML(childName) {
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to SpellBloc!</title>
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px; margin-bottom: 30px; }
                .content { background: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 20px; }
                .emoji { font-size: 2em; margin: 10px; }
                .button { display: inline-block; background: #28a745; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; margin: 20px 0; font-weight: bold; }
                .features { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
                .feature { background: white; padding: 20px; border-radius: 8px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                .footer { text-align: center; color: #666; font-size: 0.9em; margin-top: 30px; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>🎮 Welcome to SpellBloc!</h1>
                <p>Where learning spelling is an adventure!</p>
            </div>
            
            <div class="content">
                <h2>Hello ${childName}! 👋</h2>
                <p>We're so excited to have you join our magical spelling adventure! SpellBloc makes learning fun with games, rewards, and personalized challenges just for you.</p>
                
                <div class="features">
                    <div class="feature">
                        <div class="emoji">🎯</div>
                        <h3>Personalized Learning</h3>
                        <p>AI adapts to your learning style</p>
                    </div>
                    <div class="feature">
                        <div class="emoji">🏆</div>
                        <h3>Earn Badges</h3>
                        <p>Collect achievements as you learn</p>
                    </div>
                    <div class="feature">
                        <div class="emoji">📊</div>
                        <h3>Track Progress</h3>
                        <p>See your spelling skills grow</p>
                    </div>
                    <div class="feature">
                        <div class="emoji">🌍</div>
                        <h3>Multi-Language</h3>
                        <p>Learn in 5 different languages</p>
                    </div>
                </div>
                
                <p><strong>Ready to start your spelling journey?</strong></p>
                <a href="https://wordbloc.vercel.app" class="button">🚀 Start Playing Now!</a>
            </div>
            
            <div class="footer">
                <p>Happy spelling! 📚✨<br>
                The SpellBloc Team</p>
                <p><small>This email was sent because you signed up for SpellBloc. If you didn't sign up, please ignore this email.</small></p>
            </div>
        </body>
        </html>
        `;
    }

    generateProgressReportHTML(childName, progressData) {
        const { accuracy, wordsLearned, timeSpent, strongAreas, improvementAreas, achievements } = progressData;
        
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${childName}'s Progress Report</title>
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center; border-radius: 10px; margin-bottom: 30px; }
                .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 15px; margin: 20px 0; }
                .stat { background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; border-left: 4px solid #28a745; }
                .stat-value { font-size: 2em; font-weight: bold; color: #28a745; }
                .stat-label { font-size: 0.9em; color: #666; }
                .section { background: white; padding: 25px; margin: 20px 0; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                .achievements { display: flex; flex-wrap: wrap; gap: 10px; }
                .achievement { background: #ffd700; padding: 10px 15px; border-radius: 20px; font-size: 0.9em; }
                .progress-bar { background: #e9ecef; height: 20px; border-radius: 10px; overflow: hidden; margin: 10px 0; }
                .progress-fill { background: linear-gradient(90deg, #28a745, #20c997); height: 100%; transition: width 0.3s ease; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>📊 ${childName}'s Progress Report</h1>
                <p>Amazing progress this week!</p>
            </div>
            
            <div class="stats">
                <div class="stat">
                    <div class="stat-value">${accuracy}%</div>
                    <div class="stat-label">Accuracy</div>
                </div>
                <div class="stat">
                    <div class="stat-value">${wordsLearned}</div>
                    <div class="stat-label">Words Learned</div>
                </div>
                <div class="stat">
                    <div class="stat-value">${Math.round(timeSpent / 60)}</div>
                    <div class="stat-label">Minutes Played</div>
                </div>
            </div>
            
            <div class="section">
                <h3>🌟 Strong Areas</h3>
                <p>${childName} is excelling in:</p>
                <ul>
                    ${strongAreas.map(area => `<li><strong>${area}</strong> - Keep up the great work!</li>`).join('')}
                </ul>
            </div>
            
            ${improvementAreas.length > 0 ? `
            <div class="section">
                <h3>🎯 Areas for Growth</h3>
                <p>Let's focus on these areas for even better results:</p>
                <ul>
                    ${improvementAreas.map(area => `<li>${area} - More practice will help!</li>`).join('')}
                </ul>
            </div>
            ` : ''}
            
            <div class="section">
                <h3>🏆 Recent Achievements</h3>
                <div class="achievements">
                    ${achievements.map(achievement => `<span class="achievement">${achievement.emoji} ${achievement.name}</span>`).join('')}
                </div>
            </div>
            
            <div class="section">
                <h3>📈 Overall Progress</h3>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${accuracy}%"></div>
                </div>
                <p><strong>${childName} is ${accuracy >= 80 ? 'excelling' : accuracy >= 60 ? 'progressing well' : 'building foundation'} with spelling!</strong></p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="https://wordbloc.vercel.app" style="display: inline-block; background: #28a745; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold;">Continue Learning 🚀</a>
            </div>
        </body>
        </html>
        `;
    }

    generateAchievementEmailHTML(childName, achievement) {
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New Achievement Unlocked!</title>
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%); color: #333; padding: 40px; text-align: center; border-radius: 10px; margin-bottom: 30px; }
                .achievement-badge { font-size: 4em; margin: 20px 0; }
                .content { background: #f8f9fa; padding: 30px; border-radius: 10px; text-align: center; }
                .celebration { font-size: 1.5em; margin: 20px 0; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>🎉 Achievement Unlocked!</h1>
                <div class="achievement-badge">${achievement.emoji}</div>
                <h2>${achievement.name}</h2>
            </div>
            
            <div class="content">
                <div class="celebration">🌟 Congratulations ${childName}! 🌟</div>
                <p><strong>You've earned the "${achievement.name}" badge!</strong></p>
                <p>${achievement.description}</p>
                <p>Keep up the amazing work! Every word you learn makes you a better speller.</p>
                
                <div style="margin: 30px 0;">
                    <a href="https://wordbloc.vercel.app" style="display: inline-block; background: #28a745; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold;">Keep Playing! 🚀</a>
                </div>
            </div>
        </body>
        </html>
        `;
    }

    // TEXT VERSIONS (for email clients that don't support HTML)
    generateWelcomeEmailText(childName) {
        return `
Welcome to SpellBloc, ${childName}!

We're so excited to have you join our magical spelling adventure! SpellBloc makes learning fun with games, rewards, and personalized challenges just for you.

What you'll love about SpellBloc:
• Personalized Learning - AI adapts to your learning style
• Earn Badges - Collect achievements as you learn
• Track Progress - See your spelling skills grow
• Multi-Language - Learn in 5 different languages

Ready to start your spelling journey?
Visit: https://wordbloc.vercel.app

Happy spelling!
The SpellBloc Team
        `;
    }

    generateProgressReportText(childName, progressData) {
        const { accuracy, wordsLearned, timeSpent, strongAreas, improvementAreas } = progressData;
        
        return `
${childName}'s Progress Report

Amazing progress this week!

STATS:
• Accuracy: ${accuracy}%
• Words Learned: ${wordsLearned}
• Time Played: ${Math.round(timeSpent / 60)} minutes

STRONG AREAS:
${strongAreas.map(area => `• ${area} - Keep up the great work!`).join('\n')}

${improvementAreas.length > 0 ? `
AREAS FOR GROWTH:
${improvementAreas.map(area => `• ${area} - More practice will help!`).join('\n')}
` : ''}

${childName} is ${accuracy >= 80 ? 'excelling' : accuracy >= 60 ? 'progressing well' : 'building foundation'} with spelling!

Continue learning: https://wordbloc.vercel.app
        `;
    }

    generateAchievementEmailText(childName, achievement) {
        return `
🎉 Achievement Unlocked!

Congratulations ${childName}!

You've earned the "${achievement.name}" badge!
${achievement.emoji} ${achievement.description}

Keep up the amazing work! Every word you learn makes you a better speller.

Keep playing: https://wordbloc.vercel.app
        `;
    }

    generateMilestoneEmailHTML(childName, milestone) {
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Milestone Reached!</title>
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px; text-align: center; border-radius: 10px; margin-bottom: 30px; }
                .milestone { font-size: 3em; margin: 20px 0; }
                .content { background: #f8f9fa; padding: 30px; border-radius: 10px; text-align: center; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>🌟 Milestone Reached!</h1>
                <div class="milestone">${milestone.emoji}</div>
                <h2>${milestone.title}</h2>
            </div>
            
            <div class="content">
                <p><strong>Incredible work, ${childName}!</strong></p>
                <p>${milestone.description}</p>
                <p>This is a huge accomplishment! You're becoming an amazing speller.</p>
                
                <div style="margin: 30px 0;">
                    <a href="https://wordbloc.vercel.app" style="display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold;">Continue Your Journey! 🚀</a>
                </div>
            </div>
        </body>
        </html>
        `;
    }

    generateMilestoneEmailText(childName, milestone) {
        return `
🌟 Milestone Reached!

Incredible work, ${childName}!

${milestone.emoji} ${milestone.title}

${milestone.description}

This is a huge accomplishment! You're becoming an amazing speller.

Continue your journey: https://wordbloc.vercel.app
        `;
    }

    generateWeeklySummaryHTML(childName, weeklyData) {
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${childName}'s Weekly Summary</title>
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #20c997 0%, #28a745 100%); color: white; padding: 30px; text-align: center; border-radius: 10px; margin-bottom: 30px; }
                .summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin: 20px 0; }
                .summary-item { background: white; padding: 20px; border-radius: 8px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                .big-number { font-size: 2.5em; font-weight: bold; color: #28a745; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>📈 ${childName}'s Learning Journey</h1>
                <p>This Week's Amazing Progress!</p>
            </div>
            
            <div class="summary-grid">
                <div class="summary-item">
                    <div class="big-number">${weeklyData.sessionsPlayed}</div>
                    <p>Sessions Played</p>
                </div>
                <div class="summary-item">
                    <div class="big-number">${weeklyData.wordsAttempted}</div>
                    <p>Words Attempted</p>
                </div>
                <div class="summary-item">
                    <div class="big-number">${weeklyData.accuracy}%</div>
                    <p>Accuracy Rate</p>
                </div>
                <div class="summary-item">
                    <div class="big-number">${weeklyData.badgesEarned}</div>
                    <p>New Badges</p>
                </div>
            </div>
            
            <div style="background: #f8f9fa; padding: 25px; border-radius: 10px; margin: 20px 0;">
                <h3>🎯 This Week's Highlights</h3>
                <ul>
                    ${weeklyData.highlights.map(highlight => `<li>${highlight}</li>`).join('')}
                </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
                <p><strong>Keep up the fantastic work, ${childName}!</strong></p>
                <a href="https://wordbloc.vercel.app" style="display: inline-block; background: #28a745; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold;">Continue Learning 🚀</a>
            </div>
        </body>
        </html>
        `;
    }

    generateWeeklySummaryText(childName, weeklyData) {
        return `
${childName}'s Learning Journey
This Week's Amazing Progress!

WEEKLY STATS:
• Sessions Played: ${weeklyData.sessionsPlayed}
• Words Attempted: ${weeklyData.wordsAttempted}
• Accuracy Rate: ${weeklyData.accuracy}%
• New Badges: ${weeklyData.badgesEarned}

THIS WEEK'S HIGHLIGHTS:
${weeklyData.highlights.map(highlight => `• ${highlight}`).join('\n')}

Keep up the fantastic work, ${childName}!

Continue learning: https://wordbloc.vercel.app
        `;
    }

    // UTILITY METHODS
    setFromEmail(email) {
        this.fromEmail = email;
    }

    enableService() {
        this.isEnabled = true;
    }

    disableService() {
        this.isEnabled = false;
    }

    // TEST EMAIL FUNCTION
    async sendTestEmail(toEmail) {
        const emailData = {
            from: this.fromEmail,
            to: [toEmail],
            subject: '🧪 SpellBloc Email Test',
            html: `
                <h1>✅ Email Service Working!</h1>
                <p>This is a test email from SpellBloc.</p>
                <p>If you received this, the email integration is working perfectly!</p>
                <p>🎮 Ready to start sending learning updates!</p>
            `,
            text: 'SpellBloc Email Test - Email service is working!'
        };

        return await this.sendEmail(emailData);
    }
}

// Initialize Email Service
const emailService = new EmailService();

// Make globally available
window.emailService = emailService;

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EmailService;
}

console.log('📧 SpellBloc Email Service initialized');