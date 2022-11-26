import {render, html} from 'https://unpkg.com/lit-html?module';
import { logout } from 'https://dingi7.github.io/Quiz-Game/views/register.js';

const userNavTemplate = html`
                <nav>
                <a class="logotype" href="/"><i class="fas fa-question-circle"></i><i
                        class="merge fas fa-check-circle"></i><span>Quiz Fever</span></a>
                <div class="navigation">
                    <a class="nav-link" href="/browse">Browse</a>
                    <div id="user-nav">
                        <a class="nav-link" href="/create">Create</a>
                        <a class="nav-link profile-link" href="/profile/${sessionStorage.getItem("userId")}"><i class="fas fa-user-circle"></i></a>
                        <a id="logoutBtn" class="nav-link" href="javascript:void(0)">Logout</a>
                    </div>
                </div>
            </nav>
`

const guestNavTemplate = html`
            <nav>
                <a class="logotype" href="/"><i class="fas fa-question-circle"></i><i
                        class="merge fas fa-check-circle"></i><span>Quiz Fever</span></a>
                <div class="navigation">
                    <a class="nav-link" href="/browse">Browse</a>
                    <div id="guest-nav">
                        <a class="nav-link" href="/login">Sign in</a>
                    </div>
                </div>
            </nav>`

export function renderNav(ctx, next) {
    if(ctx.user){
        render(userNavTemplate, document.querySelector('header'))
        document.getElementById('logoutBtn').addEventListener('click', (e)=>{
            e.preventDefault()
            logout()
            ctx.page.redirect('/')
        })
        document.querySelector('#user-nav').style.display = 'inline-block';
    }else{
        render(guestNavTemplate, document.querySelector('header'))
        document.querySelector('#guest-nav').style.display = 'inline-block';
    }
}
    