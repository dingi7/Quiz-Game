import { render, html } from 'https://unpkg.com/lit-html?module';
import page from '//unpkg.com/page/page.mjs';
import { register } from '../src/api/api.js';

const registerPageTemplate = html`
                <section id="register">
                <div class="pad-large">
                    <div class="glass narrow">
                        <header class="tab layout">
                            <a class="tab-item" href="/login">Login</a>
                            <h1 class="tab-item active">Register</h1>
                        </header>
                        <form class="pad-med centered">
                            <label class="block centered">Username: <input class="auth-input input" type="text"
                                    name="username" /></label>
                            <label class="block centered">Email: <input class="auth-input input" type="text"
                                    name="email" /></label>
                            <label class="block centered">Password: <input class="auth-input input" type="password"
                                    name="password" /></label>
                            <label class="block centered">Repeat: <input class="auth-input input" type="password"
                                    name="repass" /></label>
                            <input class="block action cta" type="submit" value="Create Account" />
                        </form>
                        <footer class="tab-footer">
                            Already have an account? <a class="invert" href="/login">Sign in here</a>.
                        </footer>
                    </div>
                </div>
            </section>
`

export function renderRegister(ctx,next){
    render(registerPageTemplate, document.querySelector('main'));
    document.querySelector('form').addEventListener('submit', onRegister);
}

async function onRegister(e){
    e.preventDefault();

    const formData = new FormData(e.target);
    const username = formData.get('username');
    const email = formData.get('email');
    const password = formData.get('password');
    const repass = formData.get('repass');

    if(username == '' || email == '' || password == '' || repass == ''){
        return alert('All fields are required!');
    }
    if(password != repass){
        return alert('Passwords don\'t match!');
    }

    try{
        await register(username, email, password);
        page.redirect('/');
    }catch(err){
        return alert(err);
    }
}