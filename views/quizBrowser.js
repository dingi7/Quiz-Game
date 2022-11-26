import {render, html} from 'https://unpkg.com/lit-html?module';
import { getQuizes, getSubmitionsForQuiz } from '../src/api/data.js';

const template = html`
            <section id="browse">
                <header class="pad-large">
                    <form class="browse-filter">
                        <input class="input" type="text" name="query" id='search'>
                        <select class="input" name="topic">
                            <option value="all">All Categories</option>
                            <option value="it">Languages</option>
                            <option value="hardware">Hardware</option>
                            <option value="software">Tools and Software</option>
                        </select>
                        <input class="input submit action" type="submit" value="Filter Quizes">
                    </form>
                    <h1>All quizes</h1>
                </header>

                <div class="pad-large alt-page async">
                    <div class="sk-cube-grid">
                        <div class="sk-cube sk-cube1"></div>
                        <div class="sk-cube sk-cube2"></div>
                        <div class="sk-cube sk-cube3"></div>
                        <div class="sk-cube sk-cube4"></div>
                        <div class="sk-cube sk-cube5"></div>
                        <div class="sk-cube sk-cube6"></div>
                        <div class="sk-cube sk-cube7"></div>
                        <div class="sk-cube sk-cube8"></div>
                        <div class="sk-cube sk-cube9"></div>
                    </div>
                </div>
                <div class="pad-large alt-page">
                </div>
            </section>
`

const quizTemplate = (quiz) => html`
                    <article class="preview layout">
                        <div class="right-col">
                            <a class="action cta" href="details/${quiz.objectId}">View Quiz</a>
                        </div>
                        <div class="left-col">
                            <h3><a class="quiz-title-link" href="#">${quiz.title}</a></h3>
                            <span class="quiz-topic">Topic: ${quiz.topic}</span>
                            <div class="quiz-meta">
                                <span>${quiz.questionCount} questions </span>
                                <span>|</span>
                                <span>Taken ${quiz.count} times</span>
                            </div>
                        </div>
                    </article>
`

export async function renderQuizBrowser(ctx, next) {
    render(template, document.querySelector('main'));
    const quizes = await getQuizes();
    const container = document.getElementsByClassName('pad-large alt-page')[0]
    for(let quiz of quizes.results){
        const submitions = await getSubmitionsForQuiz(quiz.objectId);
        quiz.count = submitions.count;
    }
    document.getElementsByClassName('sk-cube-grid')[0].style.display = 'none';
    render(quizes.results.map(quizTemplate), container)
    const search = document.getElementById('search');
    search.addEventListener('input', (e) => {
        e.preventDefault()
        const query = e.target.value;
        const filteredQuizes = quizes.results.filter(quiz => quiz.title.toLowerCase().includes(query.toLowerCase()));
        render(filteredQuizes.map(quizTemplate), container)
    })
    const btn = document.getElementsByClassName('input submit action')[0]
    btn.addEventListener('click', (e) => {
        e.preventDefault()
        const topic = document.querySelector('select').value;
        if(topic === 'all') {
            render(quizes.results.map(quizTemplate), container)
        } else {
        const filteredQuizes = quizes.results.filter(quiz => quiz.topic.toLowerCase().includes(topic.toLowerCase()));
        render(filteredQuizes.map(quizTemplate), container)}
    })

    next();
}