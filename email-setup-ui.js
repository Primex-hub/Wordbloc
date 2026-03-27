// Email Setup UI - Modal for configuring parent email notifications
class EmailSetupUI {
    constructor() {
        this.modal = null;
        this.isSetup = false;
        this.init();
    }

    init() {
        // Check if email is already setup
        const emailPrefs = localStorage.getItem('spellbloc_email_prefs');
        this.isSetup = !!emailPrefs;
        
        // Show setup modal for new users after a delay
        if (!this.isSetup) {
            setTimeout(() => this.showSetupModal(), 10000); // Show after 10 seconds
        }
        
        // Add email setup button to settings
        this.addEmailSetupButton();
    }

    showSetupModal() {
        if (this.modal) return; // Already showing
        
        this.modal = document.createElement('div');
        this.modal.className = 'email-setup-modal';
        this.modal.innerHTML = `
            <div class="email-modal-content">
                <div class="email-modal-header">
                    <h2>📧 Stay Connected with Your Child's Progress!</h2>
                    <button class="email-modal-close">&times;</button>
                </div>
                
                <div class="email-modal-body">
                    <div class="email-benefits">
                        <h3>Get Updates About:</h3>
                        <div class="benefit-list">
                            <div class="benefit-item">
                                <span class="benefit-icon">🏆</span>
                                <span>New achievements and badges earned</span>
                            </div>
                            <div class="benefit-item">
                                <span class="benefit-icon">📊</span>
                                <span>Weekly progress reports</span>
                            </div>
                            <div class="benefit-item">
                                <span class="benefit-icon">🌟</span>
                                <span>Learning milestones reached</span>
                            </div>
                            <div class="benefit-item">
                                <span class="benefit-icon">💡</span>
                                <span>Personalized learning tips</span>
                            </div>
                        </div>
                    </div>
                    
                    <form id="emailSetupForm" class="email-setup-form">
                        <div class="form-group">
                            <label for="parentEmail">Parent Email Address:</label>
                            <input type="email" id="parentEmail" required placeholder="parent@example.com">
                        </div>
                        
                        <div class="form-group">
                            <label for="childName">Child's Name:</label>
                            <input type="text" id="childName" required placeholder="Enter child's name">
                        </div>
                        
                        <div class="form-group">
                            <label>Email Preferences:</label>
                            <div class="checkbox-group">
                                <label class="checkbox-label">
                                    <input type="checkbox" id="welcomeEmails" checked>
                                    <span>Welcome & getting started emails</span>
                                </label>
                                <label class="checkbox-label">
                                    <input type="checkbox" id="achievementEmails" checked>
                                    <span>Achievement notifications</span>
                                </label>
                                <label class="checkbox-label">
                                    <input type="checkbox" id="progressEmails" checked>
                                    <span>Progress reports</span>
                                </label>
                                <label class="checkbox-label">
                                    <input type="checkbox" id="milestoneEmails" checked>
                                    <span>Milestone celebrations</span>
                                </label>
                                <label class="checkbox-label">
                                    <input type="checkbox" id="weeklyEmails" checked>
                                    <span>Weekly summaries</span>
                                </label>
                            </div>
                        </div>
                        
                        <div class="form-actions">
                            <button type="submit" class="setup-email-btn">
                                📧 Setup Email Updates
                            </button>
                            <button type="button" class="skip-email-btn">
                                Skip for Now
                            </button>
                        </div>
                    </form>
                    
                    <div class="email-privacy">
                        <p><small>🔒 Your email is safe with us. We'll only send learning updates and you can unsubscribe anytime.</small></p>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.modal);
        this.setupModalEvents();
        
        // Add CSS styles
        this.addModalStyles();
    }

    setupModalEvents() {
        const form = this.modal.querySelector('#emailSetupForm');
        const closeBtn = this.modal.querySelector('.email-modal-close');
        const skipBtn = this.modal.querySelector('.skip-email-btn');
        
        form.addEventListener('submit', (e) => this.handleEmailSetup(e));
        closeBtn.addEventListener('click', () => this.closeModal());
        skipBtn.addEventListener('click', () => this.skipSetup());
        
        // Close on outside click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });
    }

    async handleEmailSetup(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const parentEmail = this.modal.querySelector('#parentEmail').value;
        const childName = this.modal.querySelector('#childName').value;
        
        const preferences = {
            welcome: this.modal.querySelector('#welcomeEmails').checked,
            achievements: this.modal.querySelector('#achievementEmails').checked,
            progress: this.modal.querySelector('#progressEmails').checked,
            milestones: this.modal.querySelector('#milestoneEmails').checked,
            weekly: this.modal.querySelector('#weeklyEmails').checked
        };
        
        // Show loading state
        const submitBtn = this.modal.querySelector('.setup-email-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = '⏳ Setting up...';
        submitBtn.disabled = true;
        
        try {
            // Setup email preferences
            if (window.setupSpellBlocEmails) {
                const success = window.setupSpellBlocEmails(parentEmail, childName, preferences);
                
                if (success) {
                    // Send test email to verify
                    if (window.emailIntegration) {
                        await window.emailIntegration.sendTestEmail();
                    }
                    
                    this.showSuccessMessage();
                    setTimeout(() => this.closeModal(), 3000);
                } else {
                    throw new Error('Failed to setup email preferences');
                }
            } else {
                throw new Error('Email system not ready');
            }
        } catch (error) {
            console.error('Email setup failed:', error);
            this.showErrorMessage('Setup failed. Please try again later.');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    showSuccessMessage() {
        const modalBody = this.modal.querySelector('.email-modal-body');
        modalBody.innerHTML = `
            <div class="email-success">
                <div class="success-icon">✅</div>
                <h3>Email Setup Complete!</h3>
                <p>You'll now receive updates about your child's learning progress.</p>
                <p><strong>Check your email for a welcome message!</strong></p>
                <div class="success-actions">
                    <button class="continue-btn" onclick="this.closest('.email-setup-modal').remove()">
                        Continue Playing 🎮
                    </button>
                </div>
            </div>
        `;
    }

    showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'email-error';
        errorDiv.textContent = message;
        
        const form = this.modal.querySelector('#emailSetupForm');
        form.insertBefore(errorDiv, form.firstChild);
        
        setTimeout(() => errorDiv.remove(), 5000);
    }

    skipSetup() {
        // Mark as skipped so we don't show again immediately
        localStorage.setItem('spellbloc_email_skipped', Date.now().toString());
        this.closeModal();
    }

    closeModal() {
        if (this.modal) {
            this.modal.remove();
            this.modal = null;
        }
    }

    addEmailSetupButton() {
        // Add email setup button to settings panel
        const settingsPanel = document.getElementById('settingsPanel');
        if (settingsPanel) {
            const emailSection = document.createElement('div');
            emailSection.className = 'settings-section';
            emailSection.innerHTML = `
                <h4>📧 Email Updates</h4>
                <p>Get progress reports and achievements via email</p>
                <button id="setupEmailBtn" class="setup-email-btn">
                    ${this.isSetup ? 'Manage Email Settings' : 'Setup Email Updates'}
                </button>
            `;
            
            settingsPanel.insertBefore(emailSection, settingsPanel.lastElementChild);
            
            const setupBtn = emailSection.querySelector('#setupEmailBtn');
            setupBtn.addEventListener('click', () => this.showSetupModal());
        }
    }

    addModalStyles() {
        if (document.getElementById('email-setup-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'email-setup-styles';
        styles.textContent = `
            .email-setup-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
                padding: 20px;
                box-sizing: border-box;
            }
            
            .email-modal-content {
                background: white;
                border-radius: 15px;
                max-width: 500px;
                width: 100%;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            }
            
            .email-modal-header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 20px;
                border-radius: 15px 15px 0 0;
                position: relative;
            }
            
            .email-modal-header h2 {
                margin: 0;
                font-size: 1.3em;
            }
            
            .email-modal-close {
                position: absolute;
                top: 15px;
                right: 20px;
                background: none;
                border: none;
                color: white;
                font-size: 24px;
                cursor: pointer;
                padding: 5px;
            }
            
            .email-modal-body {
                padding: 25px;
            }
            
            .email-benefits {
                margin-bottom: 25px;
            }
            
            .email-benefits h3 {
                margin: 0 0 15px 0;
                color: #333;
            }
            
            .benefit-list {
                display: grid;
                gap: 10px;
            }
            
            .benefit-item {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 10px;
                background: #f8f9fa;
                border-radius: 8px;
            }
            
            .benefit-icon {
                font-size: 1.2em;
            }
            
            .email-setup-form {
                display: grid;
                gap: 20px;
            }
            
            .form-group {
                display: grid;
                gap: 8px;
            }
            
            .form-group label {
                font-weight: bold;
                color: #333;
            }
            
            .form-group input[type=\"email\"],
            .form-group input[type=\"text\"] {
                padding: 12px;
                border: 2px solid #e9ecef;
                border-radius: 8px;
                font-size: 16px;
                transition: border-color 0.3s;
            }
            
            .form-group input:focus {
                outline: none;
                border-color: #667eea;
            }
            
            .checkbox-group {
                display: grid;
                gap: 8px;
            }
            
            .checkbox-label {
                display: flex;
                align-items: center;
                gap: 8px;
                font-weight: normal;
                cursor: pointer;
                padding: 5px;
            }
            
            .checkbox-label input[type=\"checkbox\"] {
                width: 18px;
                height: 18px;
            }
            
            .form-actions {
                display: grid;
                gap: 10px;
            }
            
            .setup-email-btn {
                background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
                color: white;
                border: none;
                padding: 15px 25px;
                border-radius: 25px;
                font-size: 16px;
                font-weight: bold;
                cursor: pointer;
                transition: transform 0.2s;
            }
            
            .setup-email-btn:hover {
                transform: translateY(-2px);
            }
            
            .setup-email-btn:disabled {
                opacity: 0.6;
                cursor: not-allowed;
                transform: none;
            }
            
            .skip-email-btn {
                background: #6c757d;
                color: white;
                border: none;
                padding: 12px 20px;
                border-radius: 20px;
                cursor: pointer;
            }
            
            .email-privacy {
                margin-top: 20px;
                text-align: center;
                color: #666;
            }
            
            .email-success {
                text-align: center;
                padding: 20px;
            }
            
            .success-icon {
                font-size: 4em;
                margin-bottom: 20px;
            }
            
            .email-success h3 {
                color: #28a745;
                margin-bottom: 15px;
            }
            
            .continue-btn {
                background: #28a745;
                color: white;
                border: none;
                padding: 15px 25px;
                border-radius: 25px;
                font-size: 16px;
                font-weight: bold;
                cursor: pointer;
                margin-top: 20px;
            }
            
            .email-error {
                background: #f8d7da;
                color: #721c24;
                padding: 10px 15px;
                border-radius: 5px;
                margin-bottom: 15px;
                border: 1px solid #f5c6cb;
            }
            
            @media (max-width: 600px) {
                .email-modal-content {
                    margin: 10px;
                    max-height: 95vh;
                }
                
                .email-modal-header {
                    padding: 15px;
                }
                
                .email-modal-body {
                    padding: 20px;
                }
            }
        `;
        
        document.head.appendChild(styles);
    }

    // Public methods for manual triggering
    showEmailSetup() {
        this.showSetupModal();
    }

    isEmailSetup() {
        return this.isSetup;
    }
}

// Initialize Email Setup UI
let emailSetupUI = null;

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        emailSetupUI = new EmailSetupUI();
        window.emailSetupUI = emailSetupUI;
        
        console.log('📧 Email Setup UI ready');
    }, 3000);
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EmailSetupUI;
}

console.log('📧 Email Setup UI loaded');