BEMixin
=======

BEM is methodology for maintainable and meaningful markup process. See more at [bem.info](http://bem.info)

Bemixin provides React mixin for comfortable work with classnames. Please see examples in the test folder.

Similiar projects:
https://github.com/azproduction/b_
https://github.com/albburtsev/bem-cn

They are very mature well-documented tools. Their overall functionality may suit you. Bemixin, on the other hand, has a different purpose. The main idea of Bemixin is to use internal state of a React component
during classname constructing. Going this way we are implicit in our code:

If component returns
```
  <div className={this.b_('_modificator')}>JustBlock</div>
```
we can change its classname by renaming the component name itself. Also, Bemixin uses a component state for
toggling modificators. Again, please see examples in the test folder.
