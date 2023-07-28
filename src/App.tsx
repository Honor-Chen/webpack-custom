import { Suspense, lazy, useState } from 'react'

import Age from '@/components/Age'
import DemoOne from '@/components/DemoOne'

import bigImg from '@/assets/images/big_img.jpg'
import smallImg from '@/assets/images/logo.png'
import lessStyles from './index.less'
import LazyWrapDemo from './components/LazyWrapDemo'

// TODO：转换资源未正确转换
// import jsonList from './test.json';
// console.log("🌐 ~ file: App.tsx:6 ~ jsonList:", JSON.parse(jsonList))

function name(txt: string) {
  return `hello ${txt}`
}
name('123456')

const PreFetchDemo = lazy(
  () =>
    import(
      /* webpackChunkName: "PreFetchDemo" */
      /* webpackPrefetch: true */
      '@/components/PreFetchDemo'
    )
)

const PreLoadDemo = lazy(
  () =>
    import(
      /* webpackChunkName: "PreloadDemo" */
      /* webpackPreload: true */
      '@/components/PreloadDemo'
    )
)

function App() {
  const [show, setShow] = useState(false)

  return (
    <div>
      <h2>webpack5-react-ts Go....</h2>
      <div className={lessStyles.lessBox}>
        <div className={lessStyles.box}>lessBox</div>
        <img src={smallImg} alt='小于10kb的图片' />
        <img src={bigImg} alt='大于于10kb的图片' />
        <div className={lessStyles.smallImg}>小图片背景</div>
        <div className={lessStyles.bigImg}>大图片背景</div>
      </div>
      <hr />
      <Age />
      <hr />
      <DemoOne />
      <hr />
      <LazyWrapDemo />
      <hr />
      <button
        onClick={() => {
          setShow(!show)
        }}
      >
        SHOW - 11
      </button>
      {show && (
        <Suspense fallback={<div>loading...</div>}>
          <PreFetchDemo />
        </Suspense>
      )}
      {show && (
        <Suspense fallback={<div>loading...</div>}>
          <PreLoadDemo />
        </Suspense>
      )}
    </div>
  )
}

export default App
