import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import IletisimFormu from './IletisimFormu';
import { click } from '@testing-library/user-event/dist/click';

 const passingName="Johnson";
 const failingname="John";
 const passingSurname="Doe";
 const failinSurname="";
 const passingEmail="johnson@doe.com";
 const failingEmail="johnson@doe";



test('hata olmadan render ediliyor', () => {
 render(<IletisimFormu/>);

});

test('iletişim formu headerı render ediliyor', () => {
    render(<IletisimFormu/>);
    expect(screen.getByText("İletişim Formu")).toBeInTheDocument();
});

test('kullanıcı adını 5 karakterden az girdiğinde BİR hata mesajı render ediyor.', async () => {
    render(<IletisimFormu/>);
    const nameInput=screen.getByLabelText("Ad*");
    userEvent.type(nameInput,failingname);

    await waitFor(() =>{
        expect(screen.queryAllByTestId("error").length).toBe(1);
    expect(
        screen.queryByText("Hata: ad en az 5 karakter olmalıdır.")
        ).toBeInTheDocument();
    });
    });

test('kullanıcı inputları doldurmadığında ÜÇ hata mesajı render ediliyor.', async () => {
    render(<IletisimFormu/>);
    userEvent.click(screen.getByText("Gönder"));
    const biDegisken=screen.getAllByTestId("error");
    await waitFor (() => {
        expect(biDegisken.length).toBe(3);

    });
});

test('kullanıcı doğru ad ve soyad girdiğinde ama email girmediğinde BİR hata mesajı render ediliyor.', async () => {
    render(<IletisimFormu/>);
    const name=screen.getByLabelText("Ad*");
    userEvent.type(name,passingName);
    const surname=screen.getByLabelText("Soyad*");
    userEvent.type(surname,passingSurname);
    userEvent.click(screen.getByText("Gönder"));

    await waitFor(()=>{
        expect(screen.queryAllByTestId("error").length).toBe(1);
   });

});

test('geçersiz bir mail girildiğinde "email geçerli bir email adresi olmalıdır." hata mesajı render ediliyor', 
async () => {
    render(<IletisimFormu/>);
   userEvent.type( screen.queryByPlaceholderText("yüzyılıngolcüsü@hotmail.com"),failingEmail);
    await waitFor(() =>{
    expect(
        screen.queryByText("Hata: email geçerli bir email adresi olmalıdır.")
        ).toBeInTheDocument();
    });

});

test('soyad girilmeden gönderilirse "soyad gereklidir." mesajı render ediliyor', 
async () => {
    render(<IletisimFormu/>);
    userEvent.type( screen.queryByPlaceholderText("yüzyılıngolcüsü@hotmail.com"),
    passingEmail);
    userEvent.type(screen.getByLabelText("Ad*"),passingName);
    userEvent.click(screen.getByText("Gönder"));
    await waitFor(() =>{
        expect(
            screen.queryByText("Hata: soyad gereklidir.")
            ).toBeInTheDocument();
        });
    

});

test('ad,soyad, email render ediliyor. mesaj bölümü doldurulmadığında hata mesajı render edilmiyor.', 
async () => {
    render(<IletisimFormu/>);
    userEvent.type( screen.queryByPlaceholderText("yüzyılıngolcüsü@hotmail.com"),
    passingEmail);
    userEvent.type(screen.getByLabelText("Ad*"),passingName);
    userEvent.type(screen.getByLabelText("Soyad*"),passingSurname);
    userEvent.click(screen.getByText("Gönder"));

    await waitFor(()=>{
        expect(screen.queryAllByTestId("error").length).toBe(0);
   });


});

test('form gönderildiğinde girilen tüm değerler render ediliyor.', 
async () => {
    render(<IletisimFormu/>);

    userEvent.type( screen.queryByPlaceholderText("yüzyılıngolcüsü@hotmail.com"),
    passingEmail);
    userEvent.type(screen.getByLabelText("Ad*"),passingName);
    userEvent.type(screen.getByLabelText("Soyad*"),passingSurname);
    userEvent.type(screen.getByLabelText("Mesaj"),"hello world");

    userEvent.click(screen.getByText("Gönder"));
    await waitFor(()=>{
        expect(screen.queryByTestId("firstnameDisplay").textContent).toBe(`Ad:${passingName}`);
        expect(screen.queryByTestId("lastnameDisplay").textContent).toBe(`Soyad:${passingSurname}`);
        expect(screen.queryByTestId("emailDisplay").textContent).toBe(`Email:${passingEmail}`);
        expect(screen.queryByTestId("messageDisplay").textContent).toBe();

    });
});
