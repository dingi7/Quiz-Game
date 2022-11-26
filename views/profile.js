import { html, render } from 'https://unpkg.com/lit-html?module';
import {
    deleteQuizById,
    getCreationsForUser,
    getSolutionsForUser,
    getSubmitionsForQuiz,
    getUserById,
} from 'https://dingi7.github.io/Quiz-Game/src/api/data.js';
import { loadingTemplate } from 'https://dingi7.github.io/Quiz-Game/views/loading.js';
import page from '//unpkg.com/page/page.mjs';

const template = (user) => html`
    <section id="profile">
        <header class="pad-large">
            <h1>Profile Page</h1>
        </header>

        <div class="hero pad-large">
            <article class="glass pad-large profile">
                <h2>Profile Details</h2>
                <p>
                    <span class="profile-info">Username:</span>
                    ${user.username}
                </p>
                <p>
                    <span class="profile-info">Email:</span>
                    ${user.email}
                </p>
                <h2>${user.username}'s Quiz Results</h2>
                <table class="quiz-results">
                    <tbody></tbody>
                </table>
            </article>
        </div>

        <header class="pad-large">
            <h2>Quizes created by ${user.username}</h2>
        </header>

        <div class="pad-large alt-page"></div>
    </section>
`;

const solutionsTemplate = (solution) => html`
    <tr class="results-row">
        <td class="cell-1">${solution.createdAt.split('T')[0]}</td>
        <td class="cell-2">
            <a href="/details/${solution.quiz.objectId}">${solution.title}</a>
        </td>
        <td class="cell-3 s-correct">
            ${Math.floor((solution.correct / solution.allQuestions) * 100)}%
        </td>
        <td class="cell-4 s-correct">
            ${solution.correct}/${solution.allQuestions} correct answers
        </td>
    </tr>
`;

const createdTemplate = (quiz) =>
    html`
        <article class="preview layout">
            <div class="right-col">
                <a class="action cta" href="/details/${quiz.objectId}"
                    >View Quiz</a
                >
                ${sessionStorage.getItem('userId') == quiz.ownerId.objectId
                    ? html` <a class="action cta" href="/edit/${quiz.objectId}"
                              ><i class="fas fa-edit"></i
                          ></a>
                          <a
                              class="action cta"
                              href="#"
                              @click=${deleteQuiz.bind(null, quiz.objectId)}
                              ><i class="fas fa-trash-alt"></i
                          ></a>`
                    : null}
            </div>
            <div class="left-col">
                <h3>
                    <a class="quiz-title-link" href="/details/${quiz.objectId}"
                        >${quiz.title}</a
                    >
                </h3>
                <span class="quiz-topic">Topic: Hardware</span>
                <div class="quiz-meta">
                    <span>${quiz.questionCount} questions</span>
                    <span>|</span>
                    <span>Taken ${quiz.timesSoluted} times</span>
                </div>
            </div>
        </article>
    `;

export async function renderProfile(ctx) {
    render(loadingTemplate, document.querySelector('main'));
    const userId = ctx.params.id;
    const user = await getUserById(userId);
    const userSubmitions = await getSolutionsForUser(userId);
    render(template(user), document.querySelector('main'));
    if (userSubmitions.results.length > 0) {
        render(
            userSubmitions.results.map(solutionsTemplate),
            document.querySelector('tbody')
        );
    } else {
        render(html`<p>No solutions yet</p>`, document.querySelector('tbody'));
    }
    render(loadingTemplate, document.querySelector('.alt-page'));
    const userQuizes = await getCreationsForUser(userId);
    userQuizes.results.forEach(async (quiz) => {
        const timesSoluted = await getSubmitionsForQuiz(quiz.objectId);
        quiz.timesSoluted = timesSoluted.count;
    });
    setTimeout(() => {
        if (userQuizes.results.length > 0) {
            render(
                userQuizes.results.map(createdTemplate),
                document.querySelector('.alt-page')
            );
        } else {
            render(
                html`<p>No quizes yet</p>`,
                document.querySelector('.alt-page')
            );
        }
    }, 500);
}

async function deleteQuiz(id, e) {
    e.preventDefault();
    const confirmed = confirm('Are you sure you want to delete this quiz?');
    if (confirmed) {
        await deleteQuizById(id);
        page.redirect('/profile/' + sessionStorage.getItem('userId'));
    }
}
