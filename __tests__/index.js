jest.unmock('../index');

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import Bem from '../index';

describe('Bem mixin', () => {
  it('should provide block naming', () => {
    let Block = React.createClass({
      mixins: [ Bem ],
      componentDidMount() {
        expect(ReactDOM.findDOMNode(this).className)
          .toBe('block');
      },

      render() { return <div className={this.b_()}>JustBlock</div>; }
    });

    TestUtils.renderIntoDocument(<Block />);
  });

  it('should provide element naming', () => {
    let Block = React.createClass({
      mixins: [ Bem ],
      componentDidMount() {
        expect(this.refs.element.className)
          .toBe('block-element');
      },

      render() {
        return (
          <div className={this.b_()}>
            <div ref="element" className={this.b_('-element')} />
          </div>
        )
      }
    });

    TestUtils.renderIntoDocument(<Block />);
  });

  it('should provide modificators for a block', () => {
    let Block = React.createClass({
      mixins: [ Bem ],
      componentDidMount() {
        expect(ReactDOM.findDOMNode(this).className)
          .toBe('block block_modificator');
      },

      render() {
        return (
          <div className={this.b_('_modificator')}>
            <div ref="element" className={this.b_('-element')} />
          </div>
        )
      }
    });

    TestUtils.renderIntoDocument(<Block />);
  });

  it('should provide modificators for an element', () => {
    let Block = React.createClass({
      mixins: [ Bem ],
      componentDidMount() {
        expect(this.refs.element.className)
          .toBe('block-element block-element_modificator');
      },

      render() {
        return (
          <div className={this.b_()}>
            <div ref="element" className={this.b_('-element_modificator')} />
          </div>
        )
      }
    });

    TestUtils.renderIntoDocument(<Block />);
  });

  it('should provide multiple modificators for a block', () => {
    let Block = React.createClass({
      mixins: [ Bem ],
      componentDidMount() {
        expect(ReactDOM.findDOMNode(this).className)
          .toBe('block block_modificator block_anotheModificator');
      },

      render() {
        return (
          <div className={this.b_([ '_modificator', '_anotheModificator' ])}>
            <div ref="element" className={this.b_('-element')} />
          </div>
        )
      }
    });
  });

  it('should support state matching (with modificators)', () => {
    let Block = React.createClass({
      mixins: [ Bem ],
      getInitialState() {
        return {
          styleModificator: false,
          statusModificator: true
        }
      },
      componentDidMount() {
        expect(ReactDOM.findDOMNode(this).className)
          .toBe('block block_statusModificator');
      },

      render() {
        return (
          <div className={this.b_([ '_styleModificator', '_statusModificator' ])}>
            <div ref="element" className={this.b_('-element')} />
          </div>
        )
      }
    });

    TestUtils.renderIntoDocument(<Block />);
  });

  it('should support naming via props for element components', () => {
      let JustLetter = React.createClass({
        mixins: [ Bem ],
        render() {
          return (<span className={this.b_()}>A</span>)
        }
      });

      let Block = React.createClass({
        mixins: [ Bem ],
        componentDidMount() {
          expect(ReactDOM.findDOMNode(this.refs.deep0).className)
            .toBe('block-deepElement block-deepElement_withMod');
        },

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

      TestUtils.renderIntoDocument(<Block />);
  });

  it('should support naming via opt param in child components', () => {
      let JustLetter = React.createClass({
        mixins: [ Bem ],
        render() {
          return (<span className={this.b_('-deepElement', 'overflow')}>A</span>)
        }
      });

      let Block = React.createClass({
        mixins: [ Bem ],
        componentDidMount() {
          expect(ReactDOM.findDOMNode(this.refs.deep0).className)
            .toBe('block-deepElement');
        },

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

      TestUtils.renderIntoDocument(<Block />);
  });

  it('should support force bem naming via opt param in child components', () => {
      let JustLetter = React.createClass({
        mixins: [ Bem ],
        render() {
          return (<span className={this.b_('-deepElement', 'overflow')}>A</span>)
        }
      });

      let Block = React.createClass({
        mixins: [ Bem ],
        componentDidMount() {
          expect(ReactDOM.findDOMNode(this.refs.deep0).className)
            .toBe('goodLetter-deepElement');
        },

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

      TestUtils.renderIntoDocument(<Block />);
  });

  it('should support force bem modificators via opt param in child components', () => {
      let JustLetter = React.createClass({
        mixins: [ Bem ],
        render() {
          return (<span className={this.b_('', 'inherit')}>A</span>)
        }
      });

      let Block = React.createClass({
        mixins: [ Bem ],
        componentDidMount() {
          expect(ReactDOM.findDOMNode(this.refs.deep0).className)
            .toBe('justLetter justLetter_withStyle');
        },

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

      TestUtils.renderIntoDocument(<Block />);
  });

  it('should support force block naming via special component field', () => {
      let Block = React.createClass({
        bemComponentName: 'ForcedName',
        mixins: [ Bem ],
        componentDidMount() {
          expect(ReactDOM.findDOMNode(this).className)
            .toBe('forcedName');
        },

        render() {
          return (
            <div className={this.b_()}>
              Some content here
            </div>
          )
        }
      });

      TestUtils.renderIntoDocument(<Block />);
  });

  it('should support force block naming via helper', () => {
      let
        b_ = Bem.asHelper('WholePage'),
        Block = React.createClass({
        componentDidMount() {
          expect(ReactDOM.findDOMNode(this).className)
            .toBe('wholePage');
        },

        render() {
          return (
            <div className={b_()}>
              Some content here
            </div>
          )
        }
      });

      TestUtils.renderIntoDocument(<Block />);
  });
});
