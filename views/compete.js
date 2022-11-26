import { html, render } from 'https://unpkg.com/lit-html?module';
import { getQuestionsByQuizId, getQuizById, uploadSubmition } from '../src/api/data.js';
import { loadingTemplate } from './loading.js';
import { renderSummary } from './summary.js';

const template = (quiz, index) => html`
    <section id="quiz">
        <header class="pad-large">
            <h1>${quiz.title}: Question ${index} / ${quiz.questionCount}</h1>
            <nav class="layout q-control">
                <span class="block">Question index</span>
                <div id="count"></div>
            </nav>
        </header>
        <div class="pad-large alt-page">
            <article class="question"></article>
        </div>
    </section>
`;

const question = (question, index, count) => html`
    <p class="q-text">${question.text}</p>

    <div>
        <label class="q-answer radio">
            <input class="input" type="radio" name="question-1" value="0" />
            <i class="fas fa-check-circle"></i>
            ${question.answers[0]}
        </label>

        <label class="q-answer radio">
            <input class="input" type="radio" name="question-1" value="1" />
            <i class="fas fa-check-circle"></i>
            ${question.answers[1]}
        </label>
        <label class="q-answer radio">
            <input class="input" type="radio" name="question-1" value="2" />
            <i class="fas fa-check-circle"></i>
            ${question.answers[2]}
        </label>
    </div>

    <nav class="q-control">
        <span class="block">${count - index} questions remaining</span>
        <a id="prev" class="action" href="javascript:void(0)"><i class="fas fa-arrow-left"></i> Previous</a>
        <a class="action" href="#" id="startOver"
            ><i class="fas fa-sync-alt"></i> Start over</a
        >
        <div class="right-col">
            <a
                id="next"
                class="action"
                href="/compete/${question.quiz.objectId}/${Number(index) + 1}"
                >Next <i class="fas fa-arrow-right"></i
            ></a>
            <a class="action" href="#" id="submit">Submit answers</a>
        </div>
    </nav>
`;

export async function initQuiz(ctx, next) {
    const quizId = ctx.params.id;
    const quiz = await getQuizById(quizId);
    const quizQuestrions = quiz.questionCount;
    render(template(quiz, 1), document.querySelector('main'));
    let indexTemplate = ``;
    for (let i = 0; i < quizQuestrions; i++) {
        indexTemplate += `<a class="q-index" href="/compete/${quizId}/${
            i + 1
        }" id="${i}"></a>`;
    }
    document.querySelector('#count').innerHTML = indexTemplate;
    document.getElementById('0').classList.add('q-current');
    renderQuestion(quiz);
}

async function renderQuestion(quiz) {
    render(loadingTemplate, document.querySelector('article'));
    let index = 0;
    const quizId = quiz.objectId;
    const allQuizQuestions = await getQuestionsByQuizId(quizId);
    const location = document.querySelector('.question');
    render(
        question(
            allQuizQuestions.results[index],
            index + 1,
            quiz.questionCount
        ),
        location
    );
    let submition = [];
    allQuizQuestions.results.forEach((q, i) => {
        submition[i] = {
            question: q.text,
            answers: [q.answers[0], q.answers[1], q.answers[2]],
            answer: null,
            correctAnswer: q.correctIndex,
        };
    });
    document.querySelectorAll('.q-answer').forEach((a) => {
        a.addEventListener('click', (e) => {
            if(e.target.tagName == 'INPUT'){
            submition[index].answer = e.target.value;
            document.getElementById(`${index}`).classList.add('q-answered')
}
        });
    });
    document.querySelector('#next').addEventListener('click', (e) => {
        e.preventDefault();
        index++;
        if(index >= quiz.questionCount){
            index--
            return alert('This was the last question!');
        }
        render(
            question(
                allQuizQuestions.results[index],
                index + 1,
                quiz.questionCount
            ),
            location
        );
        document.querySelectorAll(`input`).forEach((i) => {
            i.checked = false;
        });
        document.querySelectorAll('.q-index').forEach((i)=>{
            i.classList.remove('q-current');
        })
        document.getElementById(`${index}`).classList.add('q-current');
        if(submition[index].answer != null){
            document.querySelector(`input[value="${submition[index].answer}"]`).checked = true;
        }
    });
    document.querySelector('#prev').addEventListener('click', (e) => {
        e.preventDefault();
        index--;
        if(index < 0){
            index++
            return alert('There is no previous question!');
        }
        render(
            question(
                allQuizQuestions.results[index],
                index + 1,
                quiz.questionCount
            ),
            location
        );        
        document.querySelectorAll(`input`).forEach((i) => {
            i.checked = false;
        });
        document.querySelectorAll('.q-index').forEach((i)=>{
            i.classList.remove('q-current');
        })
        document.getElementById(`${index}`).classList.add('q-current');
        if(submition[index].answer != null){
            document.querySelector(`input[value="${submition[index].answer}"]`).checked = true;
        }
    });
    document.querySelectorAll('.q-index').forEach((i) => {
        i.addEventListener('click', (e) => {
            e.preventDefault();
            index = Number(e.target.id);
            render(
                question(
                    allQuizQuestions.results[index],
                    index + 1,
                    quiz.questionCount
                ),
                location
            );
            document.querySelectorAll(`input`).forEach((i) => {
                i.checked = false;
            });
            document.querySelectorAll('.q-index').forEach((i)=>{
                i.classList.remove('q-current');
            })
            document.getElementById(`${index}`).classList.add('q-current');
            if(submition[index].answer != null){
                document.querySelector(`input[value="${submition[index].answer}"]`).checked = true;
            }
        });
    });
    document.querySelector('#startOver').addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.q-index').forEach((i)=>{
            i.classList.remove('q-current');
            i.classList.remove('q-answered');
        })
        renderQuestion(quiz)
    });
    document.querySelector('#submit').addEventListener('click', async(e) => {
        e.preventDefault();
        // do error handling
        let correctAnswers = 0;
        submition.forEach((q) => {
            if (q.answer == q.correctAnswer) {
                correctAnswers++;
            }
        });
        let res = {
            "quiz": {
                "__type": "Pointer",
                "className": "Quizzes",
                "objectId": quizId
            },
            "correct": correctAnswers,
            "ownerId": {
                "__type": "Pointer",
                "className": "_User",
                "objectId": sessionStorage.getItem("userId")
            },
            "allQuestions": allQuizQuestions.results.length,
            "title": quiz.title,
        };
        await uploadSubmition(res)
        renderSummary(quiz, correctAnswers, submition);
    });
}
