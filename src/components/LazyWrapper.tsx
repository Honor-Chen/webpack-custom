import { FC, Suspense, lazy } from 'react'

interface ILazyWrapperProps {
  componentName: string
  [key: string]: any
}

const LazyWrapper: FC<ILazyWrapperProps> = ({ componentName, ...otherProps }) => {
  const LazyComponent = lazy(() => import(`@/components/${componentName}`))
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent {...otherProps} />
    </Suspense>
  )
}

export default LazyWrapper
