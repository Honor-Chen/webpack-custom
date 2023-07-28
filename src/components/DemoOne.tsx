import * as _ from 'lodash'

export default function DemoOne(props: any) {
  if (_.isEmpty(props)) {
    return <div>暂无数据</div>
  }
  return <div>Demo_01</div>
}
