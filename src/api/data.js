import { del, get, post, put } from "./api.js";

export async function getQuizes(){
    return await get('https://parseapi.back4app.com/classes/Quizzes')
}

export async function getQuizByQuery(query, topic){
    return await get(encodeURI('https://parseapi.back4app.com/classes/Quizzes?where={"title":{"$regex":"^' + query + '"}}'))
}

export async function getQuizesByTopic(topic){
    return await get(encodeURI('https://parseapi.back4app.com/classes/Quizzes?where={"topic":{"$regex":"^' + topic + '"}}'))
}

export async function getMostRecentQuiz(){
    return await get('https://parseapi.back4app.com/classes/Quizzes?order=-createdAt')
}

export async function getNumberOfQuizes(){
    return await get('https://parseapi.back4app.com/classes/Quizzes?count=1')
}

export async function getSubmitionsForQuiz(id){
    return await get(encodeURI('https://parseapi.back4app.com/classes/Solutions?where={"quiz":{"__type":"Pointer","className":"Quizzes","objectId":"' + id + '"}}&count=1'))
}

export async function getTopics(){
    return await get(encodeURI('https://parseapi.back4app.com/aggregate/Quizzes?count=1&distinct=topic'))
}

export async function getQuizById(id){
    return await get('https://parseapi.back4app.com/classes/Quizzes/' + id)
}

export async function createNewQuiz(quiz){
    return await post('https://parseapi.back4app.com/classes/Quizzes', quiz)
}

export async function getQuestionsByQuizId(quizId){
    return await get(encodeURI('https://parseapi.back4app.com/classes/Questions?where={"quiz":{"__type":"Pointer","className":"Quizzes","objectId":"' + quizId + '"}}'))
}

export async function getNumberOfQuestionsForQuiz(quizId){
    return await get(encodeURI('https://parseapi.back4app.com/classes/Questions?where={"quiz":{"__type":"Pointer","className":"Quizzes","objectId":"' + quizId + '"}}&count=1'))
}

export async function updateQuizQuestionNumbers(quizId, questions){
    return await put(encodeURI('https://parseapi.back4app.com/classes/Quizzes/' + quizId), {questionCount: questions})
}

export async function deleteQuestionById(id){
    return await del('https://parseapi.back4app.com/classes/Questions/' + id)
}

export async function uploadSubmition(submition){
    return await post('https://parseapi.back4app.com/classes/Solutions', submition)
}

export async function getUserById(id){
    return await get('https://parseapi.back4app.com/users/' + id)
}

export async function getSolutionsForUser(id){
    return await get(encodeURI('https://parseapi.back4app.com/classes/Solutions?where={"ownerId":{"__type":"Pointer","className":"_User","objectId":"' + id + '"}}'))
}

export async function getCreationsForUser(id){
    return await get(encodeURI('https://parseapi.back4app.com/classes/Quizzes?where={"ownerId":{"__type":"Pointer","className":"_User","objectId":"' + id + '"}}'))
}

export async function deleteQuizById(id){
    return await del('https://parseapi.back4app.com/classes/Quizzes/' + id)
}

export async function createQuestion(question){
    const body = 
    {
        "text": question.text,
        "answers": question.answers,
        "correctIndex": Number(question.correctIndex),
        "quiz": {
          "__type": "Pointer",
          "className": "Quizzes",
          "objectId": question.quizId
        }
    }
    return await post('https://parseapi.back4app.com/classes/Questions', body)
}