import { render, html } from 'https://unpkg.com/lit-html?module';
import page from '../node_modules/page/page.mjs';
import { login } from '../src/api/api.js';

const loginPageTemplate = html`
    <section id="login">
        <div class="pad-large">
            <div class="glass narrow">
                <header class="tab layout">
                    <h1 class="tab-item active">Login</h1>
                    <a class="tab-item" href="/register">Register</a>
                </header>
                <form class="pad-med centered">
                    <label class="block centered"
                        >Email:
                        <input
                            class="auth-input input"
                            type="text"
                            name="email"
                    /></label>
                    <label class="block centered"
                        >Password:
                        <input
                            class="auth-input input"
                            type="password"
                            name="password"
                    /></label>
                    <input
                        class="block action cta"
                        type="submit"
                        value="Sign In"
                    />
                </form>
                <footer class="tab-footer">
                    Don't have an account?
                    <a class="invert" href="/register">Create one here</a>.
                </footer>
            </div>
        </div>
    </section>
`;

export async function renderLogin(ctx, next) {
    render(loginPageTemplate, document.querySelector('main'));
    document.querySelector('form').addEventListener('submit', onLogin);
}

async function onLogin(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');

    if (email == '' || password == '') {
        return alert('All fields are required!');
    }
    await login(email, password);
    try {
        await login(email, password);
        page.redirect('/');
    } catch (err) {
        return alert(err.message);
    }
}
