import Logo from './components/logo.svelte';
import Contact from './components/contact.svelte';

const {version} = window.dbushell;

const $doc = document.querySelector('.Document');

const $mode = document.querySelector('.Lightbulb');
$mode.addEventListener('click', () => {
  const list = $doc.classList;
  if (list.contains('Lightmode')) {
    list.remove('Lightmode');
    list.add('Darkmode');
    localStorage.setItem('darkmode', 'on');
  } else {
    list.remove('Darkmode');
    list.add('Lightmode');
    localStorage.setItem('darkmode', 'off');
  }
});

const $logo = document.querySelector('#logo');
if ($logo) {
  $logo.innerHTML = '';
  new Logo({
    target: $logo
  });
}

const $form = document.querySelector('#contact-form');
if ($form) {
  $form.innerHTML = '';
  new Contact({
    target: $form
  });
}

if (document.querySelector('pre')) {
  const $prism = document.createElement('link');
  $prism.rel = 'stylesheet';
  $prism.href = `/assets/css/prism.css?v=${version}`;
  document.head.appendChild($prism);
}

if (document.querySelector('code')) {
  var fira = new FontFace(
    'Fira Code Light',
    "url('/assets/fonts/fira-code-light.woff2') format('woff2')",
    {weight: '300', unicodeRange: 'U+0020-007F'}
  );
  Promise.all([fira.load()]).then((fonts) => {
    fonts.forEach((font) => {
      document.fonts.add(font);
    });
  });
}

if ('serviceWorker' in window.navigator) {
  window.navigator.serviceWorker.register('/sw.js');
}
