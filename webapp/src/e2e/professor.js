import { Selector } from 'testcafe';


fixture('Professor test')
    .page('https://localhost:4200')

const typeSelect = Selector('#typeSelect');

test('CRUD of questions and surveys', async t => {
    const { width, height } = await t.eval(() => ({
        width: window.screen.width,
        height: window.screen.height,
    }));

    await t.resizeWindow(width, height);
    await t
        .setNativeDialogHandler(() => true)
        .typeText('#username', 'profesor')
        .typeText('#password', 'profesor')
        .click('#submit')
        .click('#questions')
        .click('#createQuestion')
        .click('#options')
        .click(typeSelect)
        .click("#true_false")
        .typeText('#time', '5')
        .pressKey('esc')
        .typeText('#description', "testQuestion")
        .typeText('#answer1', "testAnswer1")
        .typeText('#answer2', "testAnswer2")
        .click('#mat-mdc-checkbox-1-input')
        .click('#submitCreate')
        .click('#library')
        .click('#questions')
        .click('#questionHeadertestQuestion')
        .click('#edittestQuestion')
        .typeText('#description', "2")
        .click('#submitUpdate')
        .click('#surveys')
        .click('#createSurvey')
        .typeText('#title', 'surveyTest')
        .click('#addQuestions')
        .click('#addtestQuestion2')
        .pressKey('esc')
        .click('#submit')
        .click('#library')
        .click('#surveys')
        .click('#editsurveyTest')
        .typeText('#title', '2')
        .click('#submit')
        .click('#library')
        .click('#surveys')
        .click('#deletesurveyTest2')
        .expect(Selector('#deletesurveyTest2').exists).eql(false)
        .click('#questions')
        .click('#questionHeadertestQuestion2')
        .click('#deletetestQuestion2')
        .expect(Selector('#deletetestQuestion2').exists).eql(false)
});