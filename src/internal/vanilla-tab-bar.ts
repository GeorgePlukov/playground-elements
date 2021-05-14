/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {html, css, LitElement, customElement} from 'lit-element';

export * from './vanilla-tab.js';

import type {VanillaTab} from './vanilla-tab.js';

@customElement('vanilla-tab-bar')
export class VanillaTabBar extends LitElement {
  static styles = css`
    :host {
      display: flex;
      overflow-x: auto;
    }

    :host::-webkit-scrollbar {
      display: none;
    }

    div {
      display: flex;
      flex: 1;
    }
  `;

  /**
   * Get or set the active tab.
   */
  get active(): VanillaTab | undefined {
    return this._active;
  }

  set active(tab: VanillaTab | undefined) {
    if (this._active === tab) {
      return;
    }
    if (this._active !== undefined) {
      this._active.active = false;
    }
    if (tab !== undefined) {
      tab.active = true;
    }
    this._active = tab;
  }

  private _tabs: VanillaTab[] = [];
  private _active: VanillaTab | undefined = undefined;

  render() {
    return html`
      <div role="tablist">
        <slot
          @tabchange=${this._onTabchange}
          @slotchange=${this._onSlotchange}
          @keydown=${this._onKeydown}
        ></slot>
      </div>
    `;
  }

  private _onSlotchange(event: Event) {
    this._tabs = (event.target as HTMLSlotElement).assignedElements() as VanillaTab[];
    const prevActive = this._active;
    this._active = undefined;
    for (let i = 0; i < this._tabs.length; i++) {
      const tab = this._tabs[i];
      tab.idx = i;
      if (this._active !== undefined) {
        tab.active = false;
      } else if (tab.active === true) {
        this._active = tab;
      }
    }
    if (this._active === undefined && prevActive !== undefined) {
      this.dispatchEvent(
        new CustomEvent<{tab?: VanillaTab; previous?: VanillaTab}>(
          'tabchange',
          {
            detail: {
              tab: undefined,
              previous: prevActive,
            },
            bubbles: true,
          }
        )
      );
    }
  }

  private _onTabchange(
    event: CustomEvent<{tab?: VanillaTab; previous?: VanillaTab}>
  ) {
    const tab = event.detail.tab;
    if (tab !== this.active) {
      // TODO(aomarks) Previous isn't correct when creating a new file.
      event.detail.previous = this.active;
      this.active = tab;
      tab?.scrollIntoView({behavior: 'smooth'});
    }
  }

  private _onKeydown(event: KeyboardEvent) {
    const oldIdx = this._active?.idx ?? 0;
    let newIdx = oldIdx;
    if (event.key === 'ArrowLeft') {
      if (oldIdx > 0) {
        newIdx--;
      }
    } else if (event.key === 'ArrowRight') {
      if (oldIdx < this._tabs.length - 1) {
        newIdx++;
      }
    }
    if (newIdx !== oldIdx) {
      const tab = this._tabs[newIdx];
      tab.active = true;
      tab.focus();
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'vanilla-tab-bar': VanillaTabBar;
  }
}
