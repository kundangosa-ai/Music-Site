document.addEventListener('DOMContentLoaded', () => {
    
    // --- Navbar Scroll Effect ---
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- Mobile Menu Toggle ---
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    // Close mobile menu when a link is clicked
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });

    // --- Modal Logic ---
    const uploadModal = document.getElementById('uploadModal');
    const modalContent = document.getElementById('modalContent');
    const openUploadBtn = document.getElementById('openUploadBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const cancelUploadBtn = document.getElementById('cancelUploadBtn');
    const modalBackdrop = document.getElementById('modalBackdrop');
    
    function openModal() {
        uploadModal.classList.remove('hidden');
        // Small delay to allow display block to apply before animating opacity
        setTimeout(() => {
            uploadModal.classList.remove('opacity-0');
            modalContent.classList.remove('scale-95');
            modalContent.classList.add('scale-100');
        }, 10);
    }

    function closeModal() {
        uploadModal.classList.add('opacity-0');
        modalContent.classList.remove('scale-100');
        modalContent.classList.add('scale-95');
        // Wait for animation to finish before hiding
        setTimeout(() => {
            uploadModal.classList.add('hidden');
        }, 300);
    }

    openUploadBtn.addEventListener('click', openModal);
    closeModalBtn.addEventListener('click', closeModal);
    cancelUploadBtn.addEventListener('click', closeModal);
    modalBackdrop.addEventListener('click', closeModal);


    // --- Custom Toast Notifications System ---
    const toastContainer = document.getElementById('toastContainer');

    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        
        // Setup Icon and Colors based on type
        let iconClass = 'fa-check-circle text-green-400';
        let borderClass = 'border-green-500/50';
        
        if (type === 'error') {
            iconClass = 'fa-circle-exclamation text-red-400';
            borderClass = 'border-red-500/50';
        }

        toast.className = `flex items-center gap-3 bg-dark-800 border ${borderClass} shadow-xl shadow-black/50 text-white px-5 py-3 rounded-lg transform translate-x-full transition-transform duration-300 ease-out`;
        
        toast.innerHTML = `
            <i class="fa-solid ${iconClass} text-xl"></i>
            <span class="font-medium text-sm">${message}</span>
        `;
        
        toastContainer.appendChild(toast);
        
        // Animate in
        requestAnimationFrame(() => {
            toast.classList.remove('translate-x-full');
            toast.classList.add('translate-x-0');
        });

        // Remove after 3.5 seconds
        setTimeout(() => {
            toast.classList.remove('translate-x-0');
            toast.classList.add('translate-x-full');
            
            // Wait for slide out animation before removing element
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3500);
    }

    // --- Form Submissions ---
    
    // Upload Form
    const uploadForm = document.getElementById('uploadForm');
    uploadForm.addEventListener('submit', (e) => {
        e.preventDefault(); 
        
        // Simulating upload process...
        closeModal();
        showToast('Media uploaded successfully to VibeStream!', 'success');
        
        // Reset form
        uploadForm.reset();
    });

    // Contact Form
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Show custom toast instead of native alert
        showToast('Message sent! Our Solwezi team will respond shortly.', 'success');
        
        // Reset form
        contactForm.reset();
    });
});