import { useState } from 'react'
import LazyWrapper from '@/components/LazyWrapper'

// const LazyDemo = lazy(() => import(/*  webpackChunkName: "my-chunk-name" */ '@/components/LazyDemo'))

function LazyWrapDemo() {
  const [show, setShow] = useState(false)

  const handleLazyLoadCSS = () => {
    import('@/components/LazyWrapDemo.less')
    setShow(true)
  }

  return (
    <>
      <h2 onClick={handleLazyLoadCSS}>展示懒加载组件、加载样式</h2>

      {/* {show && <Suspense fallback={<div>Loading....</div>}><LazyDemo/></Suspense>} */}

      {/* 使用封装的组件 LazyWrapper 来异步加载组件 */}
      {show && <LazyWrapper componentName='LazyDemo' />}
    </>
  )
}

export default LazyWrapDemo
