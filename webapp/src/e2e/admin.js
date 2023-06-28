import { Selector } from 'testcafe';

fixture('Admin tests')
    .page('https://localhost:4200');

const roleSelect = Selector('#role');
const roleOption = roleSelect.find('option');

test('CRUD of users', async t => {
    // Login
    await t
        .typeText('#username', 'admin')
        .typeText('#password', 'admin')
        .click('#submit')
        .expect(Selector('h1').innerText).eql('Lista de usuarios');

    // Click en crear usuario y creamos uno nuevo
    await t
        .setNativeDialogHandler(() => true)
        .click("#createUser")
        .typeText('#username', 'testusere2e')
        .click(roleSelect)
        .click(roleOption.withText('Profesor'))
        .click('#submit')

    // Vemos que se ha creado correctamente
    await t.expect(Selector('#TESTUSERE2E').innerText).eql('TESTUSERE2E');

    // Clicamos en el nombre y editamos el nombre
    await t
        .setNativeDialogHandler(() => true)
        .click('#TESTUSERE2E')
        .typeText('#username', 'testusere2e2')
        .click('#submit')

    // Vemos que se ha actualizado correctamente
    await t.expect(Selector('#TESTUSERE2E2').innerText).eql('TESTUSERE2E2');

    // Finalmente borramos el usuario
    await t
        .setNativeDialogHandler(() => true)
        .click('#deleteTESTUSERE2E2')

    await t.expect(Selector('#TESTUSERE2E2').exists).eql(false)
});

test('CRUD of courses', async t => {
    // Obtener las dimensiones de la pantalla
    const { width, height } = await t.eval(() => ({
        width: window.screen.width,
        height: window.screen.height,
    }));

    // Establecer el tamaño de la ventana del navegador al tamaño de la pantalla
    await t.resizeWindow(width, height);
    // Login
    await t
        .typeText('#username', 'admin')
        .typeText('#password', 'admin')
        .click('#submit')
        .expect(Selector('h1').innerText).eql('Lista de usuarios')
        .click('#courses') // Vamos a la lista de cursos

    // Click en crear course y creamos uno nuevo
    await t
        .setNativeDialogHandler(() => true)
        .click("#createCourse")
        .typeText('#name', 'testCourse')
        .typeText('#description', 'testCourse')
        .click('#submit')

    // Vemos que se ha creado correctamente
    await t.expect(Selector('#testCourse').innerText).eql('testCourse');

    // Clicamos en el nombre y editamos el nombre
    await t
        .setNativeDialogHandler(() => true)
        .click('#testCourse')
        .typeText('#name', 'testCourse2')
        .click('#submit')

    // Vemos que se ha actualizado correctamente
    await t.expect(Selector('#testCourse2').innerText).eql('testCourse2');

    // Finalmente borramos el curso
    await t
        .setNativeDialogHandler(() => true)
        .click('#deletetestCourse2')

    await t.expect(Selector('#testCourse2').exists).eql(false)
});
