import React, { Component, PropTypes as T } from 'react'
import { Form, Icon, Button, message } from 'antd'
import fetch from 'isomorphic-fetch'
import { origin } from '../../config'
import $ from './style.css'
import AlertURLDetail from './AlertURLDetail'
import PrefixedURL from '../MainSection/forms/custom/PrefixedURL'

class Settings extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isAlertURLDetailVisible: false,
      isTesting: false,
    }
    this.submit = this.submit.bind(this)
    this.toggleAlertURLDetail = this.toggleAlertURLDetail.bind(this)
  }
  componentDidMount() {
    fetch(`${origin}/settings`)
    .then(res => res.json())
    .then((settings) => {
      this.setState(settings)
    })
  }
  submit() {
    const data = this.props.form.getFieldsValue()
    fetch(`${origin}/settings`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
    .then(() => {
      message.success('更新成功')
    })
  }
  toggleAlertURLDetail() {
    this.setState({
      isAlertURLDetailVisible: !this.state.isAlertURLDetailVisible,
    })
  }
  render() {
    const { Item } = Form
    const { getFieldDecorator } = this.props.form
    const settings = this.state
    const { getFieldValue } = this.props.form

    return (<Form className={$.settings}>
      <Item label="用于接收报警的 URL" style={{ marginBottom: 0 }}>
        {getFieldDecorator('alertURL', {
          initialValue: settings.alertURL,
        })(<PrefixedURL />)}
      </Item>

      <p style={{ height: 32, lineHeight: '32px' }}>
        <a style={{ float: 'right' }} onClick={this.toggleAlertURLDetail}>
          <Icon type={this.state.isAlertURLDetailVisible ? 'up' : 'down'} /> 详情
        </a>
      </p>

      <div style={{ display: this.state.isAlertURLDetailVisible ? 'block' : 'none' }}>
        <AlertURLDetail alertURL={getFieldValue('alertURL')} />
      </div>

      <Button
        onClick={this.submit}
        size="large"
        type="primary"
      >更新</Button>
    </Form>)
  }
}

Settings.propTypes = {
  form: T.shape({
    getFieldDecorator: T.func,
    getFieldsValue: T.func,
    getFieldValue: T.func,
  }),
}

export default Form.create()(Settings)