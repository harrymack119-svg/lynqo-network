lucide.createIcons();

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

const msg = document.getElementById('msg')
const msg_title = document.getElementById('msg_title')
const signin_form = document.getElementById('signin')

function popmsg() {
    setTimeout(() => {
        const p = document.getElementById('popup');
        p.style.transform = 'translate(0,0)';
        p.style.opacity = '1';
    }, 500);
}

function closePopup() {
    const p = document.getElementById('popup');
    p.style.transform = 'translate(-110%,-110%)';
    p.style.opacity = '0';
}

if (signin_form) {
    signin_form.addEventListener('submit', async (event) => {
        event.preventDefault()
        
        const btn = document.getElementById('submitBtn');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<svg class="spinner" style="width:16px;height:16px;color:#fff;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle style="opacity:0.25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path style="opacity:0.75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Signing in...';
        btn.disabled = true;

        const formdata = new FormData(event.target)
        const payload = Object.fromEntries(formdata.entries())

        function errs() {
            msg_title.innerText = '❌ Error'
            msg_title.style.color = '#ff0000'
            msg.style.color = '#ff0000'
            btn.innerHTML = 'Sign In <i data-lucide="arrow-right" style="width:16px;height:16px;"></i>';
            lucide.createIcons();
            btn.disabled = false;
        }

        try {
            const response = await fetch('/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                    payload
                )
            })
            const data = await response.json()
            if (data.success) {
                msg.innerText = data.success
                msg_title.innerText = '💜 Welcome to Lynqo!'
                msg_title.style.color = '#000000'
                msg.style.color = '#088000'
                popmsg()
                
                setTimeout(() => {
                    btn.innerHTML = '<svg style="width:16px;height:16px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Success! Redirecting...';
                    btn.style.background = '#10b981';
                    setTimeout(() => { window.location.href = '/dashboard'; }, 1500);
                }, 2000);
            }
            else if (data.error) {
                msg.innerText = data.error
                popmsg()
                errs()
            }
            else {
                msg.innerText = 'Something went wrong'
                popmsg()
                errs()
            }
        } catch (error) {
            msg.innerText = 'Something went wrong';
            popmsg()
            errs()
        }
    })
}