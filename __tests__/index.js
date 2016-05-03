jest.unmock('../index');

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import Bem from '../index';

let getClassName = (component, ref) => {
  let domBlock = TestUtils.renderIntoDocument(component),
    domRef = ref && domBlock.refs[ref];
  return ReactDOM.findDOMNode(domRef || domBlock).className;
}

describe('Bem mixin', () => {
  it('should support force block naming via special component property', () => {
    let Block = React.createClass({
      bemComponentName: 'ForcedName',
      mixins: [ Bem ],
      render() {
        return (
          <div className={this.b_()}>
            Some content here
          </div>
        )
      }
    });

    expect(getClassName(<Block />))
      .toBe('forcedName');
  });

  describe('should provide main BEM notation', () => {
    it('1. block naming', () => {
      let Block = React.createClass({
        mixins: [ Bem ],
        render() {
          return <div className={this.b_()}>JustBlock</div>;
        }
      });

      expect(getClassName(<Block />))
        .toBe('block');
    });

    it('2. element naming', () => {
      let Block = React.createClass({
        mixins: [ Bem ],
        render() {
          return (
            <div className={this.b_()}>
              <div ref="element" className={this.b_('-element')} />
            </div>
          )
        }
      });

      expect(getClassName(<Block />, 'element'))
        .toBe('block-element');
    });

    it('3. modificators for a block', () => {
      let Block = React.createClass({
        mixins: [ Bem ],
        render() {
          return (
            <div className={this.b_('_modificator')}>
              <div ref="element" className={this.b_('-element')} />
            </div>
          )
        }
      });

      expect(getClassName(<Block />))
        .toBe('block block_modificator');
    });

    it('4. modificators for an element', () => {
      let Block = React.createClass({
        mixins: [ Bem ],
        render() {
          return (
            <div className={this.b_()}>
              <div ref="element" className={this.b_('-element_modificator')} />
            </div>
          )
        }
      });

      expect(getClassName(<Block />, 'element'))
        .toBe('block-element block-element_modificator');
    });
  });

  describe('should have some sugar for modificators', () => {
    it('multiple modificators for a block', () => {
      let Block = React.createClass({
        mixins: [ Bem ],
        render() {
          return (
            <div className={this.b_([ '_modificator', '_anotheModificator' ])}>
              <div ref="element" className={this.b_('-element')} />
            </div>
          )
        }
      });

      expect(getClassName(<Block />))
        .toBe('block block_modificator block_anotheModificator');
    });

    it('state matching', () => {
      let Block = React.createClass({
        mixins: [ Bem ],
        getInitialState() {
          return {
            styleModificator: false,
            statusModificator: true
          }
        },
        render() {
          return (
            <div className={this.b_([ '_styleModificator', '_statusModificator' ])}>
              <div ref="element" className={this.b_('-element')} />
            </div>
          )
        }
      });

      expect(getClassName(<Block />))
        .toBe('block block_statusModificator');
    });
  });

  describe('should support naming propagation via className property', () => {
    it('it should be possible to propagate full naming to child component', () => {
      let JustLetter = React.createClass({
        mixins: [ Bem ],
        render() {
          return (<span className={this.b_()}>A</span>)
        }
      });

      let Block = React.createClass({
        mixins: [ Bem ],
        render() {
          return (
            <div className={this.b_()}>
              {[...Array(3)].map((x, ind) =>
                <JustLetter key={ind} ref={`deep${ind}`} className={this.b_('-deepElement_withMod')} />
              )}
            </div>
          )
        }
      });

      expect(getClassName(<Block />, 'deep0'))
        .toBe('block-deepElement block-deepElement_withMod');
    });

    it('it should be possible to use block name in child component', () => {
      let JustLetter = React.createClass({
        mixins: [ Bem ],
        render() {
          return (<span className={this.b_('-deepElement', 'overflow')}>A</span>)
        }
      });

      let Block = React.createClass({
        mixins: [ Bem ],
        render() {
          return (
            <div className={this.b_()}>
              {[...Array(3)].map((x, ind) =>
                <JustLetter key={ind} ref={`deep${ind}`} className={this.b_()} />
              )}
            </div>
          )
        }
      });

      expect(getClassName(<Block />, 'deep0'))
        .toBe('block-deepElement');
    });

    it('it should be possible to use ANY block name in child component', () => {
      let JustLetter = React.createClass({
        mixins: [ Bem ],
        render() {
          return (<span className={this.b_('-deepElement', 'overflow')}>A</span>)
        }
      });

      let Block = React.createClass({
        mixins: [ Bem ],
        render() {
          return (
            <div className={this.b_()}>
              {[...Array(3)].map((x, ind) =>
                <JustLetter key={ind} ref={`deep${ind}`} className={this.b_('goodLetter')} />
              )}
            </div>
          )
        }
      });

      expect(getClassName(<Block />, 'deep0'))
        .toBe('goodLetter-deepElement');
    });

    it('it should be possible to force modificator naming in child component', () => {
      let JustLetter = React.createClass({
        mixins: [ Bem ],
        render() {
          return (<span className={this.b_('', 'inherit')}>A</span>)
        }
      });

      let Block = React.createClass({
        mixins: [ Bem ],
        render() {
          return (
            <div className={this.b_()}>
              {[...Array(3)].map((x, ind) =>
                <JustLetter key={ind} ref={`deep${ind}`} className="_withStyle" />
              )}
            </div>
          )
        }
      });

      expect(getClassName(<Block />, 'deep0'))
        .toBe('justLetter justLetter_withStyle');
    });
  });

  describe('should have fallback for dumb components', () => {
    it('should support force block naming via helper', () => {
      let
        b_ = Bem.asHelper('WholePage'),
        Block = React.createClass({
        render() {
          return (
            <div className={b_()}>
              Some content here
            </div>
          )
        }
      });

      expect(getClassName(<Block />))
        .toBe('wholePage');
    });
  });
});
