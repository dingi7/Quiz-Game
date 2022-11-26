import { render, html } from 'https://unpkg.com/lit-html?module';
import { getMostRecentQuiz, getNumberOfQuizes, getSubmitionsForQuiz, getTopics } from '../src/api/data.js';
import { loadingTemplate } from './loading.js';

const homeTemplate = (recent, quizCount, topics, submitions) => html`
    <section id="welcome">
        <div class="hero layout">
            <div class="splash right-col">
                <i class="fas fa-clipboard-list"></i>
            </div>
            <div class="glass welcome">
                <h1>Welcome to Quiz Fever!</h1>
                <p>
                    Home to ${quizCount} quizes in ${topics} topics.
                    <a href="/browse">Browse all quizes</a>.
                </p>
                ${sessionStorage.authToken ? html`` : html`<a class="action cta" href="/login">Sign in to create a quiz</a>`}

            </div>
        </div>

        <div class="pad-large alt-page">
            <h2>Our most recent quiz:</h2>
            ${recent ? html`            <article class="preview layout">
                <div class="right-col">
                    <a class="action cta" href="details/${recent.objectId}">View Quiz</a>
                </div>
                <div class="left-col">
                    <h3>${recent.title}</h3>
                    <span class="quiz-topic">Topic: ${recent.topic}</span>
                    <div class="quiz-meta">
                        <span>${recent.questionCount} questions</span>
                        <span>|</span>
                        <span>Taken ${submitions} times</span>
                    </div>
                </div>
            </article>` : html`<br><article><div class="left-col"><h3>No quizes yet</h3></div></article>`}

            <div>
                <a class="action cta" href="/browse">Browse all quizes</a>
            </div>
        </div>
    </section>
`;


export async function renderHome() {
    render(loadingTemplate, document.querySelector('main'));
    const numberOfQuizes = await getNumberOfQuizes();
    const recent = await getMostRecentQuiz();
    const topics = await getTopics();
    if(recent.results.length > 0){
    const submitions = await getSubmitionsForQuiz(recent.results[0].objectId);
    render(homeTemplate(recent.results[0], numberOfQuizes.count, topics.results.length, submitions.count), document.querySelector('main'));
    }else{
        render(homeTemplate(null, numberOfQuizes.count, topics.results.length, null), document.querySelector('main'));
    }
}