import './ui/layouts/base.scss'
import './ui/layouts/main.js'
import './lib/icon.png'

import header from './ui/components/app-header/index'
import navigation from './ui/components/app-navigation/index'

header.renderSync().appendTo(document.body)
navigation.renderSync().appendTo(document.body)
