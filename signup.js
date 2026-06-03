lucide.createIcons();

const username = document.getElementById("username")
username.addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/[^a-z0-9]/gi, "")
    e.target.value = e.target.value.replace(/-lynqo/g, "")
});

function togglePassword(inputId, btn) {
    const input = document.getElementById(inputId);
    const icon = btn.querySelector('i');
    if (input.type === 'password') {
        input.type = 'text';
        icon.setAttribute('data-lucide', 'eye-off');
    } else {
        input.type = 'password';
        icon.setAttribute('data-lucide', 'eye');
    }
    lucide.createIcons();
}

function checkPasswordStrength(password) {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    const colors = ['#ef4444', '#f59e0b', '#eab308', '#22c55e'];
    const texts = ['Weak', 'Fair', 'Good', 'Strong'];

    for (let i = 1; i <= 4; i++) {
        const bar = document.getElementById('str' + i);
        if (i <= score) {
            bar.style.width = '100%';
            bar.style.backgroundColor = colors[score - 1];
        } else {
            bar.style.width = '0%';
        }
    }

    const text = document.getElementById('strengthText');
    if (password.length === 0) {
        text.textContent = '';
    } else {
        text.textContent = texts[score - 1] || 'Too short';
        text.style.color = colors[score - 1] || '#ef4444';
    }
}


const msg = document.getElementById('msg')
const msg_title = document.getElementById('msg_title')
const signup_form = document.getElementById('signup')
const currency_input = document.getElementById('currency')
const location_input = document.getElementById('location')

function showPopup(title, text, isError = false) {
    msg_title.innerText = title;
    msg_title.style.color = isError ? '#ff0000' : '#0f172a';
    msg.style.color = isError ? '#ff0000' : '#0f766e';
    msg.innerText = text;

    const backdrop = document.getElementById('popup-backdrop');
    const popup = document.getElementById('popup');
    backdrop.style.pointerEvents = 'auto';
    backdrop.style.opacity = '1';
    popup.style.transform = 'translate(-50%, -50%) scale(1)';
    popup.style.opacity = '1';
}

function closePopup() {
    const backdrop = document.getElementById('popup-backdrop');
    const popup = document.getElementById('popup');
    backdrop.style.opacity = '0';
    backdrop.style.pointerEvents = 'none';
    popup.style.transform = 'translate(-50%, -50%) scale(0.95)';
    popup.style.opacity = '0';
}

if (signup_form) {
    currency_input.value = 'USD';
    location_input.value =  'United States (Global)'
    currency_input.readOnly = true;
    location_input.readOnly = true;

    fetch('https://api.ipify.org?format=json')
    .then(res => res.json())
    .then(ipData => {
        const ip = ipData.ip;

        const GEO_API_KEY = '781c6151a3a7413f8bc4fbf21b485743'
        return fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=${GEO_API_KEY}&ip=${ip}`);
    })
    .then(res => res.json())
    .then(geoData => {
        const currency = geoData.country_code2 === 'NG' ? 'NGN' : 'USD';
        const location = geoData.country_capital ? `${geoData.country_capital}, ${geoData.country_name}` : 'Washington, DC';
        currency_input.value = currency;
        location_input.value = location;
    })
    .catch(err => {
        console.error(err);
        msg.innerText = 'Could not detect location, defaulting to US';
    });
        
    signup_form.addEventListener('submit', (event) => {
        event.preventDefault()

        const btn = document.getElementById('submitBtn');
        btn.innerHTML = '<svg class="spinner" style="width:16px;height:16px;color:#fff;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle style="opacity:0.25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path style="opacity:0.75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Sending email...';
        btn.disabled = true;

        showPopup('Join the waitlist', 'Sending your email...')

        setTimeout(() => {
            showPopup('Join the waitlist', 'Success! You are now on the waitlist.')
            signup_form.reset()
            btn.innerHTML = '<svg style="width:16px;height:16px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Account created! Redirecting...';
            btn.style.background = '#10b981';
            setTimeout(() => { window.location.href = 'signin.html'; }, 1500);
        }, 1300);
    })
}
