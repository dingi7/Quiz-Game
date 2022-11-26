import {render, html} from 'https://unpkg.com/lit-html?module';
import { getQuizById, getSubmitionsForQuiz } from '../src/api/data.js';
import { loadingTemplate } from './loading.js';

const template = (quiz, timesSoluted) => 
     html`
            <section id="details">
                <div class="pad-large alt-page">
                    <article class="details">
                        <h1>${quiz.title}</h1>
                        <span class="quiz-topic">A quiz by <a href="/profile/${quiz.ownerId.objectId}">${quiz.ownerUsername}</a> on the topic of ${quiz.topic}</span>
                        <div class="quiz-meta">
                            <span>${quiz.questionCount} Questions</span>
                            <span>|</span>
                            <span>Taken ${timesSoluted} times</span>
                        </div>
                        <p class="quiz-desc">Test your knowledge of ${quiz.title} by completing this quiz.
                            Lorem ipsum dolor
                            sit amet consectetur adipisicing elit. Aliquam recusandae corporis voluptatum quibusdam
                            maxime similique reprehenderit rem, officia vero at.</p>

                        <div>
                            <!-- mby user experiance better? -->
                            ${sessionStorage.authToken ? html`<a class="cta action" href="/compete/${quiz.objectId}">Start Quiz</a>` : html`<a class="cta action" href="/login">Sign in to start quiz</a>`}
                        </div>

                    </article>
                </div>
            </section>`

export async function renderQuizDetails(ctx, next) {
    render(loadingTemplate, document.querySelector('main'));
    const quiz = await getQuizById(ctx.params.id);
    const timesSoluted = await getSubmitionsForQuiz(ctx.params.id);
    render(template(quiz, timesSoluted.count), document.querySelector('main'));
    next();
}