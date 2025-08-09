// Admin Authentication System
class AdminAuth {
    constructor() {
        this.isAuthenticated = false;
        this.validPasswords = ['01010302000006', 'dilip4118R'];
        this.sessionKey = 'dilip_admin_session';
        this.init();
    }

    init() {
        // Check if already authenticated
        this.checkSession();
        this.createAdminInterface();
        this.bindEvents();
    }

    checkSession() {
        const session = localStorage.getItem(this.sessionKey);
        if (session) {
            const sessionData = JSON.parse(session);
            const now = new Date().getTime();
            
            // Session valid for 24 hours
            if (now - sessionData.timestamp < 24 * 60 * 60 * 1000) {
                this.isAuthenticated = true;
                this.showAdminControls();
            } else {
                localStorage.removeItem(this.sessionKey);
            }
        }
    }

    authenticate(password) {
        if (this.validPasswords.includes(password)) {
            this.isAuthenticated = true;
            
            // Store session
            const sessionData = {
                timestamp: new Date().getTime(),
                authenticated: true
            };
            localStorage.setItem(this.sessionKey, JSON.stringify(sessionData));
            
            this.showAdminControls();
            this.hideLoginModal();
            this.showSuccessMessage('Authentication successful! Admin mode activated.');
            return true;
        } else {
            this.showErrorMessage('Invalid password. Access denied.');
            return false;
        }
    }

    logout() {
        this.isAuthenticated = false;
        localStorage.removeItem(this.sessionKey);
        this.hideAdminControls();
        this.showSuccessMessage('Logged out successfully.');
    }

    createAdminInterface() {
        // Create admin login modal
        const loginModal = document.createElement('div');
        loginModal.id = 'admin-login-modal';
        loginModal.className = 'admin-modal';
        loginModal.innerHTML = `
            <div class="admin-modal-content">
                <div class="admin-modal-header">
                    <h2>Admin Authentication</h2>
                    <button class="admin-close-btn">&times;</button>
                </div>
                <div class="admin-modal-body">
                    <form id="admin-login-form">
                        <div class="admin-form-group">
                            <label for="admin-password">Enter Admin Password:</label>
                            <input type="password" id="admin-password" required>
                        </div>
                        <button type="submit" class="admin-btn admin-btn-primary">Login</button>
                    </form>
                </div>
            </div>
        `;
        document.body.appendChild(loginModal);

        // Create admin control panel
        const adminPanel = document.createElement('div');
        adminPanel.id = 'admin-panel';
        adminPanel.className = 'admin-panel hidden';
        adminPanel.innerHTML = `
            <div class="admin-panel-header">
                <h3>Admin Panel</h3>
                <div class="admin-panel-controls">
                    <button id="admin-edit-mode" class="admin-btn admin-btn-secondary">Edit Mode</button>
                    <button id="admin-logout" class="admin-btn admin-btn-danger">Logout</button>
                </div>
            </div>
            <div class="admin-panel-body">
                <div class="admin-section-controls">
                    <button class="admin-section-btn" data-section="certifications">Edit Certifications</button>
                    <button class="admin-section-btn" data-section="skills">Edit Skills</button>
                    <button class="admin-section-btn" data-section="experience">Edit Experience</button>
                    <button class="admin-section-btn" data-section="research">Edit Research</button>
                    <button class="admin-section-btn" data-section="gallery">Edit Gallery</button>
                    <button class="admin-section-btn" data-section="projects">Edit Projects</button>
                    <button class="admin-section-btn" data-section="about">Edit About</button>
                </div>
            </div>
        `;
        document.body.appendChild(adminPanel);

        // Create admin floating button
        const adminFloatingBtn = document.createElement('div');
        adminFloatingBtn.id = 'admin-floating-btn';
        adminFloatingBtn.className = 'admin-floating-btn';
        adminFloatingBtn.innerHTML = `
            <i class="fas fa-cog"></i>
            <span class="admin-tooltip">Admin Panel</span>
        `;
        document.body.appendChild(adminFloatingBtn);

        // Create edit modal
        const editModal = document.createElement('div');
        editModal.id = 'admin-edit-modal';
        editModal.className = 'admin-modal';
        editModal.innerHTML = `
            <div class="admin-modal-content admin-edit-modal-content">
                <div class="admin-modal-header">
                    <h2 id="admin-edit-title">Edit Content</h2>
                    <button class="admin-close-btn">&times;</button>
                </div>
                <div class="admin-modal-body">
                    <div id="admin-edit-content"></div>
                    <div class="admin-modal-actions">
                        <button id="admin-save-changes" class="admin-btn admin-btn-primary">Save Changes</button>
                        <button id="admin-cancel-edit" class="admin-btn admin-btn-secondary">Cancel</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(editModal);

        // Create message container
        const messageContainer = document.createElement('div');
        messageContainer.id = 'admin-messages';
        messageContainer.className = 'admin-messages';
        document.body.appendChild(messageContainer);
    }

    bindEvents() {
        // Floating button click
        document.getElementById('admin-floating-btn').addEventListener('click', () => {
            if (this.isAuthenticated) {
                this.toggleAdminPanel();
            } else {
                this.showLoginModal();
            }
        });

        // Login form submit
        document.getElementById('admin-login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const password = document.getElementById('admin-password').value;
            this.authenticate(password);
        });

        // Logout button
        document.getElementById('admin-logout').addEventListener('click', () => {
            this.logout();
        });

        // Section edit buttons
        document.querySelectorAll('.admin-section-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = e.target.dataset.section;
                this.openEditModal(section);
            });
        });

        // Modal close buttons
        document.querySelectorAll('.admin-close-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.target.closest('.admin-modal').style.display = 'none';
            });
        });

        // Save changes button
        document.getElementById('admin-save-changes').addEventListener('click', () => {
            this.saveChanges();
        });

        // Cancel edit button
        document.getElementById('admin-cancel-edit').addEventListener('click', () => {
            document.getElementById('admin-edit-modal').style.display = 'none';
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl + Alt + A to open admin panel
            if (e.ctrlKey && e.altKey && e.key === 'a') {
                e.preventDefault();
                if (this.isAuthenticated) {
                    this.toggleAdminPanel();
                } else {
                    this.showLoginModal();
                }
            }
        });
    }

    showLoginModal() {
        document.getElementById('admin-login-modal').style.display = 'flex';
        document.getElementById('admin-password').focus();
    }

    hideLoginModal() {
        document.getElementById('admin-login-modal').style.display = 'none';
        document.getElementById('admin-password').value = '';
    }

    showAdminControls() {
        document.getElementById('admin-panel').classList.remove('hidden');
        document.getElementById('admin-floating-btn').classList.add('authenticated');
    }

    hideAdminControls() {
        document.getElementById('admin-panel').classList.add('hidden');
        document.getElementById('admin-floating-btn').classList.remove('authenticated');
    }

    toggleAdminPanel() {
        const panel = document.getElementById('admin-panel');
        panel.classList.toggle('visible');
    }

    openEditModal(section) {
        const modal = document.getElementById('admin-edit-modal');
        const title = document.getElementById('admin-edit-title');
        const content = document.getElementById('admin-edit-content');

        title.textContent = `Edit ${section.charAt(0).toUpperCase() + section.slice(1)}`;
        content.innerHTML = this.generateEditForm(section);
        modal.style.display = 'flex';
        modal.dataset.currentSection = section;
    }

    generateEditForm(section) {
        switch (section) {
            case 'certifications':
                return this.generateCertificationsForm();
            case 'skills':
                return this.generateSkillsForm();
            case 'experience':
                return this.generateExperienceForm();
            case 'research':
                return this.generateResearchForm();
            case 'gallery':
                return this.generateGalleryForm();
            case 'projects':
                return this.generateProjectsForm();
            case 'about':
                return this.generateAboutForm();
            default:
                return '<p>Edit form for this section is not implemented yet.</p>';
        }
    }

    generateCertificationsForm() {
        let form = '<div class="admin-edit-form">';
        form += '<h4>Certifications</h4>';
        form += '<div id="certifications-list">';
        
        certificationsData.forEach((cert, index) => {
            form += `
                <div class="admin-cert-item" data-index="${index}">
                    <h5>Certification ${index + 1}</h5>
                    <div class="admin-form-group">
                        <label>Title:</label>
                        <input type="text" name="cert-title-${index}" value="${cert.title}">
                    </div>
                    <div class="admin-form-group">
                        <label>Institution:</label>
                        <input type="text" name="cert-institution-${index}" value="${cert.institution}">
                    </div>
                    <div class="admin-form-group">
                        <label>Description:</label>
                        <textarea name="cert-description-${index}" rows="3">${cert.description}</textarea>
                    </div>
                    <div class="admin-form-group">
                        <label>Certificate URL:</label>
                        <input type="text" name="cert-url-${index}" value="${cert.certificateUrl}">
                    </div>
                    <button type="button" class="admin-btn admin-btn-danger admin-remove-cert" data-index="${index}">Remove</button>
                </div>
            `;
        });
        
        form += '</div>';
        form += '<button type="button" id="admin-add-cert" class="admin-btn admin-btn-success">Add New Certification</button>';
        form += '</div>';
        
        return form;
    }

    generateSkillsForm() {
        let form = '<div class="admin-edit-form">';
        form += '<h4>Skills</h4>';
        form += '<div id="skills-list">';
        
        skillsData.forEach((category, catIndex) => {
            form += `
                <div class="admin-skill-category" data-index="${catIndex}">
                    <h5>${category.category}</h5>
                    <div class="admin-form-group">
                        <label>Category Name:</label>
                        <input type="text" name="skill-category-${catIndex}" value="${category.category}">
                    </div>
                    <div class="admin-form-group">
                        <label>Icon:</label>
                        <input type="text" name="skill-icon-${catIndex}" value="${category.icon}">
                    </div>
                    <div class="admin-skills-items">
            `;
            
            category.skills.forEach((skill, skillIndex) => {
                form += `
                    <div class="admin-skill-item">
                        <input type="text" name="skill-name-${catIndex}-${skillIndex}" value="${skill.name}" placeholder="Skill name">
                        <input type="number" name="skill-progress-${catIndex}-${skillIndex}" value="${skill.progress}" min="0" max="100" placeholder="Progress %">
                        <button type="button" class="admin-btn admin-btn-danger admin-remove-skill" data-cat="${catIndex}" data-skill="${skillIndex}">Remove</button>
                    </div>
                `;
            });
            
            form += `
                    </div>
                    <button type="button" class="admin-btn admin-btn-success admin-add-skill" data-cat="${catIndex}">Add Skill</button>
                </div>
            `;
        });
        
        form += '</div>';
        form += '</div>';
        
        return form;
    }

    generateExperienceForm() {
        let form = '<div class="admin-edit-form">';
        form += '<h4>Experience</h4>';
        form += '<div id="experience-list">';
        
        experienceData.forEach((exp, index) => {
            form += `
                <div class="admin-exp-item" data-index="${index}">
                    <h5>Experience ${index + 1}</h5>
                    <div class="admin-form-group">
                        <label>Title:</label>
                        <input type="text" name="exp-title-${index}" value="${exp.title}">
                    </div>
                    <div class="admin-form-group">
                        <label>Date:</label>
                        <input type="text" name="exp-date-${index}" value="${exp.date}">
                    </div>
                    <div class="admin-form-group">
                        <label>Description:</label>
                        <textarea name="exp-description-${index}" rows="3">${exp.description}</textarea>
                    </div>
                    <button type="button" class="admin-btn admin-btn-danger admin-remove-exp" data-index="${index}">Remove</button>
                </div>
            `;
        });
        
        form += '</div>';
        form += '<button type="button" id="admin-add-exp" class="admin-btn admin-btn-success">Add New Experience</button>';
        form += '</div>';
        
        return form;
    }

    generateResearchForm() {
        let form = '<div class="admin-edit-form">';
        form += '<h4>Research Publications</h4>';
        form += '<div id="research-list">';
        
        researchData.forEach((research, index) => {
            form += `
                <div class="admin-research-item" data-index="${index}">
                    <h5>Research ${index + 1}</h5>
                    <div class="admin-form-group">
                        <label>Title:</label>
                        <input type="text" name="research-title-${index}" value="${research.title}">
                    </div>
                    <div class="admin-form-group">
                        <label>Journal:</label>
                        <input type="text" name="research-journal-${index}" value="${research.journal}">
                    </div>
                    <div class="admin-form-group">
                        <label>Date:</label>
                        <input type="text" name="research-date-${index}" value="${research.date}">
                    </div>
                    <div class="admin-form-group">
                        <label>Description:</label>
                        <textarea name="research-description-${index}" rows="3">${research.description}</textarea>
                    </div>
                    <div class="admin-form-group">
                        <label>URL:</label>
                        <input type="text" name="research-url-${index}" value="${research.url}">
                    </div>
                    <button type="button" class="admin-btn admin-btn-danger admin-remove-research" data-index="${index}">Remove</button>
                </div>
            `;
        });
        
        form += '</div>';
        form += '<button type="button" id="admin-add-research" class="admin-btn admin-btn-success">Add New Research</button>';
        form += '</div>';
        
        return form;
    }

    generateGalleryForm() {
        let form = '<div class="admin-edit-form">';
        form += '<h4>Gallery</h4>';
        form += '<div id="gallery-list">';
        
        galleryData.forEach((item, index) => {
            form += `
                <div class="admin-gallery-item" data-index="${index}">
                    <h5>Gallery Item ${index + 1}</h5>
                    <div class="admin-form-group">
                        <label>Title:</label>
                        <input type="text" name="gallery-title-${index}" value="${item.title}">
                    </div>
                    <div class="admin-form-group">
                        <label>Description:</label>
                        <textarea name="gallery-description-${index}" rows="2">${item.description}</textarea>
                    </div>
                    <div class="admin-form-group">
                        <label>Image URL:</label>
                        <input type="text" name="gallery-image-${index}" value="${item.image}">
                    </div>
                    <button type="button" class="admin-btn admin-btn-danger admin-remove-gallery" data-index="${index}">Remove</button>
                </div>
            `;
        });
        
        form += '</div>';
        form += '<button type="button" id="admin-add-gallery" class="admin-btn admin-btn-success">Add New Gallery Item</button>';
        form += '</div>';
        
        return form;
    }

    generateProjectsForm() {
        let form = '<div class="admin-edit-form">';
        form += '<h4>Projects</h4>';
        form += '<p>Project editing requires more complex interface. Use browser developer tools to modify projectData object directly.</p>';
        form += '</div>';
        
        return form;
    }

    generateAboutForm() {
        const aboutSection = document.querySelector('#about .about-text');
        const aboutText = aboutSection ? aboutSection.innerHTML : '';
        
        let form = '<div class="admin-edit-form">';
        form += '<h4>About Section</h4>';
        form += '<div class="admin-form-group">';
        form += '<label>About Content (HTML allowed):</label>';
        form += `<textarea id="about-content" rows="10" style="width: 100%;">${aboutText}</textarea>`;
        form += '</div>';
        form += '</div>';
        
        return form;
    }

    saveChanges() {
        const modal = document.getElementById('admin-edit-modal');
        const section = modal.dataset.currentSection;
        
        try {
            switch (section) {
                case 'certifications':
                    this.saveCertifications();
                    break;
                case 'skills':
                    this.saveSkills();
                    break;
                case 'experience':
                    this.saveExperience();
                    break;
                case 'research':
                    this.saveResearch();
                    break;
                case 'gallery':
                    this.saveGallery();
                    break;
                case 'about':
                    this.saveAbout();
                    break;
            }
            
            modal.style.display = 'none';
            this.showSuccessMessage(`${section.charAt(0).toUpperCase() + section.slice(1)} updated successfully!`);
            
            // Refresh the section
            this.refreshSection(section);
            
        } catch (error) {
            this.showErrorMessage(`Error saving ${section}: ${error.message}`);
        }
    }

    saveCertifications() {
        const certItems = document.querySelectorAll('.admin-cert-item');
        const newCertificationsData = [];
        
        certItems.forEach((item, index) => {
            const title = item.querySelector(`input[name="cert-title-${index}"]`).value;
            const institution = item.querySelector(`input[name="cert-institution-${index}"]`).value;
            const description = item.querySelector(`textarea[name="cert-description-${index}"]`).value;
            const certificateUrl = item.querySelector(`input[name="cert-url-${index}"]`).value;
            
            if (title && institution) {
                newCertificationsData.push({
                    title,
                    institution,
                    logo: '🎓',
                    description,
                    certificateUrl,
                    filename: title.toLowerCase().replace(/\s+/g, '_') + '.cert'
                });
            }
        });
        
        // Update global data
        window.certificationsData = newCertificationsData;
    }

    saveSkills() {
        const skillCategories = document.querySelectorAll('.admin-skill-category');
        const newSkillsData = [];
        
        skillCategories.forEach((category, catIndex) => {
            const categoryName = category.querySelector(`input[name="skill-category-${catIndex}"]`).value;
            const icon = category.querySelector(`input[name="skill-icon-${catIndex}"]`).value;
            const skillItems = category.querySelectorAll('.admin-skill-item');
            const skills = [];
            
            skillItems.forEach((item, skillIndex) => {
                const nameInput = item.querySelector(`input[name="skill-name-${catIndex}-${skillIndex}"]`);
                const progressInput = item.querySelector(`input[name="skill-progress-${catIndex}-${skillIndex}"]`);
                
                if (nameInput && progressInput && nameInput.value) {
                    skills.push({
                        name: nameInput.value,
                        progress: parseInt(progressInput.value) || 0
                    });
                }
            });
            
            if (categoryName && skills.length > 0) {
                newSkillsData.push({
                    category: categoryName,
                    icon,
                    filename: categoryName.toLowerCase().replace(/\s+/g, '_') + '.js',
                    skills
                });
            }
        });
        
        // Update global data
        window.skillsData = newSkillsData;
    }

    saveExperience() {
        const expItems = document.querySelectorAll('.admin-exp-item');
        const newExperienceData = [];
        
        expItems.forEach((item, index) => {
            const title = item.querySelector(`input[name="exp-title-${index}"]`).value;
            const date = item.querySelector(`input[name="exp-date-${index}"]`).value;
            const description = item.querySelector(`textarea[name="exp-description-${index}"]`).value;
            
            if (title && date) {
                newExperienceData.push({
                    title,
                    date,
                    description,
                    position: { top: 150 + (index * 250) }
                });
            }
        });
        
        // Update global data
        window.experienceData = newExperienceData;
    }

    saveResearch() {
        const researchItems = document.querySelectorAll('.admin-research-item');
        const newResearchData = [];
        
        researchItems.forEach((item, index) => {
            const title = item.querySelector(`input[name="research-title-${index}"]`).value;
            const journal = item.querySelector(`input[name="research-journal-${index}"]`).value;
            const date = item.querySelector(`input[name="research-date-${index}"]`).value;
            const description = item.querySelector(`textarea[name="research-description-${index}"]`).value;
            const url = item.querySelector(`input[name="research-url-${index}"]`).value;
            
            if (title && journal) {
                newResearchData.push({
                    title,
                    journal,
                    date,
                    description,
                    url
                });
            }
        });
        
        // Update global data
        window.researchData = newResearchData;
    }

    saveGallery() {
        const galleryItems = document.querySelectorAll('.admin-gallery-item');
        const newGalleryData = [];
        
        galleryItems.forEach((item, index) => {
            const title = item.querySelector(`input[name="gallery-title-${index}"]`).value;
            const description = item.querySelector(`textarea[name="gallery-description-${index}"]`).value;
            const image = item.querySelector(`input[name="gallery-image-${index}"]`).value;
            
            if (title && image) {
                newGalleryData.push({
                    id: index + 1,
                    title,
                    description,
                    image
                });
            }
        });
        
        // Update global data
        window.galleryData = newGalleryData;
    }

    saveAbout() {
        const aboutContent = document.getElementById('about-content').value;
        const aboutSection = document.querySelector('#about .about-text');
        
        if (aboutSection) {
            aboutSection.innerHTML = aboutContent;
        }
    }

    refreshSection(section) {
        switch (section) {
            case 'certifications':
                if (typeof generateCertificationTerminals === 'function') {
                    generateCertificationTerminals();
                }
                break;
            case 'skills':
                if (typeof generateSkillCategories === 'function') {
                    generateSkillCategories();
                }
                break;
            case 'experience':
                if (typeof generateExperienceContent === 'function') {
                    generateExperienceContent();
                }
                break;
            case 'research':
                if (typeof generateResearchItems === 'function') {
                    generateResearchItems();
                }
                break;
            case 'gallery':
                // Refresh gallery carousel
                if (window.SmoothRoboticsCarousel) {
                    new SmoothRoboticsCarousel();
                }
                break;
        }
    }

    showSuccessMessage(message) {
        this.showMessage(message, 'success');
    }

    showErrorMessage(message) {
        this.showMessage(message, 'error');
    }

    showMessage(message, type) {
        const container = document.getElementById('admin-messages');
        const messageEl = document.createElement('div');
        messageEl.className = `admin-message admin-message-${type}`;
        messageEl.textContent = message;
        
        container.appendChild(messageEl);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.parentNode.removeChild(messageEl);
            }
        }, 5000);
    }
}

// Initialize admin system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.adminAuth = new AdminAuth();
});