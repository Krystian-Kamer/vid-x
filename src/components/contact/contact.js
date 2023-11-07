import { mainSection, contactSection, backToHomeBtn} from '../../../main.js';

export const showContactSection = () => {
    mainSection.style.display = 'none';
    backToHomeBtn.style.visibility = 'visible';
    contactSection.style.display = 'flex';
  };