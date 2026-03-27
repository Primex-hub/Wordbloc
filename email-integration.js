// SpellBloc Email Integration - Connects game events to email notifications
class EmailIntegration {
    constructor() {
        this.emailService = window.emailService;
        this.parentEmail = null;
        this.childName = null;
        this.emailPreferences = {
            welcome: true,
            achievements: true,
            progress: true,
            milestones: true,
            weekly: true
        };
        this.init();
    }

    init() {
        // Load saved email preferences
        this.loadEmailPreferences();
        
        // Set up email triggers
        this.setupEmailTriggers();
        
        console.log('📧 Email integration initialized');
    }

    // SETUP EMAIL PREFERENCES
    setupEmailPreferences(parentEmail, childName, preferences = {}) {
        this.parentEmail = parentEmail;
        this.childName = childName;
        this.emailPreferences = { ...this.emailPreferences, ...preferences };
        
        // Save to localStorage
        localStorage.setItem('spellbloc_email_prefs', JSON.stringify({
            parentEmail: this.parentEmail,
            childName: this.childName,
            preferences: this.emailPreferences
        }));

        // Send welcome email
        if (this.emailPreferences.welcome) {
            this.sendWelcomeEmail();
        }
    }

    // LOAD EMAIL PREFERENCES
    loadEmailPreferences() {
        const saved = localStorage.getItem('spellbloc_email_prefs');
        if (saved) {
            const data = JSON.parse(saved);
            this.parentEmail = data.parentEmail;
            this.childName = data.childName;
            this.emailPreferences = { ...this.emailPreferences, ...data.preferences };
        }
    }

    // SETUP EMAIL TRIGGERS
    setupEmailTriggers() {
        // Hook into existing game events
        this.setupAchievementTrigger();
        this.setupMilestoneTrigger();
        this.setupProgressTrigger();
        this.setupWeeklyTrigger();
    }

    // ACHIEVEMENT EMAIL TRIGGER
    setupAchievementTrigger() {
        // Override the existing reward system to trigger emails
        const originalCheckAchievements = window.rewardSystem?.checkAchievements;
        
        if (originalCheckAchievements && window.rewardSystem) {
            window.rewardSystem.checkAchievements = (stats) => {
                const previousBadgeCount = window.rewardSystem.badges.length;
                
                // Run original function
                const result = originalCheckAchievements.call(window.rewardSystem, stats);
                
                // Check if new badges were earned
                const newBadgeCount = window.rewardSystem.badges.length;
                if (newBadgeCount > previousBadgeCount && this.emailPreferences.achievements) {
                    const newBadges = window.rewardSystem.badges.slice(previousBadgeCount);
                    newBadges.forEach(badge => this.sendAchievementEmail(badge));
                }
                
                return result;
            };
        }
    }

    // MILESTONE EMAIL TRIGGER
    setupMilestoneTrigger() {
        // Monitor level ups and major milestones
        const originalSaveProgress = window.saveProgress;
        
        if (originalSaveProgress) {
            window.saveProgress = () => {
                const previousLevel = parseInt(localStorage.getItem('spellbloc_playerLevel')) || 1;
                
                // Run original function
                originalSaveProgress();
                
                const currentLevel = parseInt(localStorage.getItem('spellbloc_playerLevel')) || 1;
                
                // Check for level up
                if (currentLevel > previousLevel && this.emailPreferences.milestones) {
                    this.sendMilestoneEmail({
                        type: 'level_up',
                        level: currentLevel,
                        previousLevel: previousLevel
                    });
                }
                
                // Check for star milestones
                const totalStars = parseInt(localStorage.getItem('spellbloc_totalStars')) || 0;
                if (this.isStarMilestone(totalStars) && this.emailPreferences.milestones) {
                    this.sendMilestoneEmail({
                        type: 'star_milestone',
                        stars: totalStars
                    });
                }
            };
        }
    }

    // PROGRESS EMAIL TRIGGER
    setupProgressTrigger() {
        // Send progress emails after significant sessions
        let sessionCount = 0;
        const originalEndSession = window.adaptiveLearning?.analytics?.endSession;
        
        if (originalEndSession && window.adaptiveLearning?.analytics) {
            window.adaptiveLearning.analytics.endSession = () => {
                // Run original function
                originalEndSession.call(window.adaptiveLearning.analytics);
                
                sessionCount++;
                
                // Send progress email every 5 sessions
                if (sessionCount % 5 === 0 && this.emailPreferences.progress) {
                    this.sendProgressEmail();
                }
            };
        }
    }

    // WEEKLY EMAIL TRIGGER
    setupWeeklyTrigger() {
        // Check if it's time for weekly summary
        const lastWeeklyEmail = localStorage.getItem('spellbloc_last_weekly_email');
        const now = Date.now();
        const oneWeek = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
        
        if (!lastWeeklyEmail || (now - parseInt(lastWeeklyEmail)) > oneWeek) {
            if (this.emailPreferences.weekly) {
                setTimeout(() => this.sendWeeklySummary(), 5000); // Send after 5 seconds
            }
        }
    }

    // EMAIL SENDING METHODS
    async sendWelcomeEmail() {
        if (!this.parentEmail || !this.childName) return;
        
        try {
            const result = await this.emailService.sendWelcomeEmail(this.parentEmail, this.childName);
            if (result.success) {
                console.log('✅ Welcome email sent successfully');
                this.trackEmailSent('welcome');
            }
        } catch (error) {
            console.error('❌ Failed to send welcome email:', error);
        }
    }

    async sendAchievementEmail(achievement) {
        if (!this.parentEmail || !this.childName) return;
        
        try {
            const result = await this.emailService.sendAchievementEmail(
                this.parentEmail, 
                this.childName, 
                achievement
            );
            if (result.success) {
                console.log('✅ Achievement email sent successfully');
                this.trackEmailSent('achievement');
            }
        } catch (error) {
            console.error('❌ Failed to send achievement email:', error);
        }
    }

    async sendMilestoneEmail(milestone) {
        if (!this.parentEmail || !this.childName) return;
        
        const milestoneData = this.formatMilestoneData(milestone);
        
        try {
            const result = await this.emailService.sendMilestoneEmail(
                this.parentEmail, 
                this.childName, 
                milestoneData
            );
            if (result.success) {
                console.log('✅ Milestone email sent successfully');
                this.trackEmailSent('milestone');
            }
        } catch (error) {
            console.error('❌ Failed to send milestone email:', error);
        }
    }

    async sendProgressEmail() {
        if (!this.parentEmail || !this.childName) return;
        
        const progressData = this.gatherProgressData();
        
        try {
            const result = await this.emailService.sendProgressReport(
                this.parentEmail, 
                this.childName, 
                progressData
            );
            if (result.success) {
                console.log('✅ Progress email sent successfully');
                this.trackEmailSent('progress');
            }
        } catch (error) {
            console.error('❌ Failed to send progress email:', error);
        }
    }

    async sendWeeklySummary() {
        if (!this.parentEmail || !this.childName) return;
        
        const weeklyData = this.gatherWeeklyData();
        
        try {
            const result = await this.emailService.sendWeeklySummary(
                this.parentEmail, 
                this.childName, 
                weeklyData
            );
            if (result.success) {
                console.log('✅ Weekly summary sent successfully');
                this.trackEmailSent('weekly');
                localStorage.setItem('spellbloc_last_weekly_email', Date.now().toString());
            }
        } catch (error) {
            console.error('❌ Failed to send weekly summary:', error);
        }
    }

    // DATA GATHERING METHODS
    gatherProgressData() {
        const analytics = window.adaptiveLearning?.analytics?.getProgressReport() || {};
        const rewardSystem = window.rewardSystem || {};
        
        return {
            accuracy: analytics.accuracy || 0,
            wordsLearned: analytics.totalAttempts || 0,
            timeSpent: analytics.averageSessionTime * analytics.totalSessions || 0,
            strongAreas: analytics.strongAreas?.map(area => area.category) || [],
            improvementAreas: analytics.weakAreas?.map(area => area.category) || [],
            achievements: rewardSystem.badges?.slice(-3) || [] // Last 3 achievements
        };
    }

    gatherWeeklyData() {
        const analytics = window.adaptiveLearning?.analytics?.getProgressReport() || {};
        const totalStars = parseInt(localStorage.getItem('spellbloc_totalStars')) || 0;
        const playerLevel = parseInt(localStorage.getItem('spellbloc_playerLevel')) || 1;
        
        return {
            sessionsPlayed: analytics.totalSessions || 0,
            wordsAttempted: analytics.totalAttempts || 0,
            accuracy: analytics.accuracy || 0,
            badgesEarned: window.rewardSystem?.badges?.length || 0,
            highlights: this.generateWeeklyHighlights(analytics, totalStars, playerLevel)
        };
    }

    generateWeeklyHighlights(analytics, totalStars, playerLevel) {
        const highlights = [];
        
        if (analytics.accuracy >= 90) {
            highlights.push(`🎯 Achieved ${analytics.accuracy}% accuracy - Outstanding!`);
        } else if (analytics.accuracy >= 80) {
            highlights.push(`📈 Great ${analytics.accuracy}% accuracy rate`);
        }
        
        if (totalStars >= 100) {
            highlights.push(`⭐ Collected ${totalStars} stars - Amazing dedication!`);
        }
        
        if (playerLevel >= 5) {
            highlights.push(`🏆 Reached Level ${playerLevel} - Excellent progress!`);
        }
        
        if (analytics.totalAttempts >= 50) {
            highlights.push(`📚 Practiced ${analytics.totalAttempts} words this week`);
        }
        
        if (highlights.length === 0) {
            highlights.push('🌟 Making steady progress in spelling journey');
        }
        
        return highlights;
    }

    formatMilestoneData(milestone) {
        switch (milestone.type) {
            case 'level_up':
                return {
                    emoji: '🎉',
                    title: `Level ${milestone.level} Achieved!`,
                    description: `${this.childName} has advanced from Level ${milestone.previousLevel} to Level ${milestone.level}! This shows incredible dedication to learning.`
                };
            case 'star_milestone':
                return {
                    emoji: '⭐',
                    title: `${milestone.stars} Stars Collected!`,
                    description: `What an achievement! ${this.childName} has collected ${milestone.stars} stars through consistent practice and excellent spelling.`
                };
            default:
                return {
                    emoji: '🌟',
                    title: 'Milestone Reached!',
                    description: `${this.childName} has reached an important milestone in their spelling journey!`
                };
        }
    }

    isStarMilestone(stars) {
        const milestones = [50, 100, 250, 500, 1000];
        return milestones.includes(stars);
    }

    // EMAIL TRACKING
    trackEmailSent(type) {
        const emailStats = JSON.parse(localStorage.getItem('spellbloc_email_stats') || '{}');
        emailStats[type] = (emailStats[type] || 0) + 1;
        emailStats.lastSent = Date.now();
        localStorage.setItem('spellbloc_email_stats', JSON.stringify(emailStats));
    }

    // EMAIL PREFERENCE MANAGEMENT
    updateEmailPreferences(preferences) {
        this.emailPreferences = { ...this.emailPreferences, ...preferences };
        this.saveEmailPreferences();
    }

    saveEmailPreferences() {
        localStorage.setItem('spellbloc_email_prefs', JSON.stringify({
            parentEmail: this.parentEmail,
            childName: this.childName,
            preferences: this.emailPreferences
        }));
    }

    getEmailStats() {
        return JSON.parse(localStorage.getItem('spellbloc_email_stats') || '{}');
    }

    // TEST EMAIL FUNCTIONALITY
    async sendTestEmail() {
        if (!this.parentEmail) {
            console.error('No parent email configured');
            return false;
        }
        
        try {
            const result = await this.emailService.sendTestEmail(this.parentEmail);
            return result.success;
        } catch (error) {
            console.error('Test email failed:', error);
            return false;
        }
    }

    // MANUAL EMAIL TRIGGERS (for testing)
    async triggerWelcomeEmail() {
        await this.sendWelcomeEmail();
    }

    async triggerProgressEmail() {
        await this.sendProgressEmail();
    }

    async triggerWeeklySummary() {
        await this.sendWeeklySummary();
    }
}

// Initialize Email Integration
let emailIntegration = null;

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        emailIntegration = new EmailIntegration();
        window.emailIntegration = emailIntegration; // Make globally available
        
        console.log('📧 Email integration ready');
    }, 2000); // Wait for other systems to initialize
});

// Utility function to setup emails for new users
window.setupSpellBlocEmails = function(parentEmail, childName, preferences = {}) {
    if (emailIntegration) {
        emailIntegration.setupEmailPreferences(parentEmail, childName, preferences);
        console.log(`📧 Email setup complete for ${childName} (${parentEmail})`);
        return true;
    } else {
        console.error('Email integration not ready yet');
        return false;
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EmailIntegration;
}

console.log('📧 SpellBloc Email Integration loaded');