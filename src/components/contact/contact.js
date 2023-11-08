import { mainSection, contactSection, backToHomeBtn} from '../../../main.js';

export const showContactSection = () => {
    mainSection.style.display = 'none';
    backToHomeBtn.style.visibility = 'visible';
    contactSection.style.display = 'flex';
  };

  export const showMessageAfterSend = () => {
      if (
        document.querySelector('.email').value !== '' &&
        document.querySelector('.textarea').value !== ''
      ) {
        alert(
          `Thank you for sending your message. It means a lot to me. You will be taken to the homepage.`
        );
      } else {
        alert('The email and message fields must be completed.');
      }
  }