/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {
  html,
  css,
  LitElement,
  customElement,
  property,
  PropertyValues,
} from 'lit-element';
import {ifDefined} from 'lit-html/directives/if-defined.js';

@customElement('vanilla-tab')
export class VanillaTab extends LitElement {
  static styles = css`
    :host {
      display: flex;
    }

    button {
      display: flex;
      align-items: center;
      cursor: pointer;
      background: none;
      border: none;
      padding: 10px;
    }

    :host([active]) > button {
      background: white;
    }

    :host(:hover) > button {
      background: rgb(255, 255, 255, 0.5);
    }
  `;

  /**
   * Whether this tab is currently active. Setting this to true will make this
   * tab active, and the previously active tab inactive.
   */
  @property({type: Boolean, reflect: true})
  active = false;

  /**
   * The aria-controls property.
   */
  @property()
  controls?: string;

  /**
   * The 0-indexed position of this tab within its <vanilla-tab-bar>.
   */
  idx = 0;

  update(changes: PropertyValues) {
    if (this.active && changes.has('active')) {
      this.dispatchEvent(
        new CustomEvent<{tab: VanillaTab; previous?: VanillaTab}>('tabchange', {
          detail: {tab: this},
          bubbles: true,
        })
      );
    }
    super.update(changes);
  }

  render() {
    return html`<button
      part="tab"
      role="tab"
      aria-selected=${this.active ? 'true' : 'false'}
      aria-controls=${ifDefined(this.controls)}
      tabindex=${this.active ? 1 : 0}
      @click=${this._onClick}
    >
      <slot></slot>
    </button>`;
  }

  // /**
  //  * Move this tab to a new 0-indexed position.
  //  */
  // reorder(idx: number) {
  //   if (idx < 0) {
  //     idx = 0;
  //   }
  //   if (idx === this.idx || this.parentElement === null) {
  //     return;
  //   }
  //   const reference = this.parentElement.querySelector(
  //     `vanilla-tab:nth-of-type(${idx + 1})`
  //   );
  //   if (reference === null) {
  //     // Out of bounds, move to the end.
  //     this.parentElement.appendChild(this);
  //   } else {
  //     reference.insertAdjacentElement(
  //       idx < this.idx ? 'beforebegin' : 'afterend',
  //       this
  //     );
  //   }
  //   // Note we don't need to set this.idx ourselves, because vanilla-tab-bar
  //   // will fix all indexes after slotchange (and in the out of bounds case, it
  //   // would be wrong anyway).
  // }

  private _onClick() {
    this.active = true;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'vanilla-tab': VanillaTab;
  }
}
