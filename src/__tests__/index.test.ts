import plugin from '../index'

import pluginTester from 'babel-plugin-tester'

const babelOptions = {
  babelrc: false,
}

pluginTester({
  plugin,
  pluginName: 'flushable-import',
  babelOptions,
  snapshot: true,
  tests: {
    'static import': 'import("./Foo")',
    'static import (with relative paths)': 'import("../../Foo")',
    'static import (with file extension)': 'import("./Foo.js")',
    'static import (string template)': 'import(`./base`)',
    'static import (string template + relative paths)': 'import(`../../base`)',
    'static import (import as function with relative paths + nested folder)':
      'const obj = {component:()=>import(`../components/nestedComponent`)}; ()=> obj.component()',
    'static import (relative paths + nested folder)':
      'import(`../components/nestedComponent`)',
    'dynamic import (string template)': 'import(`./base/${page}`)',
    'dynamic import (string template with nested folder)':
      'import(`./base/${page}/nested/folder`)',
    'dynamic import (string template with multiple nested folders)':
      'import(`./base/${page}/nested/{$another}folder`)',
    'dynamic import (string template - dynamic at 1st segment)':
      'import(`./${page}`)',
    'dynamic import (string template + relative paths)':
      'import(`../../base/${page}`)',
    'existing chunkName': 'import(/* webpackChunkName: \'Bar\' */"./Foo")',
    'multiple imports': 'import("one"); import("two"); import("three");',
  },
})
