import { initQuiz } from 'https://dingi7.github.io/Quiz-Game/views/compete.js';
import { renderCreate } from 'https://dingi7.github.io/Quiz-Game/views/create.js';
import { renderEdit } from 'https://dingi7.github.io/Quiz-Game/views/edit.js';
import { renderHome } from 'https://dingi7.github.io/Quiz-Game/views/home.js';
import { renderLogin } from 'https://dingi7.github.io/Quiz-Game/views/login.js';
import { renderNav } from 'https://dingi7.github.io/Quiz-Game/views/nav.js';
import { renderProfile } from 'https://dingi7.github.io/Quiz-Game/views/profile.js';
import { renderQuizBrowser } from 'https://dingi7.github.io/Quiz-Game/views/quizBorwser.js';
import { renderQuizDetails } from 'https://dingi7.github.io/Quiz-Game/views/quizDetails.js';
import { renderRegister } from 'https://dingi7.github.io/Quiz-Game/views/register.js';
import page from 'https://unpkg.com/page/page.mjs';

page('/', nav, renderHome);
page('/login', nav, renderLogin);
page('/register', nav, renderRegister);
page('/browse', nav, renderQuizBrowser);
page('/details/:id', nav, renderQuizDetails);
page('/compete/:id', nav, initQuiz);
page('/create', nav, renderCreate);
page('/edit/:id', nav, renderEdit);
page('/profile/:id', nav, renderProfile);

page.start();

function nav(ctx, next) {
    const user = sessionStorage.getItem('authToken');
    if (user) {
        ctx.user = true;
    } else {
        ctx.user = false;
    }
    ctx.nav = nav;
    renderNav(ctx, next);
    ctx.render = 'render';
    next();
}
