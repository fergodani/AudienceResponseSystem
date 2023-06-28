import { Selector } from 'testcafe';

fixture('Getting Started')
    .page('https://localhost:4200');



test('Admin login succesfull', async t => {
    await t
        .typeText('#username', 'admin')
        .typeText('#password', 'admin')
        .click('#submit')
        .expect(Selector('h1').innerText).eql('Lista de usuarios');
});

test('Professor login succesfull', async t => {
    await t
        .typeText('#username', 'profesor')
        .typeText('#password', 'profesor')
        .click('#submit')
        .expect(Selector('#courses').innerText).eql('Cursos')
        .expect(Selector('#questions').innerText).eql('Preguntas')
        .expect(Selector('#surveys').innerText).eql('Cuestionarios');
});

test('Student login succesfull', async t => {
    await t
        .typeText('#username', 'testuser1')
        .typeText('#password', 'test')
        .click('#submit')
        .expect(Selector('h2').innerText).eql('Mis cursos');
});

test('Login fail', async t => {
    await t
        .typeText('#username', 'randomUser')
        .typeText('#password', 'randomPassword')
        .click('#submit')
        .expect(Selector('.alert').innerText).eql('Error: Usuario o contraseña incorrectos');
});