import page from '//unpkg.com/page/page.mjs';
import { initQuiz } from '../views/compete.js';
import { renderCreate } from '../views/create.js';
import { renderEdit } from '../views/edit.js';
import { renderHome } from '../views/home.js';
import { renderLogin } from '../views/login.js';
import { renderNav } from '../views/nav.js'
import { renderProfile } from '../views/profile.js';
import { renderQuizBrowser } from '../views/quizBrowser.js';
import { renderQuizDetails } from '../views/quizDetails.js';
import { renderRegister } from '../views/register.js';

page('/', nav, renderHome);
page('/login', nav, renderLogin);
page('/register', nav, renderRegister);
page('/browse', nav, renderQuizBrowser);
page('/details/:id', nav, renderQuizDetails);
page('/compete/:id', nav, initQuiz)
page('/create', nav, renderCreate)
page('/edit/:id', nav, renderEdit)
page('/profile/:id', nav, renderProfile);


page.start();

function nav(ctx,next){
    const user = sessionStorage.getItem('authToken');
    if(user){
        ctx.user = true
    }else{
        ctx.user = false
    }
    ctx.nav = nav
    renderNav(ctx, next)
    next();
}