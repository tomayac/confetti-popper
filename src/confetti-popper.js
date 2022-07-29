import Confetti from './confetti.js';

const template = document.createElement('template');
template.innerHTML = `<button type="button">🎉</button>`;

const COUNT = 'count'
const POWER = 'power'
const SIZE = 'size'
const FADE = 'fade'
const DESTROY_TARGET = 'destroy-target'

// See https://html.spec.whatwg.org/multipage/common-dom-interfaces.html ↵
// #reflecting-content-attributes-in-idl-attributes.
const installStringReflection = (obj, attrName, propName = attrName) => {
  Object.defineProperty(obj, propName, {
    enumerable: true,
    get() {
      const value = this.getAttribute(attrName);
      return value === null ? '' : value;
    },
    set(v) {
      this.setAttribute(attrName, v);
    },
  });
};

const installBoolReflection = (obj, attrName, propName = attrName) => {
  Object.defineProperty(obj, propName, {
    enumerable: true,
    get() {
      return this.hasAttribute(attrName);
    },
    set(v) {
      if (v) {
        this.setAttribute(attrName, '');
      } else {
        this.removeAttribute(attrName);
      }
    },
  });
};

class ConfettiPopper extends HTMLElement {
  #confetti;
  #button;

  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.append(template.content.cloneNode(true));
    this.#button = this.shadowRoot.querySelector('button');
    this.#confetti = new Confetti(this.#button);

    this.#button.addEventListener('click', () => {
      this.#dispatchEvent('confetti', {
        count: this.count,
        power: this.power,
        size: this.size,
        fade: this.fade,
        destroyTarget: this.destroyTarget,
      });
    });

    installStringReflection(this, COUNT)
    installStringReflection(this, POWER)
    installStringReflection(this, SIZE)

    installBoolReflection(this, FADE)
    installBoolReflection(this, DESTROY_TARGET)
  }

  connectedCallback() {
    const confetti = this.#confetti;

    this[COUNT] = this[COUNT] || 100;
    confetti.setCount(Number(this[COUNT]));

    this[POWER] = this[POWER] || 25;
    confetti.setPower(Number(this[POWER]));

    this[SIZE] = this[SIZE] || 1;
    confetti.setSize(Number(this[SIZE]));

    this[FADE] = this[FADE] || false;
    confetti.setFade(this[FADE]);

    this[DESTROY_TARGET] = this[DESTROY_TARGET] || false;
    confetti.destroyTarget(this[DESTROY_TARGET]);
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    const confetti = this.#confetti;
    switch (attrName) {
      case COUNT:
        confetti.setCount(Number(newVal));
        break;
      case POWER:
        confetti.setPower(Number(newVal));
        break;
      case SIZE:
        confetti.setSize(Number(newVal));
        break;
      case FADE:
        confetti.setFade(this[FADE]);
        break;
      case DESTROY_TARGET:
        confetti.destroyTarget(this[DESTROY_TARGET]);
        this.#button.style.visibility = 'visible';
        break;
    }
  }

  static get observedAttributes() {
    return [COUNT, POWER, SIZE, FADE, DESTROY_TARGET];
  }

  #dispatchEvent(type, value) {
    this.dispatchEvent(new CustomEvent(type, {
      bubbles: true,
      composed: true,
      detail: value,
    }));
  }
}

customElements.define('confetti-popper', ConfettiPopper);
