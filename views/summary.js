import { render, html } from 'https://unpkg.com/lit-html?module';

const summaryTemplate = (quiz, correct, per) => html`
    <section id="summary">
        <div class="hero layout">
            <article class="details glass">
                <h1>Quiz Results</h1>
                <h2>${quiz.title}</h2>

                <div class="summary summary-top">${per}%</div>

                <div class="summary">
                    ${correct}/${quiz.questionCount} correct answers
                </div>

                <a class="action cta" href="/compete/${quiz.objectId}"
                    ><i class="fas fa-sync-alt"></i> Retake Quiz</a
                >
                <a class="action cta" href="#" id="details"
                    ><i class="fas fa-clipboard-list"></i> See Details</a
                >
            </article>
        </div>
    </section>
`;

const subTemp = (submition, index) => html`
    ${Number(submition.answer) == Number(submition.correctAnswer)
        ? html`
              <article class="preview" id="correct">
                  <span class="s-correct">
                      Question ${index}
                      <i class="fas fa-check"></i>
                  </span>
                  <div class="right-col">
                      <button class="action">See question</button>
                  </div>
                  <div id="info" display="none">
                      <p>${submition.question}</p>
                  </div>
              </article>
          `
        : html`
                <article class="preview" id="wrong">
                        <span class="s-incorrect">
                        Question ${index}
                            <i class="fas fa-times"></i>
                        </span>
                        <div class="right-col">
                            <button class="action">Reveal answer</button>
                        </div>
                        <div id="info" display="none">
                            <p>
                                ${submition.question}
                            </p>
                            <div class="s-answer">
                                ${
                                    submition.correctAnswer == 0
                                        ? html`
                                              <span class="s-correct">
                                                  ${submition.answers[0]}
                                                  <i class="fas fa-check"></i>
                                                  <strong
                                                      >Correct answer</strong
                                                  >
                                              </span>
                                          `
                                        : null
                                }
                                ${
                                    Number(submition.answer) == 0
                                        ? html`
                                              <span class="s-incorrect">
                                                  ${submition.answers[0]}
                                                  <i class="fas fa-times"></i>
                                                  <strong>Your choice</strong>
                                              </span>
                                          `
                                        : null
                                }
                                ${
                                    submition.correctAnswer != 0 &&
                                    Number(submition.answer) != 0
                                        ? html` <span>
                                              ${submition.answers[0]}
                                          </span>`
                                        : null
                                }
                            </div>
                            <div class="s-answer">
                            ${
                                submition.correctAnswer == 1
                                    ? html`
                                          <span class="s-correct">
                                              ${submition.answers[1]}
                                              <i class="fas fa-check"></i>
                                              <strong>Correct answer</strong>
                                          </span>
                                      `
                                    : null
                            }
                                ${
                                    Number(submition.answer) == 1
                                        ? html`
                                              <span class="s-incorrect">
                                                  ${submition.answers[1]}
                                                  <i class="fas fa-times"></i>
                                                  <strong>Your choice</strong>
                                              </span>
                                          `
                                        : null
                                }
                                ${
                                    submition.correctAnswer != 1 &&
                                    Number(submition.answer) != 1
                                        ? html` <span>
                                              ${submition.answers[1]}
                                          </span>`
                                        : null
                                }
                            </div>
                            <div class="s-answer">
                            ${
                                submition.correctAnswer == 2
                                    ? html`
                                          <span class="s-correct">
                                              ${submition.answers[2]}
                                              <i class="fas fa-check"></i>
                                              <strong>Correct answer</strong>
                                          </span>
                                      `
                                    : null
                            }
                                ${
                                    Number(submition.answer) == 2
                                        ? html`
                                              <span class="s-incorrect">
                                                  ${submition.answers[2]}
                                                  <i class="fas fa-times"></i>
                                                  <strong>Your choice</strong>
                                              </span>
                                          `
                                        : null
                                }
                                ${
                                    submition.correctAnswer != 2 &&
                                    Number(submition.answer) != 2
                                        ? html` <span>
                                              ${submition.answers[2]}
                                          </span>`
                                        : null
                                }
                        </div>
                </article>
                `}
`;

const newd = html` <div class="pad-large alt-page"></div>`;

export function renderSummary(quiz, correctAnswers, submition) {
    console.log(submition);
    let percent = Math.floor((correctAnswers / quiz.questionCount) * 100);
    render(
        summaryTemplate(quiz, correctAnswers, percent),
        document.querySelector('main')
    );
    document.getElementById('details').addEventListener('click', (e) => {
        e.preventDefault();
        render(newd, document.querySelector('main'));
        render(
            submition.map((s, i) => subTemp(s, i)),
            document.querySelector('.pad-large')
        );
        document.querySelectorAll('button').forEach((b) => {
            b.addEventListener('click', (e) => {
                e.preventDefault();
                if (
                    e.target.textContent == 'See question' ||
                    e.target.textContent == 'Reveal answer'
                ) {
                    e.target.parentNode.parentNode.querySelector(
                        '#info'
                    ).style.display = 'block';
                    e.target.textContent = 'Hide';
                } else {
                    e.target.parentNode.parentNode.querySelector(
                        '#info'
                    ).style.display = 'none';
                    if (
                        e.target.parentNode.parentNode.querySelector('#correct')
                    ) {
                        e.target.textContent = 'See question';
                    } else {
                        e.target.textContent = 'Reveal answer';
                    }
                }
            });
        });
    });
}
