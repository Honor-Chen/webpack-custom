import { ReactNode } from 'react'
import { createRoot } from 'react-dom/client'

import App from '@/App'

/* console.log('process :>> ', process.env.BASE_ENV);
console.log('process :>> ', process.env.NODE_ENV);
console.log('process :>> ', process.env); */

function render(Component: ReactNode) {
  const rootEle = document.getElementById('root')

  rootEle && createRoot(rootEle).render(Component)
}

render(<App />)
