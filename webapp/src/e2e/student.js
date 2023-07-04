import { Selector } from 'testcafe';

fixture('Student test')
    .page('https://localhost:4200')



test('Modify password', async t => {
    const { width, height } = await t.eval(() => ({
        width: window.screen.width,
        height: window.screen.height,
    }));

    await t.resizeWindow(width, height);

    await t
        .setNativeDialogHandler(() => true)
        .typeText('#username', 'estudiante')
        .typeText('#password', 'test')
        .click("#submit")
        .click("#profile")
        .typeText('#password', 'test')
        .typeText('#passwordBis', 'test2')
        .typeText('#passwordBisConfirm', 'test2')
        .click("#submit")
        .click("#logout")
        .typeText('#username', 'estudiante')
        .typeText('#password', 'test2')
        .click("#submit")
        .expect(Selector('h2').innerText).eql("Mis cursos")
        .click("#profile")
        .typeText('#password', 'test2')
        .typeText('#passwordBis', 'test')
        .typeText('#passwordBisConfirm', 'test')
        .click("#submit")
});