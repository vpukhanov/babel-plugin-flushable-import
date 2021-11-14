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
    'static import': `import("./Foo")`,
    'static import (with relative paths)': `import("../../Foo")`,
    'static import (with file extension)': `import("./Foo.js")`,
    'existing chunkName': `import(/* webpackChunkName: 'Bar' */ "./Foo")`,
    'multiple imports': 'import("one"); import("two"); import("three");',
  },
})
