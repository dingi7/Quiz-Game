import {html, render} from 'https://unpkg.com/lit-html?module';
import { createQuestion, deleteQuestionById, getNumberOfQuestionsForQuiz, getQuestionsByQuizId, getQuizById, updateQuizQuestionNumbers } from 'https://dingi7.github.io/Quiz-Game/src/api/data.js';
import { loadingTemplate } from 'https://dingi7.github.io/Quiz-Game/views/loading.js';
import page from '//unpkg.com/page/page.mjs';

const createdQuestions = (question, index) => html`
    <div id="created">
    <article class="editor-question">
        <div class="layout">
            <div class="question-control">
                <button class="input submit action" @click=${editReq.bind(null,question)}><i class="fas fa-edit"></i> Edit</button>
                <button class="input submit action" @click=${deleteReq.bind(null,question)}><i class="fas fa-trash-alt"></i> Delete</button>
            </div>
            <h3>${question.text}</h3>
        </div>
        <form>
            <p class="editor-input">This is the ${index + 1} question.</p>
            <div class="editor-input">
                <label class="radio">
                    <input class="input" type="radio" name="question-2" value="0" disabled />
                    <i class="fas fa-check-circle"></i>
                </label>
                <span>${question.answers[0]}</span>
            </div>
            <div class="editor-input">
                <label class="radio">
                    <input class="input" type="radio" name="question-2" value="1" disabled />
                    <i class="fas fa-check-circle"></i>
                </label>
                <span>${question.answers[1]}</span>
            </div>
            <div class="editor-input">
                <label class="radio">
                    <input class="input" type="radio" name="question-2" value="2" disabled />
                    <i class="fas fa-check-circle"></i>
                </label>
                <span>${question.answers[2]}</span>
            </div>
        </form>
    </article>
    </div>`;

const addButton = (id) => html`
<article class="editor-question">
        <div class="editor-input">
            <button class="input submit action" id='newQuestion' @click=${addQuestion.bind(null,id)}>
                <i class="fas fa-plus-circle"></i>
                Add question
            </button>
        </div>
    </article>
    <input class="input submit action" type="submit" value="Save" @click=${save}>
`

const quizQuestions = (index, id) => html`

    <div class="pad-large alt-page">
        <article class="editor-question">
            <div class="layout">
                <div class="question-control">
                    <button class="input submit action" id="save" @click=${addQuestionReq.bind(null,id)}>
                        <i class="fas fa-check-double"></i> Save
                    </button>
                    <button class="input submit action" id="cancel" @click=${cancel.bind(null, id)}>
                        <i class="fas fa-times"></i> Cancel
                    </button>
                </div>
                <h3>Question ${index}</h3>
            </div>
            <form>
                <textarea
                    class="input editor-input editor-text"
                    name="text"
                    placeholder="Enter question"
                ></textarea>
                <div class="editor-input">
                    <label class="radio">
                        <input
                            class="input"
                            type="radio"
                            name="question-1"
                            value="0"
                        />
                        <i class="fas fa-check-circle"></i>
                    </label>

                    <input class="input" type="text" name="answer-0" />

                </div>
                <div class="editor-input">
                    <label class="radio">
                        <input
                            class="input"
                            type="radio"
                            name="question-1"
                            value="1"
                        />
                        <i class="fas fa-check-circle"></i>
                    </label>

                    <input class="input" type="text" name="answer-1" />

                </div>
                <div class="editor-input">
                    <label class="radio">
                        <input
                            class="input"
                            type="radio"
                            name="question-1"
                            value="2"
                        />
                        <i class="fas fa-check-circle"></i>
                    </label>

                    <input class="input" type="text" name="answer-2" />

                </div>
                <div class="editor-input">
                </div>
            </form>
        </article>
    </div>
`;

const createdTemplate = (title, topic) => html`
<div class="pad-large alt-page">
    <form>
        <label class="editor-label layout">
            <span class="label-col">Title:</span>
            <input class="input i-med" type="text" name="title" value="${title}"></label>
        <label class="editor-label layout">
            <span class="label-col">Topic:</span>
            <select class="input i-med" name="topic">
            <option value="${topic}">${topic}</option>
            </select>
        </label>
    </form>
    <header class="pad-large">
        <h2>Questions</h2>
    </header>
    <div id="questions"></div>
</div>

`

export async function renderEdit(ctx){
    render(loadingTemplate,document.querySelector('main'))
    const id = ctx.params.id;
    const quiz = await getQuizById(id);
    const questions = await getNumberOfQuestionsForQuiz(id)
    render(createdTemplate(quiz.title, quiz.topic), document.querySelector('main'));
    if(questions.count > 0){
        if(quiz.questionCount !== questions.count){
            await updateQuizQuestionNumbers(id, questions.count);
        }
        const questions1 = await getQuestionsByQuizId(id);
        render(questions1.results.map((question, index) => createdQuestions(question, index)), document.querySelector('#questions'));
    }
    render(addButton(id), document.querySelector('.pad-large.alt-page'));
}

async function addQuestion(id,e) {
    e.preventDefault()
    render(loadingTemplate, document.querySelector('.pad-large.alt-page'))
    let questionCount = await getNumberOfQuestionsForQuiz(id);
    await updateQuizQuestionNumbers(id, questionCount.count + 1) ;
    render(quizQuestions(questionCount.count+1, id), document.querySelector('.pad-large.alt-page'));
}

function cancel(id, e){
    e.preventDefault()
    render(loadingTemplate, document.querySelector('.pad-large.alt-page'))
    setTimeout(() => {
    render(addButton(id), document.querySelector('.pad-large.alt-page'));
    }, 200);
}

async function addQuestionReq(id,e){
    e.preventDefault()
    const question = document.querySelector('textarea[name="text"]').value;
    const answers = Array.from(document.querySelectorAll('input[name^="answer-"]')).map(x => x.value);
    const correct = document.querySelector('input[name^="question-"]:checked').value;
    if(!question || answers[0] === "" || !correct || answers[1] === "" || answers[2] === ""){
        return alert('All fields are required!');
    }
    const quiz = {
        text: question,
        answers,
        correctIndex: correct,
        quizId : id
    }
    render(loadingTemplate, document.querySelector('.pad-large.alt-page'))
    await createQuestion(quiz);
    const questions1 = await getQuestionsByQuizId(id);
    render(questions1.results.map((question, index) => createdQuestions(question, index)), document.querySelector('#questions'));
    render(addButton(id), document.querySelector('.pad-large.alt-page'));
}

function save(e){
    e.preventDefault()
    page.redirect('/')
}

async function deleteReq(question,e){
    e.preventDefault()
    render(loadingTemplate, document.querySelector('.pad-large.alt-page'))
    await deleteQuestionById(question.objectId);
    let questionCount = await getNumberOfQuestionsForQuiz(question.objectId);
    await updateQuizQuestionNumbers(question.objectId, questionCount.count - 1) ;
    const questions1 = await getQuestionsByQuizId(question.quiz.objectId);
    render(questions1.results.map((question, index) => createdQuestions(question, index)), document.querySelector('#questions'));
    render(addButton(question.quiz.objectId), document.querySelector('.pad-large.alt-page'));
}

async function editReq(question,e){
    e.preventDefault()
    render(loadingTemplate, document.querySelector('.pad-large.alt-page'))
    await deleteQuestionById(question.objectId)
    const questions1 = await getQuestionsByQuizId(question.quiz.objectId);
    render(questions1.results.map((question, index) => createdQuestions(question, index)), document.querySelector('#questions'));
    render(quizQuestions(null, question.quiz.objectId), document.querySelector('.pad-large.alt-page'));
    document.querySelector('textarea[name="text"]').value = question.text;
    document.querySelectorAll('input[name^="answer-"]')[0].value = question.answers[0];
    document.querySelectorAll('input[name^="answer-"]')[1].value = question.answers[1];
    document.querySelectorAll('input[name^="answer-"]')[2].value = question.answers[2];
    document.querySelector(`input[value="${question.correctIndex}"]`).checked = true;
}