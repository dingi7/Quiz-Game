import { render, html } from 'https://unpkg.com/lit-html?module';
import { loadingTemplate } from './loading.js';
import page from '//unpkg.com/page/page.mjs';
import { createNewQuiz } from '../src/api/data.js';

const createNew = html`
                <section id="editor">

<header class="pad-large">
    <h1>New quiz</h1>
</header>

<div class="pad-large alt-page">
    <form>
        <label class="editor-label layout">
            <span class="label-col">Title:</span>
            <input class="input i-med" type="text" name="title"></label>
        <label class="editor-label layout">
            <span class="label-col">Topic:</span>
            <select class="input i-med" name="topic">
                <option value="all">All Categories</option>
                <option value="it">Languages</option>
                <option value="hardware">Hardware</option>
                <option value="software">Tools and Software</option>
            </select>
        </label>
        <input class="input submit action" type="submit" value="Save">
    </form>
</div>
</div>

</section>
`;

export async function renderCreate(ctx) {
    render(createNew, document.querySelector('main'));
    document.querySelector('form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.querySelector('input[name="title"]').value;
        const topic = document.querySelector('select[name="topic"]').value;
        if (!title || !topic) {
            return alert('All fields are required!');
        }
        const quiz = {
            title,
            topic,
            questionCount: 0,
            "ownerId": {
                "__type": "Pointer",
                "className": "_User",
                "objectId": sessionStorage.getItem("userId")
            },
            ownerUsername: sessionStorage.getItem('username')
        };
        render(loadingTemplate, document.querySelector('main'));
        const data = await createNewQuiz(quiz);
        page.redirect('/edit/' + data.objectId);
    });
}
