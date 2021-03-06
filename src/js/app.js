import { settings, select, templates, classNames } from './settings.js';
import Product from './components/Product.js';
import Cart from './components/Cart.js';
import Booking from './components/Booking.js';


const app = {

  initBooking: function () {
    const thisApp = this;
    /*znajduje kontener widgetu (czyli całą zakładkę Booking) do rezerwacji stron*/
    const bookingElem = document.querySelector(select.containerOf.booking);
    /*tworzy NOWĄ instalację klasy Booking i przekazują konstruktorowi znaleziony kontener widgetu*/
    thisApp.booking = new Booking(bookingElem);
  },

  initPages: function () {
    const thisApp = this;

    thisApp.pages = document.querySelector(select.containerOf.pages).children;
    thisApp.navLinks = document.querySelectorAll(select.nav.links);

    const idFromHash = window.location.hash.replace('#/', '');

    let pageMatchingHash = thisApp.pages;

    for (let page of thisApp.pages) {
      if (page.id == idFromHash) {
        pageMatchingHash = page.id;
        break;
      }
    }
    thisApp.activatePage(pageMatchingHash);

    thisApp.activatePage(thisApp.pages[0].id);
    for (let link of thisApp.navLinks) {
      link.addEventListener('click', function (event) {
        const clickedElement = this;
        event.preventDefault();

        /*get page id from href attribute*/
        const id = clickedElement.getAttribute('href').replace('#', '');

        /*run thiApp.activatePage with that id*/
        thisApp.activatePage(id);

        /* change URL hash*/
        window.location.hash = '#/' + id;
      });
    }
  },

  activatePage: function (pageId) {
    const thisApp = this;
    /*add class"active" to matching pages, remove from non-matching*/
    for (let page of thisApp.pages) {
      page.classList.toggle(classNames.pages.active, page.id == pageId);
    }

    /*add class"active" to matching links, remove from non-matching*/
    for (let link of thisApp.navLinks) {

      link.classList.toggle(
        classNames.nav.active,
        link.getAttribute('href') == '#' + pageId
      );
    }
  },


  initCart: function () {
    const thisApp = this;
    const cartElem = document.querySelector(select.containerOf.cart);
    thisApp.cart = new Cart(cartElem);

    thisApp.productList = document.querySelector(select.containerOf.menu);

    thisApp.productList.addEventListener('add-to-cart', function (event) {
      app.cart.add(event.detail.product);
    });
  },

  initData: function () {
    const thisApp = this;
    thisApp.data = {};
    /*zapisujemy w stałej url adres endpointuz ktorego maja zostać pobrane dane */
    const url = settings.db.url + '/' + settings.db.product;
    /* wywołanie zapytania AJAX za pomocą funkcji fetch z zastosowaniem metody .then*/
    fetch(url)
      /* chainnig czyli łączenie kilku metod ze sobą za pomocą kropki*/
      .then(function (rawResponse) {
        /* otrzymaną odpowiedź konwertujemy z JSONa na tablicę*/
        return rawResponse.json();
      })
      .then(function (parsedResponse) {
        /* po otrzymaniu skorwentowanej odpowiedzi parsedResponse wyswietlamy w konsoli*/
        console.log('parsedResponse', parsedResponse);
        /* save parsedResponse as thisApp.data.products*/
        thisApp.data.products = parsedResponse;
        /* execute initMenu method*/
        thisApp.initMenu();
      });
    console.log('thisApp.data', JSON.stringify(thisApp.data));
  },

  initMenu: function () {
    const thisApp = this;
    console.log('thisApp.data:', thisApp.data);

    for (let productData in thisApp.data.products) {
      new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);
    }
  },

  init: function () {
    const thisApp = this;
    console.log('*** App starting ***');
    console.log('thisApp:', thisApp);
    console.log('classNames:', classNames);
    console.log('settings:', settings);
    console.log('templates:', templates);

    thisApp.initPages();

    thisApp.initData();

    thisApp.initCart();

    thisApp.initBooking();

  },
};

app.init();
