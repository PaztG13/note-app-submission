class FooterBar extends HTMLElement {
    _shadowRoot = null;
    _style = null;

    constructor() {
        super();

        this._shadowRoot = this.attachShadow({ mode: 'open' });
        this._style = document.createElement('style');
    }

    connectedCallback() {
        this.render();
    }

    _emptyContent() {
        this._shadowRoot.innerHTML = ``;
    }

    _updateStyle() {
        this._style.textContent = `
            :host {
                display: block;
            }

            div {
                text-align: center;
            }

            span {
                padding: 2% 0;
                font-size: .8em;
                font-weight: 300;
                letter-spacing: 5px;
            }

            @media only screen and (max-width: 720px) {
                div {
                    margin: 15% 0;
                }
            }
        `;
    }

    render() {
        this._emptyContent();
        this._updateStyle();

        this._shadowRoot.appendChild(this._style);
        this._shadowRoot.innerHTML += `
            <div>
                <span>Dava Agestha Putra &copy; 2025</span>
            </div>
        `;
    }
}

customElements.define('footer-bar', FooterBar);