import React, { PureComponent } from 'react'

function AddAge(Target: Function) {
  Target.prototype.age = 30
}

@AddAge
export default class Age extends PureComponent {
  age?: number

  render() {
    return (
      <div>
        {'>>>>> *****'}This is Class Component{this.age}
      </div>
    )
  }
}
